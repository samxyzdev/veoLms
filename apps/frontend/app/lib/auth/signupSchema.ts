import { z } from "zod";
import { SignupSchema } from "@repo/zod";

export const signupFieldsSchema = SignupSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const emailSchema = signupFieldsSchema.pick({
  email: true,
});

export function validateSignupForm(form: { name: string; email: string; password: string; confirmPassword: string }) {
  const result = signupFieldsSchema.safeParse({
    name: form.name,
    email: form.email,
    password: form.password,
  });

  const errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;

    errors.name = fieldErrors.name?.[0];
    errors.email = fieldErrors.email?.[0];
    errors.password = fieldErrors.password?.[0];
  }

  if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  const isValid =
    result.success && form.name.trim().length > 0 && form.email.trim().length > 0 && form.password.length > 0 && form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  return {
    isValid,
    errors,
  };
}
