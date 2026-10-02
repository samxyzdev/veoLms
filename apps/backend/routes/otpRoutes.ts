import { Router } from "express";
import { generateOtpForEmail, validateOtp } from "../controllers/otpController";

/** HTTP mapping only; OTP workflow lives in the OTP controller. */
export const otpRoutes = Router();

otpRoutes.post("/request", generateOtpForEmail);
otpRoutes.post("/verify", validateOtp);
