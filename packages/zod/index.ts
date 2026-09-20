import * as z from "zod";

export const OtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const SignupSchema = z.object({
  name: z.string().min(3, "Too short").max(25),
  email: z.email().min(3, "Too short").max(25).trim().toLowerCase(),
  password: z.string().min(8).max(30),
  otp: z.string().min(6).max(6),
});

export const SigninSchema = z.object({
  email: z.email().min(3, "Too short").max(25).trim().toLowerCase(),
  password: z.string().min(8).max(30),
});

export const ResetPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPassword: z.string().min(8).max(30),
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

export const CreateCourseSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().max(1000).optional(),
  price: z.number().int().min(0),
  courseLanguage: z.string().trim().min(1).max(50),
  categoryId: z.uuid(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Provide at least one field to update",
);

export const CreateCourseVideoSchema = z.object({
  sectionTitle: z.string().trim().min(1).max(255),
  title: z.string().trim().min(1).max(255),
  contentUrl: z.url().max(2000),
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

export const PurchaseCourseSchema = z.object({
  courseId: z.uuid(),
});

export const UpdateRoleSchema = z.object({
  role: z.enum(["user", "course_creator", "admin"]),
});

export const ContentProgressParamSchema = z.object({
  contentId: z.uuid(),
});

/**
 * Progress report sent by the course player. `isCompleted` is omitted when the
 * player is only saving the watch position; sending it flips the lecture's
 * completed state explicitly (both ways).
 */
export const ContentProgressSchema = z.object({
  watchedSeconds: z.number().int().min(0).max(24 * 60 * 60),
  isCompleted: z.boolean().optional(),
});

export const StudyActivitySchema = z.object({
  /** Minutes studied. Several logs for the same day add up. */
  minutes: z.number().int().min(1).max(24 * 60),
  /** `YYYY-MM-DD`; defaults to today when omitted. */
  activityDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
    .optional(),
});

export const WeeklyGoalSchema = z.object({
  /** Weekly study target in minutes (max 7 days × 24 hours). */
  targetMinutes: z.number().int().min(1).max(7 * 24 * 60),
});

export const UpdateProfileSchema = z
  .object({
    name: z.string().trim().min(3).max(255).optional(),
    email: z.email().trim().toLowerCase().optional(),
    currentPassword: z.string().min(8).max(30).optional(),
    newPassword: z.string().min(8).max(30).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.email !== undefined || data.newPassword !== undefined,
    "Nothing to update",
  )
  .refine(
    (data) => data.newPassword === undefined || data.currentPassword !== undefined,
    "Current password is required to set a new password",
  );
