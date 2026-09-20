import { and, db, eq, otpTable } from "@repo/database";
import { OtpSchema } from "@repo/zod";
import type { Request, Response } from "express";
import { hashFunction } from "../utilities/hashFunction";
import { generateOtp } from "../utilities/randomOtp";
import { sendEmail } from "../utilities/sendEmail";

/** Create and deliver an OTP, replacing any outstanding code for the email. */
export const generateOtpForEmail = async (req: Request, res: Response) => {
  const { success, data, error } = OtpSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  const { email } = data;
  const otp = generateOtp(6);

  try {
    await db.delete(otpTable).where(eq(otpTable.email, email));
    await db.insert(otpTable).values({
      email,
      hashOtp: hashFunction(otp),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/** Check an OTP without consuming it; signup/reset consumes it separately. */
export const validateOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body ?? {};
  const emailResult = OtpSchema.safeParse({ email });
  if (!emailResult.success || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      message: "email and 6-digit otp are required",
    });
  }

  try {
    const [otpRecord] = await db
      .select()
      .from(otpTable)
      .where(
        and(
          eq(otpTable.email, emailResult.data.email),
          eq(otpTable.hashOtp, hashFunction(otp)),
        ),
      );

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP. Please check the code and try again.",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await db
        .delete(otpTable)
        .where(eq(otpTable.email, emailResult.data.email));
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
