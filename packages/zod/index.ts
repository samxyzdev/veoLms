import * as z from "zod";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(100, "Name must be at most 100 characters")
  // Supports normal names including spaces, apostrophes, hyphens and Unicode.
  .regex(/^[\p{L}\p{M} .'-]+$/u, "Name contains invalid characters");

const emailSchema = z.email("Enter a valid email address").trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

const roleSchema = z.enum(["user", "admin", "course_creator"]);

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export const OtpSchema = z.strictObject({
  email: emailSchema,
});

export const SignupSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
});

export const SigninSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const ResetPasswordSchema = z.strictObject({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
});

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */

export const UserSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(8).max(128),
  role: roleSchema.default("user"),
});

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export const CategoriesSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(3, "Category name must be at least 3 characters")
    .max(100, "Category name must be at most 100 characters"),
});

/* -------------------------------------------------------------------------- */
/* Course                                                                     */
/* -------------------------------------------------------------------------- */

export const CourseSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters")
    .max(255, "Course title must be at most 255 characters"),

  description: z.string().trim().max(5000, "Description is too long"),

  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid amount")
    .refine((value) => Number(value) >= 0, "Price cannot be negative"),
});

export const CreateCourseSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters")
    .max(255, "Course title must be at most 255 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),

  price: z
    .number()
    .finite()
    .min(0, "Price cannot be negative")
    .max(10_000_000, "Price is too large"),

  courseLanguage: z
    .string()
    .trim()
    .min(1, "Course language is required")
    .max(50, "Course language is too long"),

  categoryId: z.uuid("Invalid category ID"),
});

export const UpdateCourseSchema = CreateCourseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Provide at least one field to update",
);

/* -------------------------------------------------------------------------- */
/* Course content                                                             */
/* -------------------------------------------------------------------------- */

export const CreateCourseVideoSchema = z.strictObject({
  sectionTitle: z.string().trim().min(1, "Section title is required").max(255),

  title: z.string().trim().min(1, "Video title is required").max(255),

  contentUrl: z.httpUrl("Content URL must be a valid HTTP/HTTPS URL").max(2000),
});

export const CourseSectionSchema = z.strictObject({
  title: z.string().trim().min(1, "Section title is required").max(255),
});

export const CourseContentSchema = z.strictObject({
  title: z.string().trim().min(1, "Content title is required").max(255),

  contentType: z.enum(["video", "article", "quiz", "assignment"]),

  contentUrl: z.httpUrl().max(2000).optional(),
});

/* -------------------------------------------------------------------------- */
/* Reviews / Comments                                                         */
/* -------------------------------------------------------------------------- */

export const CommentAndReviewsSchema = z.strictObject({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(512, "Comment is too long"),

  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),
});

/* -------------------------------------------------------------------------- */
/* Params                                                                     */
/* -------------------------------------------------------------------------- */

export const ParamSchema = z.strictObject({
  courseId: z.uuid("Invalid course ID"),
});

export const PurchaseCourseSchema = z.strictObject({
  courseId: z.uuid("Invalid course ID"),
});

export const ContentProgressParamSchema = z.strictObject({
  contentId: z.uuid("Invalid content ID"),
});

/* -------------------------------------------------------------------------- */
/* Role                                                                       */
/* -------------------------------------------------------------------------- */

export const UpdateRoleSchema = z.strictObject({
  role: roleSchema,
});

/* -------------------------------------------------------------------------- */
/* Progress                                                                   */
/* -------------------------------------------------------------------------- */

export const ContentProgressSchema = z.strictObject({
  /**
   * Number of seconds watched.
   */
  watchedSeconds: z
    .number()
    .int("Watched seconds must be an integer")
    .min(0)
    .max(24 * 60 * 60),

  /**
   * Omitted when only saving watch position.
   */
  isCompleted: z.boolean().optional(),
});

export const StudyActivitySchema = z.strictObject({
  /**
   * Minutes studied.
   */
  minutes: z
    .number()
    .int("Minutes must be an integer")
    .min(1, "Minutes must be at least 1")
    .max(24 * 60),

  /**
   * YYYY-MM-DD
   */
  activityDate: z.iso.date("Expected YYYY-MM-DD").optional(),
});

export const WeeklyGoalSchema = z.strictObject({
  /**
   * Weekly target in minutes.
   */
  targetMinutes: z
    .number()
    .int("Target must be an integer")
    .min(1)
    .max(7 * 24 * 60),
});

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const UpdateProfileSchema = z
  .strictObject({
    name: nameSchema.optional(),

    email: emailSchema.optional(),

    currentPassword: z.string().min(8).max(128).optional(),

    newPassword: passwordSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.newPassword !== undefined,
    {
      message: "Nothing to update",
    },
  )
  .refine(
    (data) =>
      data.newPassword === undefined || data.currentPassword !== undefined,
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) =>
      data.newPassword === undefined ||
      data.newPassword !== data.currentPassword,
    {
      message: "New password must be different from current password",
      path: ["newPassword"],
    },
  );

/* -------------------------------------------------------------------------- */
/* Useful inferred types                                                      */
/* -------------------------------------------------------------------------- */

export type SignupInput = z.infer<typeof SignupSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
