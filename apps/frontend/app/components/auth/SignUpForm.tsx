import { useState, type ChangeEvent } from "react";

import { Form, Link, useNavigation } from "react-router";

import axios from "axios";

import { api } from "~/lib/axios";

import { emailSchema, validateSignupForm } from "~/lib/auth/signupSchema";

import type { SignupActionData, SignupFormState, SignupTouchedState } from "~/lib/auth/signupTypes";

import { AuthDivider } from "./AuthDivider";
import { AuthFooter } from "./AuthFooter";
import { AuthInput } from "./AuthInput";
import { AuthLayout } from "./AuthLayout";
import { SocialButtons } from "./SocialButtons";

type SignUpFormProps = {
  title: string;
  description: string;

  actionData?: SignupActionData;

  submitText: string;
  submittingText: string;

  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};

export function SignUpForm({ title, description, actionData, submitText, submittingText, footerText, footerLinkText, footerLinkTo }: SignUpFormProps) {
  const navigation = useNavigation();

  const [form, setForm] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    terms: false,
  });

  const [touched, setTouched] = useState<SignupTouchedState>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [otpSent, setOtpSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [otpError, setOtpError] = useState("");

  const [otpMessage, setOtpMessage] = useState("");

  const isSubmitting = navigation.state === "submitting";

  // -----------------------------------------
  // Validation
  // -----------------------------------------

  const validation = validateSignupForm(form);

  // -----------------------------------------
  // Input change
  // -----------------------------------------

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    // Email change
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

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "otp") {
      setOtpError("");
      setOtpMessage("");
    }
  };

  // -----------------------------------------
  // Blur
  // -----------------------------------------

  const handleBlur = (field: keyof SignupTouchedState) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // -----------------------------------------
  // Send OTP
  // -----------------------------------------

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpMessage("");

    const emailResult = emailSchema.safeParse({
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

  // -----------------------------------------
  // Verify OTP
  // -----------------------------------------

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

  // -----------------------------------------
  // Field errors
  // -----------------------------------------

  const nameError = touched.name ? validation.errors.name : actionData?.fieldErrors?.name?.[0];

  const emailError = touched.email ? validation.errors.email : actionData?.fieldErrors?.email?.[0];

  const passwordError = touched.password ? validation.errors.password : actionData?.fieldErrors?.password?.[0];

  const confirmPasswordError = touched.confirmPassword ? validation.errors.confirmPassword : actionData?.fieldErrors?.confirmPassword?.[0];

  // -----------------------------------------
  // Submit state
  // -----------------------------------------

  const isTermsEnabled = validation.isValid && emailVerified && form.otp.length === 6;

  const canSubmit = validation.isValid && emailVerified && form.otp.length === 6 && form.terms && !isSubmitting;

  return (
    <AuthLayout title={title} description={description}>
      <SocialButtons />

      <AuthDivider />

      <Form method="post" className="space-y-5">
        {/* Hidden OTP */}

        <input type="hidden" name="otp" value={form.otp} />

        {/* Name */}

        <AuthInput label="Full name" type="text" name="name" placeholder="John Doe" autoComplete="name" value={form.name} onChange={handleChange} onBlur={() => handleBlur("name")} error={nameError} />

        {/* Email */}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Email address</label>

            {emailVerified && <span className="text-xs font-semibold text-emerald-600">✓ Email verified</span>}
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
                {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            )}
          </div>

          {/* OTP */}

          {!emailVerified && otpSent && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs text-slate-500">
                Enter the OTP sent to <span className="font-semibold text-slate-700">{form.email}</span>
              </p>

              <div className="flex gap-2">
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
                    otpError ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || form.otp.length !== 6}
                  className="h-12 shrink-0 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              {otpError && <p className="mt-2 text-xs font-medium text-red-500">{otpError}</p>}

              {otpMessage && <p className="mt-2 text-xs font-medium text-emerald-600">{otpMessage}</p>}
            </div>
          )}
        </div>

        {/* Password */}

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

        {/* Confirm password */}

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

        {/* Terms */}

        <label className={`flex items-start gap-2 text-xs leading-5 ${isTermsEnabled ? "cursor-pointer text-slate-500" : "cursor-not-allowed text-slate-400"}`}>
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
            <Link to="/terms" className="font-semibold text-indigo-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-indigo-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

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

              {submittingText}
            </>
          ) : (
            submitText
          )}
        </button>
      </Form>

      <AuthFooter text={footerText} linkText={footerLinkText} linkTo={footerLinkTo} />
    </AuthLayout>
  );
}
