import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

export type SigninInput = z.infer<typeof signinSchema>;
