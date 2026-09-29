import { useState, type ChangeEvent } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";

import { z } from "zod";
import axios from "axios";

import { SignupSchema } from "@repo/zod";

import type { Route } from "./+types/route";
import { api } from "~/lib/axios";
import { AuthLayout } from "../../components/AuthLayout";
import { SocialButtons } from "../../components/SocialButtons";
import { AuthDivider } from "../../components/AuthDivider";
import { AuthInput } from "../../components/AuthInput";
import { AuthFooter } from "../../components/AuthFooter";

/* =========================================================
   Schemas
========================================================= */

const SignupFieldsSchema = SignupSchema.pick({
  name: true,
  email: true,
  password: true,
});

const EmailSchema = SignupFieldsSchema.pick({
  email: true,
});

/* =========================================================
   Types
========================================================= */

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
  terms: boolean;
};

type TouchedState = {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

type ValidationResult = {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

type ActionData = {
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  formErrors?: string[];
};

/* =========================================================
   Validation
========================================================= */

function validateSignupForm(form: FormState): ValidationResult {
  const result = SignupFieldsSchema.safeParse({
    name: form.name,
    email: form.email,
    password: form.password,
  });

  const errors: ValidationResult["errors"] = {};

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;

    errors.name = fieldErrors.name?.[0];
    errors.email = fieldErrors.email?.[0];
    errors.password = fieldErrors.password?.[0];
  }

  if (
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  const isValid =
    result.success &&
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  return {
    isValid,
    errors,
  };
}

/* =========================================================
   Client Action
========================================================= */

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const otp = formData.get("otp");
  const terms = formData.get("terms");

  /* -------------------------------------------------------
     Validate signup fields
  ------------------------------------------------------- */

  const result = SignupFieldsSchema.safeParse({
    name,
    email,
    password,
  });

  if (!result.success) {
    const errors = z.flattenError(result.error);

    return {
      fieldErrors: errors.fieldErrors,
      formErrors: errors.formErrors,
    };
  }

  /* -------------------------------------------------------
     Confirm password
  ------------------------------------------------------- */

  if (password !== confirmPassword) {
    return {
      fieldErrors: {
        confirmPassword: ["Passwords do not match"],
      },
      formErrors: [],
    };
  }

  /* -------------------------------------------------------
     OTP required
  ------------------------------------------------------- */

  if (typeof otp !== "string" || otp.trim().length !== 6) {
    return {
      fieldErrors: {},
      formErrors: ["Please verify your email with OTP first."],
    };
  }

  /* -------------------------------------------------------
     Terms
  ------------------------------------------------------- */

  if (terms !== "on") {
    return {
      fieldErrors: {},
      formErrors: ["Please accept the Terms of Service and Privacy Policy."],
    };
  }

  /* -------------------------------------------------------
     Course Creator Signup request
  ------------------------------------------------------- */

  try {
    await api.post("/course-creator/signup", {
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      otp: otp.trim(),
    });

    return redirect("/signin");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        fieldErrors: {},
        formErrors: [error.response?.data?.message ?? "Signup failed"],
      };
    }

    return {
      fieldErrors: {},
      formErrors: ["Something went wrong. Please try again."],
    };
  }
}

/* =========================================================
   Component
========================================================= */

export default function CourseCreatorSignUp({
  actionData,
}: Route.ComponentProps & {
  actionData?: ActionData;
}) {
  const navigation = useNavigation();

  /* -------------------------------------------------------
     Form state
  ------------------------------------------------------- */

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    terms: false,
  });

  /* -------------------------------------------------------
     Touched state
  ------------------------------------------------------- */

  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  /* -------------------------------------------------------
     OTP state
  ------------------------------------------------------- */

  const [otpSent, setOtpSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [otpError, setOtpError] = useState("");

  const [otpMessage, setOtpMessage] = useState("");

  /* -------------------------------------------------------
     Signup loading
  ------------------------------------------------------- */

  const isSubmitting = navigation.state === "submitting";

  /* =======================================================
     Validation
  ======================================================= */

  const validation = validateSignupForm(form);

  /* =======================================================
     Handle input change
  ======================================================= */

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    /* -----------------------------------------------------
       Email change
    ----------------------------------------------------- */

    if (name === "email") {
      setForm((prev) => ({
        ...prev,
        email: value,
        otp: "",
        terms: false,
      }));

      setEmailVerified(false);
      setOtpSent(false);
      setOtpError("");
      setOtpMessage("");

      return;
    }

    /* -----------------------------------------------------
       Other fields
    ----------------------------------------------------- */

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    /* -----------------------------------------------------
       Clear OTP error while typing
    ----------------------------------------------------- */

    if (name === "otp") {
      setOtpError("");
      setOtpMessage("");
    }
  };

  /* =======================================================
     Handle blur
  ======================================================= */

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  /* =======================================================
     Send OTP
  ======================================================= */

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpMessage("");

    const emailResult = EmailSchema.safeParse({
      email: form.email,
    });

    if (!emailResult.success) {
      setTouched((prev) => ({
        ...prev,
        email: true,
      }));

      return;
    }

    try {
      setIsSendingOtp(true);

      await api.post("/otp/generate-otp", {
        email: form.email.trim().toLowerCase(),
      });

      setOtpSent(true);

      setOtpMessage("OTP has been sent to your email.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setOtpError(error.response?.data?.message ?? "Failed to send OTP.");
      } else {
        setOtpError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  /* =======================================================
     Verify OTP
  ======================================================= */

  const handleVerifyOtp = async () => {
    setOtpError("");
    setOtpMessage("");

    if (form.otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");

      return;
    }

    try {
      setIsVerifyingOtp(true);

      await api.post("/otp/verify-otp", {
        email: form.email.trim().toLowerCase(),

        otp: form.otp.trim(),
      });

      setEmailVerified(true);

      setOtpMessage("Email verified successfully.");
    } catch (error) {
      setEmailVerified(false);

      if (axios.isAxiosError(error)) {
        setOtpError(error.response?.data?.message ?? "Invalid or expired OTP.");
      } else {
        setOtpError("Something went wrong. Please try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /* =======================================================
     Field errors
  ======================================================= */

  const nameError = touched.name
    ? validation.errors.name
    : actionData?.fieldErrors?.name?.[0];

  const emailError = touched.email
    ? validation.errors.email
    : actionData?.fieldErrors?.email?.[0];

  const passwordError = touched.password
    ? validation.errors.password
    : actionData?.fieldErrors?.password?.[0];

  const confirmPasswordError = touched.confirmPassword
    ? validation.errors.confirmPassword
    : actionData?.fieldErrors?.confirmPassword?.[0];

  /* =======================================================
     Button / Checkbox state
  ======================================================= */

  const isTermsEnabled =
    validation.isValid && emailVerified && form.otp.length === 6;

  const canSubmit =
    validation.isValid &&
    emailVerified &&
    form.otp.length === 6 &&
    form.terms &&
    !isSubmitting;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AuthLayout
      title="Become a course creator"
      description="Create your account and start sharing your knowledge."
    >
      <SocialButtons />

      <AuthDivider />

      <Form method="post" className="space-y-5">
        {/* =================================================
            Hidden OTP

            Verified hone ke baad visible OTP input
            hide ho jata hai, lekin hidden input
            FormData mein OTP bhejti rahegi.
        ================================================= */}

        <input type="hidden" name="otp" value={form.otp} />

        {/* =================================================
            Full Name
        ================================================= */}

        <AuthInput
          label="Full name"
          type="text"
          name="name"
          placeholder="John Doe"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          onBlur={() => handleBlur("name")}
          error={nameError}
        />

        {/* =================================================
            Email
        ================================================= */}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>

            {emailVerified && (
              <span className="text-xs font-semibold text-emerald-600">
                ✓ Email verified
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <AuthInput
                label=""
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                error={emailError}
              />
            </div>

            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || !form.email.trim()}
                className="h-12 shrink-0 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSendingOtp
                  ? "Sending..."
                  : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
              </button>
            )}
          </div>

          {/* =============================================
              OTP
          ============================================= */}

          {!emailVerified && otpSent && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs text-slate-500">
                Enter the OTP sent to{" "}
                <span className="font-semibold text-slate-700">
                  {form.email}
                </span>
              </p>

              <div className="flex gap-2">
                {/* Visible OTP input */}

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");

                    setForm((prev) => ({
                      ...prev,
                      otp: value,
                    }));

                    setOtpError("");
                    setOtpMessage("");
                  }}
                  className={`h-12 min-w-0 flex-1 rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    otpError
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />

                {/* Verify OTP */}

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || form.otp.length !== 6}
                  className="h-12 shrink-0 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              {otpError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {otpError}
                </p>
              )}

              {otpMessage && (
                <p className="mt-2 text-xs font-medium text-emerald-600">
                  {otpMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            Password
        ================================================= */}

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          error={passwordError}
        />

        {/* =================================================
            Confirm Password
        ================================================= */}

        <AuthInput
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={() => handleBlur("confirmPassword")}
          error={confirmPasswordError}
        />

        {/* =================================================
            Terms
        ================================================= */}

        <label
          className={`flex items-start gap-2 text-xs leading-5 ${
            isTermsEnabled
              ? "cursor-pointer text-slate-500"
              : "cursor-not-allowed text-slate-400"
          }`}
        >
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            disabled={!isTermsEnabled || isSubmitting}
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <span>
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {/* =================================================
            Backend errors
        ================================================= */}

        {actionData?.formErrors?.map((error) => (
          <p
            key={error}
            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500"
          >
            {error}
          </p>
        ))}

        {/* =================================================
            Create Account
        ================================================= */}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account...
            </>
          ) : (
            "Create creator account"
          )}
        </button>
      </Form>

      <AuthFooter
        text="Already have an creator account?"
        linkText="Sign in"
        linkTo="/course-creator/signin"
      />
    </AuthLayout>
  );
}
