import * as z from "zod";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(100, "Name must be at most 100 characters")
  // Supports normal names including spaces, apostrophes,
  // hyphens and Unicode.
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

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export const roleSchema = z.enum(["student", "course_creator", "admin"], {
  error: "Please select a valid role",
});

export const courseStatusSchema = z.enum(["draft", "published", "private", "archived"], {
  error: "Please select a valid course status",
});

export const courseLevelSchema = z.enum(["beginner", "intermediate", "advanced", "all_levels"], {
  error: "Please select a valid course level",
});

export const contentTypeSchema = z.enum(["video", "article", "resource"], {
  error: "Please select a valid content type",
});

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

/**
 * User representation based on users table.
 *
 * roles is an array because a user can have multiple roles:
 * ["student"]
 * ["student", "course_creator"]
 * ["student", "course_creator", "admin"]
 *
 * password can be null for OAuth users.
 */
export const UserSchema = z.strictObject({
  id: z.uuid("Invalid user ID"),

  name: nameSchema,

  email: emailSchema,

  password: z.string().min(8).max(128).nullable(),

  roles: z.array(roleSchema).min(1, "User must have at least one role").default(["student"]),

  createdAt: z.iso.datetime(),

  updatedAt: z.iso.datetime(),
});

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export const CategoriesSchema = z.strictObject({
  name: z.string().trim().min(3, "Category name must be at least 3 characters").max(100, "Category name must be at most 100 characters"),
});

/* -------------------------------------------------------------------------- */
/* Course                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Common validation for course title.
 */
const courseTitleSchema = z.string().trim().min(3, "Course title must be at least 3 characters").max(255, "Course title must be at most 255 characters");

/**
 * Course description.
 */
const courseDescriptionSchema = z.string().trim().max(5000, "Description must be at most 5000 characters");

/**
 * Course price.
 *
 * This assumes your API works with a numeric price.
 */
const coursePriceSchema = z.number().finite().min(0, "Price cannot be negative").max(10_000_000, "Price is too large");

/**
 * Course language.
 */
const courseLanguageSchema = z.string().trim().min(1, "Course language is required").max(50, "Course language is too long");

/**
 * Thumbnail storage key / URL.
 *
 * Since your storage flow is S3-compatible, this can contain
 * either a storage key or URL depending on what your backend stores.
 */
const thumbnailSchema = z.string().trim().min(1, "Course thumbnail is required").max(2048, "Thumbnail value is too long");

/**
 * Learning outcome.
 *
 * This table is separate from coursesTable.
 */
const learningOutcomeTextSchema = z.string().trim().min(1, "Learning outcome cannot be empty").max(200, "Learning outcome must be at most 200 characters");

const learningOutcomesSchema = z.array(learningOutcomeTextSchema).max(6, "You can add at most 6 learning outcomes");

/**
 * Complete course entity.
 *
 * learningOutcomes are intentionally NOT included here because
 * they are stored in courseLearningOutcomesTable.
 */
export const CourseSchema = z.strictObject({
  id: z.uuid("Invalid course ID"),

  title: courseTitleSchema,

  description: courseDescriptionSchema.nullable(),

  price: coursePriceSchema,

  createdBy: z.uuid("Invalid creator ID"),

  categoryId: z.uuid("Invalid category ID").nullable(),

  courseLanguage: courseLanguageSchema.nullable(),

  level: courseLevelSchema.nullable(),

  thumbnailUrl: thumbnailSchema.nullable(),

  status: courseStatusSchema,

  publishedAt: z.iso.datetime().nullable(),

  archivedAt: z.iso.datetime().nullable(),

  createdAt: z.iso.datetime(),

  updatedAt: z.iso.datetime(),
});

/* -------------------------------------------------------------------------- */
/* Learning Outcomes                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Stored representation of a learning outcome.
 */
export const CourseLearningOutcomeSchema = z.strictObject({
  id: z.uuid("Invalid learning outcome ID"),

  courseId: z.uuid("Invalid course ID"),

  text: learningOutcomeTextSchema,

  sequenceOrder: z.number().int("Sequence order must be an integer").min(1, "Sequence order must start from 1"),

  createdAt: z.iso.datetime(),

  updatedAt: z.iso.datetime(),
});

/* -------------------------------------------------------------------------- */
/* Create Course                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Used when creating a complete course record.
 *
 * status is intentionally NOT accepted here.
 *
 * New courses should be created as draft by the database default.
 */
export const CreateCourseSchema = z.strictObject({
  title: courseTitleSchema,

  description: courseDescriptionSchema.optional(),

  price: coursePriceSchema,

  courseLanguage: courseLanguageSchema,

  categoryId: z.uuid("Invalid category ID"),

  level: courseLevelSchema,

  thumbnailUrl: thumbnailSchema,

  /**
   * Learning outcomes are stored in
   * courseLearningOutcomesTable, not coursesTable.
   */
  learningOutcomes: learningOutcomesSchema,
});

/* -------------------------------------------------------------------------- */
/* Create Course Draft                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Used while creating/saving a draft course.
 *
 * Drafts can be incomplete.
 */
export const CreateCourseDraftSchema = CreateCourseSchema.partial().refine((data) => Object.keys(data).length > 0, "Provide at least one field to save the draft");

/* -------------------------------------------------------------------------- */
/* Update Course                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Used for:
 *
 * PATCH /course-creator/courses/:courseId
 *
 * Any subset of editable fields can be updated.
 *
 * status is included because your publish flow uses:
 *
 * {
 *   status: "published"
 * }
 *
 * IMPORTANT:
 * The backend must control which status transitions are allowed.
 * Do not trust the client blindly.
 */
export const UpdateCourseSchema = z
  .strictObject({
    title: courseTitleSchema.optional(),

    description: courseDescriptionSchema.optional(),

    price: coursePriceSchema.optional(),

    courseLanguage: courseLanguageSchema.optional(),

    categoryId: z.uuid("Invalid category ID").optional(),

    level: courseLevelSchema.optional(),

    thumbnailUrl: thumbnailSchema.nullable().optional(),

    learningOutcomes: learningOutcomesSchema.optional(),

    status: courseStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Provide at least one field to update");

/* -------------------------------------------------------------------------- */
/* Publish Course                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Optional but recommended:
 * Keep publishing as a separate controlled schema.
 *
 * Client can request publishing, but server decides whether
 * the course is actually eligible for publishing.
 */
export const PublishCourseSchema = z.strictObject({
  status: z.literal("published"),
});

/* -------------------------------------------------------------------------- */
/* Course Section                                                             */
/* -------------------------------------------------------------------------- */

export const CreateCourseSectionSchema = z.strictObject({
  title: z.string().trim().min(1, "Section title is required").max(255, "Section title must be at most 255 characters"),
});

export const CourseSectionSchema = z.strictObject({
  id: z.uuid("Invalid section ID"),

  courseId: z.uuid("Invalid course ID"),

  title: z.string().trim().min(1, "Section title is required").max(255, "Section title must be at most 255 characters"),

  sequenceOrder: z.number().int("Sequence order must be an integer").min(1, "Sequence order must start from 1"),

  createdAt: z.iso.datetime(),

  updatedAt: z.iso.datetime(),
});

/* -------------------------------------------------------------------------- */
/* Course Content                                                             */
/* -------------------------------------------------------------------------- */

export const CreateCourseVideoSchema = z.strictObject({
  sectionTitle: z.string().trim().min(1, "Section title is required").max(255, "Section title must be at most 255 characters"),

  title: z.string().trim().min(1, "Video title is required").max(255, "Video title must be at most 255 characters"),

  contentUrl: z.httpUrl("Content URL must be a valid HTTP/HTTPS URL").max(2000),
});

export const CourseContentSchema = z.strictObject({
  id: z.uuid("Invalid content ID"),

  sectionId: z.uuid("Invalid section ID"),

  title: z.string().trim().min(1, "Content title is required").max(255, "Content title must be at most 255 characters"),

  contentType: contentTypeSchema,

  contentUrl: z.httpUrl("Content URL must be a valid HTTP/HTTPS URL").max(2000).nullable(),

  sequenceOrder: z.number().int("Sequence order must be an integer").min(1, "Sequence order must start from 1"),

  createdAt: z.iso.datetime(),

  updatedAt: z.iso.datetime(),
});

/* -------------------------------------------------------------------------- */
/* Reviews / Comments                                                         */
/* -------------------------------------------------------------------------- */

export const CommentAndReviewsSchema = z.strictObject({
  comment: z.string().trim().min(1, "Comment cannot be empty").max(512, "Comment is too long"),

  rating: z.number().int("Rating must be a whole number").min(1, "Rating must be at least 1").max(5, "Rating cannot be greater than 5"),
});

/* -------------------------------------------------------------------------- */
/* Params                                                                     */
/* -------------------------------------------------------------------------- */

export const ParamSchema = z.strictObject({
  courseId: z.uuid("Invalid course ID"),
});

export const ContentProgressParamSchema = z.strictObject({
  contentId: z.uuid("Invalid content ID"),
});

/* -------------------------------------------------------------------------- */
/* Purchase                                                                   */
/* -------------------------------------------------------------------------- */

export const PurchaseCourseSchema = z.strictObject({
  courseId: z.uuid("Invalid course ID"),
});

/* -------------------------------------------------------------------------- */
/* Role                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * If your endpoint is specifically:
 *
 * PATCH /user/role
 *
 * and backend adds this role to the user's existing roles,
 * this schema is fine.
 */
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
    .min(0, "Watched seconds cannot be negative")
    .max(24 * 60 * 60, "Watched seconds value is too large"),

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
    .max(24 * 60, "Minutes cannot exceed 24 hours"),

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
    .min(1, "Target must be at least 1 minute")
    .max(7 * 24 * 60, "Target cannot exceed one week"),
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
  .refine((data) => data.name !== undefined || data.email !== undefined || data.newPassword !== undefined, {
    message: "Nothing to update",
  })
  .refine((data) => data.newPassword === undefined || data.currentPassword !== undefined, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  })
  .refine((data) => data.newPassword === undefined || data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const ContentUpdateParamsSchema = z.strictObject({
  sectionId: z.uuid("Invalid section ID."),
  contentId: z.uuid("Invalid lesson ID."),
});

export const UpdateCourseContentSchema = z
  .strictObject({
    title: z.string().trim().min(1).max(255).optional(),

    contentType: z.enum(["video", "article", "resource"]).optional(),

    contentUrl: z.string().trim().min(1).max(2000).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), "At least one field is required.");

/* -------------------------------------------------------------------------- */
/* Inferred Types                                                             */
/* -------------------------------------------------------------------------- */

export type SignupInput = z.infer<typeof SignupSchema>;

export type SigninInput = z.infer<typeof SigninSchema>;

export type UserInput = z.infer<typeof UserSchema>;

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

export type CreateCourseDraftInput = z.infer<typeof CreateCourseDraftSchema>;

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;

export type PublishCourseInput = z.infer<typeof PublishCourseSchema>;

export type CreateCourseSectionInput = z.infer<typeof CreateCourseSectionSchema>;

export type CreateCourseVideoInput = z.infer<typeof CreateCourseVideoSchema>;

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
