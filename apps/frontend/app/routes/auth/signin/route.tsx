import { useState, type ChangeEvent } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { z } from "zod";
import axios from "axios";

import { AuthDivider } from "../components/AuthDivider";
import { AuthFooter } from "../components/AuthFooter";
import { AuthInput } from "../components/AuthInput";
import { AuthLayout } from "../components/AuthLayout";
import { SocialButtons } from "../components/SocialButtons";

import type { Route } from "./+types/route";
import { api } from "~/lib/axios";

/* =========================================================
   Signin Schema
========================================================= */

const SigninSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

/* =========================================================
   Types
========================================================= */

type FormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type TouchedState = {
  email: boolean;
  password: boolean;
};

type ValidationResult = {
  isValid: boolean;

  errors: {
    email?: string;
    password?: string;
  };
};

type ActionData = {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };

  formErrors?: string[];
};

/* =========================================================
   Validation Function
========================================================= */

function validateSigninForm(form: FormState): ValidationResult {
  const result = SigninSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  const errors: ValidationResult["errors"] = {};

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;

    errors.email = fieldErrors.email?.[0];
    errors.password = fieldErrors.password?.[0];
  }

  const isValid =
    result.success && form.email.trim().length > 0 && form.password.length > 0;

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

  const email = formData.get("email");
  const password = formData.get("password");
  const rememberMe = formData.get("rememberMe") === "on";

  /* -------------------------------------------------------
     Validate
  ------------------------------------------------------- */

  const result = SigninSchema.safeParse({
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
     Signin API
  ------------------------------------------------------- */

  try {
    await api.post("/user/signin", {
      email: result.data.email,
      password: result.data.password,
    });

    return redirect("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        fieldErrors: {},
        formErrors: [
          error.response?.data?.message ?? "Invalid email or password",
        ],
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

export default function SignIn({
  actionData,
}: Route.ComponentProps & {
  actionData?: ActionData;
}) {
  const navigation = useNavigation();

  /* -------------------------------------------------------
     Form state
  ------------------------------------------------------- */

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
  });

  /* -------------------------------------------------------
     Touched state
  ------------------------------------------------------- */

  const [touched, setTouched] = useState<TouchedState>({
    email: false,
    password: false,
  });

  /* -------------------------------------------------------
     Loading
  ------------------------------------------------------- */

  const isSubmitting = navigation.state === "submitting";

  /* =======================================================
     Validation
  ======================================================= */

  const validation = validateSigninForm(form);

  /* =======================================================
     Handle Input Change
  ======================================================= */

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =======================================================
     Handle Blur
  ======================================================= */

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  /* =======================================================
     Field Errors
  ======================================================= */

  const emailError = touched.email
    ? validation.errors.email
    : actionData?.fieldErrors?.email?.[0];

  const passwordError = touched.password
    ? validation.errors.password
    : actionData?.fieldErrors?.password?.[0];

  /* =======================================================
     Submit State
  ======================================================= */

  const canSubmit = validation.isValid && !isSubmitting;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your learning journey."
    >
      <SocialButtons />

      <AuthDivider />

      <Form method="post" className="space-y-5">
        {/* =================================================
            Email
        ================================================= */}

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

        {/* =================================================
            Password
        ================================================= */}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
            >
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

        {/* =================================================
            Remember Me
        ================================================= */}

        <label
          className={`flex items-center gap-2 text-sm ${
            isSubmitting
              ? "cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-500"
          }`}
        >
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

        {/* =================================================
            Backend / Form Errors
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
            Submit
        ================================================= */}

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

      <AuthFooter
        text="Don't have an account?"
        linkText="Create account"
        linkTo="/signup"
      />
    </AuthLayout>
  );
}
