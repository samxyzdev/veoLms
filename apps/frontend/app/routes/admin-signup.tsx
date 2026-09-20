import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import type { Route } from "./+types/admin-signup";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";
import { OtpInput } from "../components/auth/OtpInput";
import { adminSignUp, generateOtp } from "../lib/api";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
} from "../components/landing/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create admin account — Learnova" },
    {
      name: "description",
      content: "Create an admin account for the Learnova admin dashboard.",
    },
  ];
}

/**
 * Admin signup — same two-step flow as student signup:
 *   1. \"details\" — name / email / password.
 *   2. \"otp\"     — a 6-digit code is emailed; the admin account is only
 *                   created when the code is correct, then the user is sent
 *                   to the admin login page.
 */
export default function AdminSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "otp">("details");

  // --- Step 1: account details ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  // --- Step 2: OTP verification ---
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0); // seconds to wait before resend is allowed

  // Countdown for the \"Resend code\" button (starts at 30s).
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

  /** Step 2 submit: verify the code. Correct → create admin account → admin login. */
  async function handleVerify() {
    if (isVerifying || otp.length !== 6) return;

    setIsVerifying(true);
    setOtpError("");
    try {
      await adminSignUp({
        name: fullName.trim(),
        email: email.trim(),
        password,
        otp,
      });
      navigate("/admin/login");
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

  /** \"Resend code\" on the OTP step. */
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

  const allDetailsValid = !!fullName.trim() && !!email.trim() && password.length >= 8;

  return (
    <AuthLayout>
      {step === "details" ? (
        <>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
              <ShieldIcon className="size-3.5" />
              Admin Portal
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Create admin account
            </h1>
            <p className="mt-3 text-gray-400">
              Set up an account with admin access to manage Learnova.
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
              placeholder="admin@example.com"
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
              {isSending ? "Sending code…" : "Continue"}
              <ArrowRightIcon className="size-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already an admin?{" "}
            <Link to="/admin/login" className="font-semibold text-brand-light transition hover:text-brand">
              Log in
            </Link>
          </p>
        </>
      ) : (
        /* -------------------- Step 2: enter the emailed code -------------------- */
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
            <ShieldIcon className="size-3.5" />
            Verify your email
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Check your inbox
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-gray-400">
            We emailed a 6-digit code to{" "}
            <span className="font-medium text-brand-light">{email}</span>. Enter it below to finish
            creating your admin account.
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
              {isVerifying ? "Verifying…" : "Create Admin Account"}
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
              Back to admin details
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}