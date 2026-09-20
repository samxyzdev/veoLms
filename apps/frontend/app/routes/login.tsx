import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import type { Route } from "./+types/login";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";
import { SocialButtons } from "../components/auth/SocialButtons";
import { signIn } from "../lib/api";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "../components/landing/icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log in — Learnova" },
    {
      name: "description",
      content:
        "Log in to Learnova to continue your learning journey and pick up where you left off.",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /** Submit credentials → `/user/signin`. Only on success go to the dashboard. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      // Credentials were correct and the session cookie is set → dashboard.
      navigate("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
          Welcome Back
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
          Log in to your account
        </h1>
        <p className="mt-3 text-gray-400">
          Enter your details to continue your learning journey.
        </p>
      </div>

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

        <AuthField
          label="Password"
          icon={<LockIcon className="size-4" />}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          minLength={8}
          required
          hint="Password must be at least 8 characters."
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

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 cursor-pointer rounded accent-brand"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="font-medium text-brand-light transition hover:text-brand"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={!email.trim() || password.length < 8 || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
          <ArrowRightIcon className="size-4" />
        </button>
      </form>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-brand-light transition hover:text-brand">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}