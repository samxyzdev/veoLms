import axios from "axios";
import { redirect } from "react-router";
import { z } from "zod";

import { api } from "~/lib/axios";

import { signinSchema } from "./signinSchema";
import type { SigninConfig } from "./signinTypes";

export async function handleSignin(request: Request, config: SigninConfig) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const rememberMe = formData.get("rememberMe") === "on";

  const result = signinSchema.safeParse({
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

  try {
    await api.post(config.endpoint, {
      email: result.data.email,
      password: result.data.password,

      ...(config.includeRememberMe ? { rememberMe } : {}),
    });

    return redirect(config.redirectTo);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        fieldErrors: {},
        formErrors: [error.response?.data?.message ?? "Invalid email or password"],
      };
    }

    return {
      fieldErrors: {},
      formErrors: ["Something went wrong. Please try again."],
    };
  }
}
