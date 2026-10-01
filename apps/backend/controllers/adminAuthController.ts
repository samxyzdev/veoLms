import bcrypt from "bcrypt";
import crypto from "node:crypto";

import { asc, db, eq, sessionTable, usersTable } from "@repo/database";

import { SigninSchema, SignupSchema } from "@repo/zod";

import type { NextFunction, Request, Response } from "express";

import { hashFunction } from "../utilities/hashFunction";
import { verifyOtp } from "../utilities/verifyOtp";

/**
 * Create a course creator account after the standard OTP verification flow.
 */
export const signUpCourseCreator = async (
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
    // Verify OTP before creating the account.
    const otpValid = await verifyOtp(email, otp);

    if (!otpValid) {
      return res.status(400).json({
        message:
          "Invalid or expired OTP. Please enter the correct code and try again.",
      });
    }

    // Check whether an account with this email already exists.
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

    // Hash the password before storing it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the course creator.
    const [createdCourseCreator] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        roles: ["course_creator"],
      })
      .returning({
        id: usersTable.id,
      });

    if (!createdCourseCreator) {
      return res.status(500).json({
        message: "Could not create course creator account.",
      });
    }

    return res.status(201).json({
      message: "Course creator account created successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Sign in only users who have the course_creator role.
 */
export const signInCourseCreator = async (
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
    // Find the user by email.
    const [user] = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
        roles: usersTable.roles,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // Invalid credentials.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Make sure this account is a course creator.
    if (!user.roles?.includes("course_creator")) {
      return res.status(403).json({
        message:
          "You do not have permission to access the course creator area.",
      });
    }

    // Get existing sessions ordered from oldest to newest.
    const sessions = await db
      .select({
        id: sessionTable.id,
        createdAt: sessionTable.createdAt,
      })
      .from(sessionTable)
      .where(eq(sessionTable.userId, user.id))
      .orderBy(asc(sessionTable.createdAt));

    // Allow a maximum of 2 active sessions.
    // If there are already 2, delete the oldest one.
    if (sessions.length >= 2 && sessions[0]) {
      await db.delete(sessionTable).where(eq(sessionTable.id, sessions[0].id));
    }

    // Generate a random session token.
    const token = crypto.randomBytes(32).toString("hex");

    // Session expires after 7 days.
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store only the hashed token in the database.
    await db.insert(sessionTable).values({
      userId: user.id,
      token: hashFunction(token),
      expiresAt,
    });

    // Store the raw token inside a signed HTTP-only cookie.
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
