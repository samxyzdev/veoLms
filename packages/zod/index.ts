import * as z from "zod";

export const OtpSchema = z.object({
  email: z.string(),
});

export const SignupSchema = z.object({
  name: z.string().min(3, "Too short").max(25),
  email: z.email().min(3, "Too short").max(25),
  password: z.string().min(8).max(30),
  otp: z.string().min(6).max(6),
});

export const SigninSchema = z.object({
  email: z.email().min(3, "Too short").max(25),
  password: z.string().min(8).max(30),
});

export const UserSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: z.email().toLowerCase().trim(),
  password: z.string().min(8).max(512),
  role: z.enum(["user", "admin", "course_creator"]).default("user"),
});

export const CategoriesSchema = z.object({
  name: z.string().trim().min(3).max(255),
});

export const CourseSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string(),
  price: z.string(),
});

export const CourseSectionSchema = z.object({
  title: z.string(),
});

export const CourseContentSchema = z.object({
  title: z.string(),
  contentType: z.string(),
  contentUrl: z.string(),
});
export const CommentAndReviewsSchema = z.object({
  comment: z.string().max(512),
  rating: z.number().max(5),
});

export const ParamSchema = z.object({
  courseId: z.uuid(),
});
