import { and, db, eq, otpTable } from "@repo/database";
import { hashFunction } from "./hashFunction";

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const hashOtp = hashFunction(otp);

    const [isOtpExist] = await db
      .select()
      .from(otpTable)
      .where(and(eq(otpTable.email, email), eq(otpTable.hashOtp, hashOtp)));

    if (!isOtpExist) {
      return false;
    }
    const currentTime = new Date();
    if (currentTime > isOtpExist.expiresAt) {
      await db.delete(otpTable).where(eq(otpTable.email, email));
      return false;
    }

    await db.delete(otpTable).where(eq(otpTable.email, email));
    return true;
  } catch (error) {
    console.error("OTP verification failed:", error);
    return false;
  }
};
