import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/forgot-password";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";
import { OtpInput } from "../components/auth/OtpInput";
import { requestPasswordReset, resetPassword } from "../lib/api";
import { ArrowRightIcon, LockIcon, MailIcon } from "../components/landing/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset password — Learnova" },
    {
      name: "description",
      content:
        "Forgot your Learnova password? Request a verification code and choose a new password.",
    },
  ];
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    try {
      await requestPasswordReset(email.trim());
      setStep("reset");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not send a verification code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || otp.length !== 6 || newPassword.length < 8) return;

    setIsSubmitting(true);
    setError("");
    try {
      await resetPassword({ email: email.trim(), otp, newPassword });
      setStep("done");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Could not reset your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
          Reset Password
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
          Forgot your password?
        </h1>
        <p className="mt-3 text-gray-400">
          No worries — we&apos;ll email you a code to choose a new password.
        </p>
      </div>

      {step === "done" ? (
        <div className="mt-8 rounded-xl border border-brand/40 bg-brand/10 p-6 text-center">
          <p className="text-sm text-gray-200">
            Your password has been reset. You can now sign in with the new one.
          </p>
        </div>
      ) : step === "reset" ? (
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <p className="text-center text-sm text-gray-400">
            If an account exists for <span className="font-medium text-white">{email}</span>,
            enter the 6-digit code we sent you.
          </p>
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            disabled={isSubmitting}
            hasError={!!error}
          />
          <AuthField
            label="New password"
            icon={<LockIcon className="size-4" />}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6 || newPassword.length < 8}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Resetting password…" : "Reset password"}
            <ArrowRightIcon className="size-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleRequest} className="mt-8 space-y-5">
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending code…" : "Send verification code"}
            <ArrowRightIcon className="size-4" />
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-gray-400">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-brand-light transition hover:text-brand">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
