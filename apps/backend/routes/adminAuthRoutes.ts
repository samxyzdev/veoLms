import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { asc, db, eq, sessionTable, usersTable } from "@repo/database";
import { verifyOtp } from "../utilities/verifyOtp";
import { hashFunction } from "../utilities/hashFunction";
import { SigninSchema, SignupSchema } from "@repo/zod";

/**
 * Admin auth — same session cookie (`sid`) as regular users, but the account
 * is created with role "admin" and signin only succeeds for admins.
 */
export const adminAuthRoutes: Router = Router();

// Create an admin account (same OTP flow as user signup).
adminAuthRoutes.post("/signup", async (req, res, next) => {
  const { success, data, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "40" });
  }

  const { name, email, otp, password } = data;

  // OTP must be valid and not expired before we create the account.
  const isOtpValid = await verifyOtp(email, otp);
  if (!isOtpValid) {
    return res.status(400).json({
      message:
        "Invalid or expired OTP. Please enter the correct code and try again.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.transaction(async (tx) => {
      const [createAdmin] = await tx
        .insert(usersTable)
        .values({ name, email, password: hashedPassword, role: "admin" })
        .returning({ insertedId: usersTable.id });

      if (!createAdmin) {
        // Throw so drizzle rolls the transaction back.
        throw new Error("Admin_Failed");
      }

      return res.status(201).json({
        success: true,
        message: "Admin account created successfully!",
      });
    });
  } catch (error: any) {
    if (error.message === "Admin_Failed") {
      return res.status(500).json({
        message: "Server error (admin creation failed)",
      });
    }
    next(error);
  }
});

// Sign in — only accounts with role "admin" are allowed past this point.
adminAuthRoutes.post("/signin", async (req, res) => {
  const { success, data, error } = SigninSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error, number: "41" });
  }

  const { email, password } = data;

  const [isUserExist] = await db
    .select({ id: usersTable.id, password: usersTable.password, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!isUserExist) {
    return res.status(400).json({
      message: "Account doesn't exist. Please sign up first.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  if (isUserExist.role !== "admin") {
    return res.status(403).json({
      message: "This account is not an admin.",
    });
  }

  // Keep at most 2 active sessions per account — delete the oldest one.
  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, isUserExist.id))
    .orderBy(asc(sessionTable.createdAt));

  if (sessions.length >= 2) {
    const oldestSession = sessions[0];
    if (oldestSession) {
      await db.delete(sessionTable).where(eq(sessionTable.id, oldestSession.id));
    }
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashFunction(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db
    .insert(sessionTable)
    .values({ userId: isUserExist.id, token: hashedToken, expiresAt });

  res.cookie("sid", token, {
    httpOnly: true,
    secure: false, // for https make true
    signed: true, // required for signedCookie
    sameSite: "lax",
    expires: expiresAt,
  });

  return res.status(200).json({
    message: "Admin signed in successfully",
  });
});