import { OtpSchema } from "@repo/zod";
import { Router } from "express";
import { generateOtp } from "../utilities/randomOtp";
import { sendEmail } from "../utilities/sendEmail";
import { hashFunction } from "../utilities/hashFunction";
import { db, otpTable } from "@repo/database";

export const otpRoutes = Router();

otpRoutes.post("generate-otp", async (req, res, next) => {
  // email
  const { success, data, error } = OtpSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten,
    });
  }
  const { email } = data;
  const randomOtp = generateOtp(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  sendEmail(email, randomOtp);
  const hashOtp = hashFunction(randomOtp);
  try {
    await db.insert(otpTable).values({ email, hashOtp, expiresAt });
    return res.status(200).json({
      message: "OTP generated successfully",
    });
  } catch (error) {
    console.error(error);
    // next(error) // globl error handler call
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});
