import axios from "axios";
import { redirect } from "react-router";
import { z } from "zod";

import { api } from "~/lib/axios";

import { signupFieldsSchema } from "./signupSchema";
import type { SignupConfig } from "./signupTypes";

export async function handleSignup(request: Request, config: SignupConfig) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const otp = formData.get("otp");
  const terms = formData.get("terms");

  // -----------------------------------------
  // Validate signup fields
  // -----------------------------------------

  const result = signupFieldsSchema.safeParse({
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

  // -----------------------------------------
  // Confirm password
  // -----------------------------------------

  if (password !== confirmPassword) {
    return {
      fieldErrors: {
        confirmPassword: ["Passwords do not match"],
      },
      formErrors: [],
    };
  }

  // -----------------------------------------
  // OTP required
  // -----------------------------------------

  if (typeof otp !== "string" || otp.trim().length !== 6) {
    return {
      fieldErrors: {},
      formErrors: ["Please verify your email with OTP first."],
    };
  }

  // -----------------------------------------
  // Terms
  // -----------------------------------------

  if (terms !== "on") {
    return {
      fieldErrors: {},
      formErrors: ["Please accept the Terms of Service and Privacy Policy."],
    };
  }

  // -----------------------------------------
  // Signup API
  // -----------------------------------------

  try {
    await api.post(config.endpoint, {
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      otp: otp.trim(),
    });

    return redirect(config.redirectTo);
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
