import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import type { Route } from "./+types/signup";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";
import { OtpInput } from "../components/auth/OtpInput";
import { SocialButtons } from "../components/auth/SocialButtons";
import { generateOtp, signUp } from "../lib/api";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../components/landing/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create your account — Learnova" },
    {
      name: "description",
      content:
        "Join Learnova and start learning smarter with premium courses taught by industry experts.",
    },
  ];
}

/**
 * Signup happens in two steps on the same page:
 *   1. "details" — user fills name / email / password.
 *   2. "otp"     — we email a 6-digit code; the account is only created when
 *                  the code is correct, then the user is sent to the login page.
 */
export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "otp">("details");

  // --- Step 1: account details ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  // --- Step 2: OTP verification ---
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0); // seconds to wait before resend is allowed

  // Countdown for the "Resend code" button (starts at 30s).
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  /** Step 1 submit: email the code, then show the OTP step. */
  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setFormError("");
    try {
      await generateOtp(email.trim());
      setStep("otp");
      setResendIn(30); // user can resend after 30s
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not send the code. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  /** Step 2 submit: verify the code. Correct → create account → login page. */
  async function handleVerify() {
    if (isVerifying || otp.length !== 6) return;

    setIsVerifying(true);
    setOtpError("");
    try {
      await signUp({
        name: fullName.trim(),
        email: email.trim(),
        password,
        otp,
      });
      // Account created + code was right → send the user to log in.
      navigate("/login");
    } catch (error) {
      setOtpError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  /** "Resend code" on the OTP step. */
  async function handleResend() {
    if (isSending || resendIn > 0) return;

    setIsSending(true);
    setOtpError("");
    try {
      await generateOtp(email.trim());
      setOtp("");
      setResendIn(30);
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Could not resend the code. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  /** Leave the OTP step back to the form (fields are kept filled in). */
  function goBackToDetails() {
    setStep("details");
    setOtp("");
    setOtpError("");
  }

  const allDetailsValid =
    !!fullName.trim() && !!email.trim() && password.length >= 8 && agreeToTerms;

  return (
    <AuthLayout>
      {step === "details" ? (
        <>
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
              Join Learnova
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Create your account
            </h1>
            <p className="mt-3 text-gray-400">
              Start learning smarter today — it takes less than a minute.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="mt-8 space-y-5">
            <AuthField
              label="Full Name"
              icon={<UserIcon className="size-4" />}
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
            />

            <AuthField
              label="Email Address"
              icon={<MailIcon className="size-4" />}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <AuthField
              label="Password"
              icon={<LockIcon className="size-4" />}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              minLength={8}
              required
              hint="Use at least 8 characters."
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-gray-500 transition hover:text-gray-300"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              }
            />

            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(event) => setAgreeToTerms(event.target.checked)}
                className="mt-0.5 size-4 cursor-pointer rounded accent-brand"
                required
              />
              <span>
                I agree to the{" "}
                <Link to="#" className="font-medium text-brand-light transition hover:text-brand">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="font-medium text-brand-light transition hover:text-brand">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {formError && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={!allDetailsValid || isSending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
            >
              {isSending ? "Sending code…" : "Create Account"}
              <ArrowRightIcon className="size-4" />
            </button>
          </form>

          <SocialButtons />

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-light transition hover:text-brand">
              Log in
            </Link>
          </p>
        </>
      ) : (
        /* -------------------- Step 2: enter the emailed code -------------------- */
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
            Verify your email
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Check your inbox
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-gray-400">
            We emailed a 6-digit code to{" "}
            <span className="font-medium text-brand-light">{email}</span>. Enter it below to finish
            creating your account.
          </p>

          <div className="mt-8">
            <OtpInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setOtpError("");
              }}
              disabled={isVerifying}
              hasError={!!otpError}
            />

            {otpError && (
              <p className="mt-4 text-sm font-medium text-red-400">{otpError}</p>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
            >
              {isVerifying ? "Verifying…" : "Verify & Create Account"}
              <ArrowRightIcon className="size-4" />
            </button>

            <p className="mt-5 text-sm text-gray-500">
              Didn&apos;t get the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || isSending}
                className="font-semibold text-brand-light transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
              </button>
            </p>

            <button
              type="button"
              onClick={goBackToDetails}
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
            >
              <ArrowRightIcon className="size-3.5 rotate-180" />
              Back to sign up details
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
