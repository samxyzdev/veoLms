import { useState, type ChangeEvent } from "react";

import { Form, Link, useNavigation } from "react-router";

import { z } from "zod";

import { signinSchema } from "~/lib/auth/signinSchema";

import type { SigninActionData, SigninFormState, SigninTouchedState } from "~/lib/auth/signinTypes";

import { AuthDivider } from "./AuthDivider";
import { AuthFooter } from "./AuthFooter";
import { AuthInput } from "./AuthInput";
import { AuthLayout } from "./AuthLayout";
import { SocialButtons } from "./SocialButtons";

type SignInFormProps = {
  title: string;
  description: string;

  actionData?: SigninActionData;

  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;

  forgotPasswordTo: string;

  showRememberMe?: boolean;
};

export function SignInForm({
  title,
  description,
  actionData,

  footerText,
  footerLinkText,
  footerLinkTo,

  forgotPasswordTo,

  showRememberMe = false,
}: SignInFormProps) {
  const navigation = useNavigation();

  const [form, setForm] = useState<SigninFormState>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [touched, setTouched] = useState<SigninTouchedState>({
    email: false,
    password: false,
  });

  const isSubmitting = navigation.state === "submitting";

  const validationResult = signinSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  const validationErrors: {
    email?: string;
    password?: string;
  } = {};

  if (!validationResult.success) {
    const fieldErrors = z.flattenError(validationResult.error).fieldErrors;

    validationErrors.email = fieldErrors.email?.[0];

    validationErrors.password = fieldErrors.password?.[0];
  }

  const isValid = validationResult.success && form.email.trim().length > 0 && form.password.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (field: keyof SigninTouchedState) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const emailError = touched.email ? validationErrors.email : actionData?.fieldErrors?.email?.[0];

  const passwordError = touched.password ? validationErrors.password : actionData?.fieldErrors?.password?.[0];

  const canSubmit = isValid && !isSubmitting;

  return (
    <AuthLayout title={title} description={description}>
      <SocialButtons />

      <AuthDivider />

      <Form method="post" className="space-y-5">
        {/* Email */}

        <AuthInput
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          error={emailError}
        />

        {/* Password */}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Password</label>

            <Link to={forgotPasswordTo} className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <AuthInput
            label=""
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            error={passwordError}
          />
        </div>

        {/* Remember me */}

        {showRememberMe && (
          <label className={`flex items-center gap-2 text-sm ${isSubmitting ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-500"}`}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-slate-300 accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            />
            Remember me
          </label>
        )}

        {/* Backend errors */}

        {actionData?.formErrors?.map((error) => (
          <p key={error} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
            {error}
          </p>
        ))}

        {/* Submit */}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </Form>

      <AuthFooter text={footerText} linkText={footerLinkText} linkTo={footerLinkTo} />
    </AuthLayout>
  );
}
