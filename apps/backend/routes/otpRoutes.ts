import { OtpSchema } from "@repo/zod";
import { Router } from "express";
import { generateOtp } from "../utilities/randomOtp";
import { sendEmail } from "../utilities/sendEmail";
import { hashFunction } from "../utilities/hashFunction";
import { and, db, eq, otpTable } from "@repo/database";

export const otpRoutes = Router();

otpRoutes.post("/generate-otp", async (req, res, next) => {
  // email
  console.log("genearted otp");
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
  console.log(randomOtp);
  // sendEmail(email, randomOtp);
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

// Inline verification: sirf OTP check karta hai, user create nahi karta,
// aur OTP row delete nahi karta (signup ke time verifyOtp use karega).
otpRoutes.post("/verify-otp", async (req, res) => {
  console.log("verify otp");
  const { email, otp } = req.body ?? {};
  if (
    typeof email !== "string" ||
    typeof otp !== "string" ||
    otp.length !== 6
  ) {
    return res.status(400).json({
      message: "email and 6-digit otp are required",
    });
  }

  try {
    const hashOtp = hashFunction(otp);
    const [isOtpExist] = await db
      .select()
      .from(otpTable)
      .where(and(eq(otpTable.email, email), eq(otpTable.hashOtp, hashOtp)));

    if (!isOtpExist) {
      return res.status(400).json({
        message: "Invalid OTP. Please check the code and try again.",
      });
    }

    if (new Date() > isOtpExist.expiresAt) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    return res.status(200).json({
      valid: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});
