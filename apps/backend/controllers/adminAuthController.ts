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
  const { success, data, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "40" });
  }

  const { name, email, otp, password } = data;
  if (!(await verifyOtp(email, otp))) {
    return res.status(400).json({
      message:
        "Invalid or expired OTP. Please enter the correct code and try again.",
    });
  }

  try {
    const [createdAdmin] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "admin",
      })
      .returning({ insertedId: usersTable.id });

    if (!createdAdmin) {
      return res.status(500).json({ message: "Could not create admin account." });
    }

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully!",
    });
  } catch (error) {
    return next(error);
  }
};

/** Start a signed session only for a user with the admin role. */
export const signInAdmin = async (req: Request, res: Response) => {
  const { success, data, error } = SigninSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "41" });
  }

  const { email, password } = data;
  const [user] = await db
    .select({
      id: usersTable.id,
      password: usersTable.password,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    return res.status(400).json({
      message: "Account doesn't exist. Please sign up first.",
    });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (user.role !== "admin") {
    return res.status(403).json({ message: "This account is not an admin." });
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

  return res.status(200).json({ message: "Admin signed in successfully" });
};
