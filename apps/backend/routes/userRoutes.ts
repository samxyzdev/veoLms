import { Router, type Request, type Response } from "express";
import { verifyOtp } from "../utilities/verifyOtp";
import { asc, db, eq, sessionTable, usersTable } from "@repo/database";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { hashFunction } from "../utilities/hashFunction";
import { SigninSchema, SignupSchema, UpdateProfileSchema } from "@repo/zod";
import { checkAuth } from "../middleware/checkAuth";

export const userRoutes = Router();

userRoutes.post("/signup", async (req, res, next) => {
  // name , email, password, otp
  console.log("0 object");
  const { success, data, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error,
      number: "4",
    });
  }
  console.log("1");

  const { name, email, otp, password } = data;

  // OTP must be valid and not expired before we create the account.
  // (verifyOtp also deletes the used code row on success.)
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
      const [createUser] = await tx
        .insert(usersTable)
        .values({ name, email, password: hashedPassword })
        .returning({ insertedId: usersTable.id });

      console.log("transatioun 1 completed");

      if (!createUser) {
        // taki drizle transaction failed hone pe drizzle rollback kare.
        throw new Error("User_Failed");
      }

      // 2. Agar code yahan tak pahunch gaya, matlab transaction SUCCESS (Commit) ho gaya
      return res.status(201).json({
        success: true,
        message: "User and root folder created successfully!",
        number: "8",
      });
    });
  } catch (error: any) {
    console.log(error);
    if (error.message === "User_Failed") {
      return res.status(500).json({
        message: "1 server error (user creation failed",
        number: "9",
      });
    }
    next(error);
  }
});

userRoutes.post("/signin", async (req, res) => {
  // email, password
  const { success, data, error } = SigninSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      error,
      number: "11",
    });
  }

  console.log("signin 1");

  const { email, password } = data;
  // email bhi compare ho gayi hai.
  const [isUserExist] = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  console.log("signin 2");

  if (!isUserExist) {
    return res.status(400).json({
      message: "user doesn't exist. please signup",
      number: "12",
    });
  }
  console.log("signin 3");
  // password compare karna hai.
  const isPassworValid = await bcrypt.compare(password, isUserExist.password);
  console.log("signin 4");

  if (!isPassworValid) {
    return res.status(400).json({
      message: "invalid credentials",
      number: "13",
    });
  }
  console.log("signin 5");
  // sesion check 2 se jayad ho to old wale ko delete kar do
  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, isUserExist.id))
    .orderBy(asc(sessionTable.createdAt));
  console.log("Session", sessions);
  console.log(sessions.length);

  console.log("signin 6");

  if (sessions.length >= 2) {
    console.log("inside if of length");
    const oldestSession = sessions[0];

    if (!oldestSession) return;
    console.log("after oldestSession return");
    const result = await db
      .delete(sessionTable)
      .where(eq(sessionTable.id, oldestSession.id));
    console.log(result);
  }

  console.log("signi 7");
  const token = crypto.randomBytes(32).toString("hex");
  // bcrypt isliye use nahi kar rhe taki fast rahe.
  const hashedToken = hashFunction(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  console.log("signin 7");

  try {
    const createSession = await db
      .insert(sessionTable)
      .values({ userId: isUserExist.id, token: hashedToken, expiresAt })
      .returning({ insertedId: sessionTable.id });
    console.log("create session", createSession);
  } catch (error) {
    console.log("create session error", error);
  }

  // if (!createSession) {
  //   return res.status(500).json({
  //     message: "5 Something went wrong",
  //   });
  // }
  // console.log("signin 9");

  res.cookie("sid", token, {
    httpOnly: true,
    secure: false, // for https make true
    signed: true, // required for signedCookie .
    sameSite: "lax",
    expires: expiresAt,
  });
  console.log("signin 10");

  return res.status(200).json({
    message: "User signed successfully",
    number: "14",
  });
});

userRoutes.post("/logout", async (req: Request, res: Response) => {
  // Best effort: delete the session row if one exists, then always clear the
  // cookie so logout works even when the session already expired.
  const { sid } = req.signedCookies;
  if (sid) {
    const hashedToken = crypto.createHash("sha256").update(sid).digest("hex");
    await db.delete(sessionTable).where(eq(sessionTable.token, hashedToken));
  }

  res.clearCookie("sid", {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

userRoutes.patch("/me", checkAuth, async (req: Request, res: Response) => {
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

  // Changing the password requires the current one to be correct.
  if (newPassword) {
    const [existingUser] = await db
      .select({ password: usersTable.password })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!existingUser) {
      return res.status(401).json({ message: "Please relogin" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword ?? "",
      existingUser.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
  }

  // Email must not already belong to another account.
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

  return res.status(200).json({
    message: "Profile updated successfully",
  });
});

userRoutes.get("/me", checkAuth, async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }

  try {
    const userDetails = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return res.status(200).json({
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});
