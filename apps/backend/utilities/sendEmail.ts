import { Resend } from "resend";

/**
 * Sends a 6-digit OTP to the user's email using Resend.
 *
 * In local development, an absent email key logs the code to the server console
 * so the flow is testable. Production never logs OTPs and fails the request
 * when delivery cannot be configured or completed.
 */
export const sendEmail = async (email: string, otp: string) => {
  const apiKey = process.env.RESEND_EMAIL_API;
  const isProduction = process.env.NODE_ENV === "production";

  if (!apiKey) {
    if (!isProduction) {
      console.log("📧 [dev] RESEND_EMAIL_API is empty — no email sent.");
      console.log(`📧 [dev] OTP for ${email}: ${otp}`);
      return;
    }
    throw new Error("Email delivery is not configured.");
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Learnova verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1c2129; border-radius: 12px;">
          <h2 style="color: #ffffff; margin: 0 0 8px;">Verify your email</h2>
          <p style="color: #b3a6ff; margin: 0 0 16px;">Use the code below to finish creating your Learnova account.</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8b73fb; margin: 0;">${otp}</p>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 20px;">This code expires in 5 minutes. If you didn't request it, you can safely ignore this email.</p>
        </div>
      `,
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    if (!isProduction) {
      console.log(`📧 [dev] OTP for ${email}: ${otp}`);
      return;
    }
    throw error;
  }
};
