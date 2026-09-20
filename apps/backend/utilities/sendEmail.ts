import { Resend } from "resend";

/**
 * Sends a 6-digit OTP to the user's email using Resend.
 *
 * DEV NOTE:
 * When `RESEND_EMAIL_API` is empty (or sending fails), the email can't go out,
 * so we log the OTP to the server console instead. That lets you test the whole
 * flow locally without a real key. Add your key in `apps/backend/.env` and the
 * email will be sent for real.
 */
export const sendEmail = async (email: string, otp: string) => {
  const apiKey = process.env.RESEND_EMAIL_API;

  if (!apiKey) {
    console.log("📧 [dev] RESEND_EMAIL_API is empty — no email sent.");
    console.log(`📧 [dev] OTP for ${email}: ${otp}`);
    return;
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
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
    console.log(`📧 OTP email sent to ${email}`);
  } catch (error) {
    // Don't break the request — log the error and the code so local dev still works.
    console.error("Failed to send OTP email:", error);
    console.log(`📧 [dev] OTP for ${email}: ${otp}`);
  }
};
