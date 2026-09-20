import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/forgot-password";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";
import { ArrowRightIcon, MailIcon } from "../components/landing/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset password — Learnova" },
    {
      name: "description",
      content:
        "Forgot your Learnova password? Enter your email and we'll send you a reset link.",
    },
  ];
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: connect to a real password-reset API.
    setSent(true);
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
          No worries — enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      {sent ? (
        <div className="mt-8 rounded-xl border border-brand/40 bg-brand/10 p-6 text-center">
          <p className="text-sm text-gray-200">
            If an account exists for <span className="font-semibold text-white">{email}</span>,
            you&apos;ll receive a reset link shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Send reset link
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