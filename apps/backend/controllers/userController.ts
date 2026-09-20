import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { asc, db, eq, otpTable, sessionTable, usersTable } from "@repo/database";
import {
  OtpSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema,
} from "@repo/zod";
import type { NextFunction, Request, Response } from "express";
import { checkAuth } from "../middleware/checkAuth";
import { hashFunction } from "../utilities/hashFunction";
import { generateOtp } from "../utilities/randomOtp";
import { sendEmail } from "../utilities/sendEmail";
import { verifyOtp } from "../utilities/verifyOtp";

const PASSWORD_RESET_RESPONSE =
  "If an account exists for that email, a verification code has been sent.";

/** Send a password-reset OTP without revealing whether the account exists. */
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = OtpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Please provide a valid email address.",
    });
  }

  const { email } = result.data;

  try {
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return res.status(200).json({ message: PASSWORD_RESET_RESPONSE });
    }

    const otp = generateOtp(6);
    await db.delete(otpTable).where(eq(otpTable.email, email));
    await db.insert(otpTable).values({
      email,
      hashOtp: hashFunction(otp),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail(email, otp);

    return res.status(200).json({ message: PASSWORD_RESET_RESPONSE });
  } catch (error) {
    return next(error);
  }
};

/** Consume a password-reset OTP, change the password, then revoke sessions. */
export const confirmPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = ResetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message:
        "Email, 6-digit code, and a password of at least 8 characters are required.",
    });
  }

  const { email, otp, newPassword } = result.data;

  try {
    if (!(await verifyOtp(email, otp))) {
      return res.status(400).json({
        message: "Invalid or expired verification code.",
      });
    }

    const [user] = await db
      .update(usersTable)
      .set({ password: await bcrypt.hash(newPassword, 10), updatedAt: new Date() })
      .where(eq(usersTable.email, email))
      .returning({ id: usersTable.id });

    if (!user) {
      return res.status(400).json({ message: "Could not reset password." });
    }

    await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));

    return res.status(200).json({
      message: "Password reset successfully. Please sign in again.",
    });
  } catch (error) {
    return next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { success, data, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "4" });
  }

  const { name, email, otp, password } = data;
  if (!(await verifyOtp(email, otp))) {
    return res.status(400).json({
      message:
        "Invalid or expired OTP. Please enter the correct code and try again.",
    });
  }

  try {
    const [createdUser] = await db
      .insert(usersTable)
      .values({ name, email, password: await bcrypt.hash(password, 10) })
      .returning({ insertedId: usersTable.id });

    if (!createdUser) {
      return res.status(500).json({ message: "Could not create account." });
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { success, data, error } = SigninSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "11" });
  }

  const { email, password } = data;
  const [user] = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, user.id))
    .orderBy(asc(sessionTable.createdAt));
  if (sessions.length >= 2) {
    await Promise.all(
      sessions.slice(0, sessions.length - 1).map((session) =>
        db.delete(sessionTable).where(eq(sessionTable.id, session.id)),
      ),
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await db.insert(sessionTable).values({
      userId: user.id,
      token: hashFunction(token),
      expiresAt,
    });
  } catch {
    return res.status(500).json({ message: "Could not create session." });
  }

  res.cookie("sid", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "lax",
    expires: expiresAt,
  });

  return res.status(200).json({ message: "Signed in successfully." });
};

export const logOut = async (req: Request, res: Response) => {
  const { sid } = req.signedCookies;
  if (sid) {
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.token, hashFunction(sid)));
  }

  res.clearCookie("sid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
  }

  const { success, data, error } = UpdateProfileSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: error,
    });
  }

  const { name, email, currentPassword, newPassword } = data;

  if (newPassword) {
    const [existingUser] = await db
      .select({ password: usersTable.password })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!existingUser) {
      return res.status(401).json({ message: "Please relogin" });
    }

    if (!(await bcrypt.compare(currentPassword ?? "", existingUser.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
  }

  if (email) {
    const [emailOwner] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (emailOwner && emailOwner.id !== userId) {
      return res.status(400).json({ message: "Email is already in use" });
    }
  }

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (newPassword) updates.password = await bcrypt.hash(newPassword, 10);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  await db
    .update(usersTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(usersTable.id, userId));

  return res.status(200).json({ message: "Profile updated successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
  }

  try {
    const userDetails = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return res.status(200).json({ userDetails });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { checkAuth };
