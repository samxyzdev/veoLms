import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { asc, db, eq, sessionTable, usersTable } from "@repo/database";
import { SigninSchema, SignupSchema } from "@repo/zod";
import type { NextFunction, Request, Response } from "express";
import { hashFunction } from "../utilities/hashFunction";
import { verifyOtp } from "../utilities/verifyOtp";

/** Create an admin account after the standard OTP verification flow. */
export const signUpAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = SignupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { name, email, otp, password } = result.data;

  try {
    const otpValid = await verifyOtp(email, otp);

    if (!otpValid) {
      return res.status(400).json({
        message:
          "Invalid or expired OTP. Please enter the correct code and try again.",
      });
    }

    const [existingUser] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const [createdAdmin] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "admin",
      })
      .returning({
        id: usersTable.id,
      });

    if (!createdAdmin) {
      return res.status(500).json({
        message: "Could not create admin account.",
      });
    }

    return res.status(201).json({
      message: "Admin account created successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/** Start a signed session only for a user with the admin role. */
export const signInAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = SigninSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { email, password } = result.data;

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to access the admin area.",
      });
    }

    const sessions = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.userId, user.id))
      .orderBy(asc(sessionTable.createdAt));

    if (sessions.length >= 2 && sessions[0]) {
      await db.delete(sessionTable).where(eq(sessionTable.id, sessions[0].id));
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(sessionTable).values({
      userId: user.id,
      token: hashFunction(token),
      expiresAt,
    });

    res.cookie("sid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      sameSite: "lax",
      expires: expiresAt,
    });

    return res.status(200).json({
      message: "Signed in successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
