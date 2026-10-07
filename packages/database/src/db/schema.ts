import { sql } from "drizzle-orm";

import { boolean, check, date, index, integer, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

/* =========================================================
   ENUMS
========================================================= */

export const userRoleEnum = pgEnum("user_role", ["student", "course_creator", "admin"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "refunded"]);
export const providerEnum = pgEnum("oauth_provider", ["google", "github", "discord"]);
export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "private", "archived"]);
export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced", "all_levels"]);
export const contentTypeEnum = pgEnum("content_type", ["video", "article", "resource"]);
export const otpPurposeEnum = pgEnum("otp_purpose", ["email_verification", "forgot_password"]);
/* =========================================================
   USERS
========================================================= */
export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    // Nullable because OAuth users may not have a password.
    password: varchar({ length: 512 }),
    roles: userRoleEnum("roles")
      .array()
      .notNull()
      .default(sql`ARRAY['student']::user_role[]`),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);
/* =========================================================
   CATEGORIES
========================================================= */
export const categoriesTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
/* =========================================================
   COURSES
========================================================= */
export const coursesTable = pgTable(
  "courses",
  {
    id: uuid().primaryKey().defaultRandom(),
    // Nullable so a draft can be created first
    // and completed later.
    title: varchar({ length: 255 }),
    description: varchar({ length: 1000 }),
    // Store amount in smallest currency unit.
    // Example: INR 999.00 => 99900 paise.
    price: integer(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => usersTable.id),
    categoryId: uuid("category_id").references(() => categoriesTable.id),
    courseLanguage: varchar("course_language", {
      length: 50,
    }),
    level: courseLevelEnum("level"),
    thumbnailUrl: text("thumbnail_url"),
    /*
      learningOutcomes removed.
      We now use courseLearningOutcomesTable
      as the single source of truth.
    */
    status: courseStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),
    archivedAt: timestamp("archived_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("courses_created_by_idx").on(table.createdBy),
    index("courses_status_idx").on(table.status),
    index("courses_category_id_idx").on(table.categoryId),
    index("courses_category_status_idx").on(table.categoryId, table.status),
    check("courses_price_non_negative_check", sql`${table.price} IS NULL OR ${table.price} >= 0`),
  ],
);
/* =========================================================
   COURSE SECTIONS
========================================================= */
export const courseSectionsTable = pgTable(
  "course_sections",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, {
        onDelete: "cascade",
      }),
    title: varchar({ length: 255 }).notNull(),
    sequenceOrder: integer("sequence_order").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("course_section_sequence_unique").on(table.courseId, table.sequenceOrder), index("course_sections_course_id_idx").on(table.courseId)],
);
/* =========================================================
   COURSE CONTENTS / LESSONS
========================================================= */
export const courseContentsTable = pgTable(
  "course_contents",
  {
    id: uuid().primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => courseSectionsTable.id, {
        onDelete: "cascade",
      }),
    title: varchar({ length: 255 }).notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    contentUrl: text("content_url").notNull(),
    sequenceOrder: integer("sequence_order").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("section_content_sequence_unique").on(table.sectionId, table.sequenceOrder), index("course_contents_section_id_idx").on(table.sectionId)],
);
/* =========================================================
   COURSE PURCHASES / ENROLLMENTS
========================================================= */
export const coursePurchaseTable = pgTable(
  "course_purchase",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("course_purchase_user_course_unique").on(table.userId, table.courseId),
    index("course_purchase_user_id_idx").on(table.userId),
    index("course_purchase_course_id_idx").on(table.courseId),
  ],
);
/* =========================================================
   REVIEWS
========================================================= */
export const reviewsTable = pgTable(
  "reviews",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    rating: integer().notNull(),
    comment: varchar({ length: 512 }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("user_reviews").on(table.userId, table.courseId),
    index("reviews_course_id_idx").on(table.courseId),
    index("reviews_user_id_idx").on(table.userId),
    check("reviews_rating_check", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ],
);
/* =========================================================
   CART
========================================================= */
export const cartTable = pgTable(
  "cart",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [unique("cart_user_course_unique").on(table.userId, table.courseId), index("cart_user_id_idx").on(table.userId), index("cart_course_id_idx").on(table.courseId)],
);
/* =========================================================
   TRANSACTIONS
========================================================= */
export const transactionsTable = pgTable(
  "transactions",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),
    // Store amount in smallest currency unit.
    amountPaid: integer("amount_paid").notNull(),
    paymentGatewayId: varchar("payment_gateway_id", {
      length: 255,
    })
      .notNull()
      .unique(),
    status: paymentStatusEnum().default("pending").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_course_id_idx").on(table.courseId),
    index("transactions_status_idx").on(table.status),
    check("transactions_amount_non_negative_check", sql`${table.amountPaid} >= 0`),
  ],
);
/* =========================================================
   OTP
========================================================= */
export const otpTable = pgTable(
  "otp",
  {
    id: uuid().primaryKey().defaultRandom(),
    hashOtp: varchar("otp_hash", {
      length: 255,
    }).notNull(),
    email: varchar("email", {
      length: 255,
    }).notNull(),
    purpose: otpPurposeEnum().default("email_verification").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),
    usedAt: timestamp("used_at", {
      withTimezone: true,
    }),
    attempts: integer().default(0).notNull(),
  },
  (table) => [
    index("otp_email_idx").on(table.email),
    index("otp_email_purpose_idx").on(table.email, table.purpose),
    index("otp_expires_at_idx").on(table.expiresAt),
    check("otp_attempts_non_negative_check", sql`${table.attempts} >= 0`),
  ],
);
/* =========================================================
   SESSIONS
========================================================= */
export const sessionTable = pgTable(
  "session",
  {
    id: uuid().primaryKey().defaultRandom(),
    /*
      IMPORTANT:
      Store a HASH of the session token here,
      not the raw cookie token.
    */
    token: varchar("token", {
      length: 255,
    })
      .notNull()
      .unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [index("session_user_id_idx").on(table.userId), index("session_expires_at_idx").on(table.expiresAt)],
);
/* =========================================================
   COURSE PROGRESS
========================================================= */
export const courseProgressTable = pgTable(
  "course_progress",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, {
        onDelete: "cascade",
      }),
    /*
      Last lesson/content watched by the user.

      SET NULL is useful if a lesson is deleted.
    */
    lastContentId: uuid("last_content_id").references(() => courseContentsTable.id, {
      onDelete: "set null",
    }),
    progressPercentage: integer("progress_percentage").default(0).notNull(),
    lastAccessedAt: timestamp("last_accessed_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("course_progress_user_course_unique").on(table.userId, table.courseId),
    index("course_progress_user_id_idx").on(table.userId),
    index("course_progress_course_id_idx").on(table.courseId),
    index("course_progress_last_accessed_at_idx").on(table.lastAccessedAt),
    check("course_progress_percentage_check", sql`${table.progressPercentage} >= 0 AND ${table.progressPercentage} <= 100`),
  ],
);
/* =========================================================
   CONTENT PROGRESS
========================================================= */
export const contentProgressTable = pgTable(
  "content_progress",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    contentId: uuid("content_id")
      .notNull()
      .references(() => courseContentsTable.id, {
        onDelete: "cascade",
      }),
    isCompleted: boolean("is_completed").default(false).notNull(),
    watchedSeconds: integer("watched_seconds").default(0).notNull(),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("content_progress_user_content_unique").on(table.userId, table.contentId),
    index("content_progress_user_id_idx").on(table.userId),
    index("content_progress_content_id_idx").on(table.contentId),
    check("content_progress_watched_seconds_check", sql`${table.watchedSeconds} >= 0`),
  ],
);
/* =========================================================
   USER ACTIVITY
========================================================= */
export const userActivityTable = pgTable(
  "user_activity",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    activityDate: date("activity_date").notNull(),
    minutesStudied: integer("minutes_studied").default(0).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("user_activity_user_date_unique").on(table.userId, table.activityDate),
    index("user_activity_user_id_idx").on(table.userId),
    index("user_activity_activity_date_idx").on(table.activityDate),
    check("user_activity_minutes_non_negative_check", sql`${table.minutesStudied} >= 0`),
  ],
);
/* =========================================================
   USER GOALS
========================================================= */
export const userGoalsTable = pgTable(
  "user_goals",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    targetMinutes: integer("target_minutes").notNull(),
    weekStart: date("week_start").notNull(),
    weekEnd: date("week_end").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("user_goals_user_week_unique").on(table.userId, table.weekStart),
    index("user_goals_user_id_idx").on(table.userId),
    check("user_goals_target_minutes_check", sql`${table.targetMinutes} >= 0`),
    check("user_goals_week_range_check", sql`${table.weekEnd} >= ${table.weekStart}`),
  ],
);
/* =========================================================
   OAUTH ACCOUNTS
========================================================= */
export const oauthAccountsTable = pgTable(
  "oauth_account_table",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    provider: providerEnum().notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("oauth_provider_account_unique").on(table.provider, table.providerAccountId), index("oauth_accounts_user_id_idx").on(table.userId)],
);
/* =========================================================
   COURSE LEARNING OUTCOMES
========================================================= */
export const courseLearningOutcomesTable = pgTable(
  "course_learning_outcomes",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, {
        onDelete: "cascade",
      }),
    text: varchar({
      length: 500,
    }).notNull(),
    sequenceOrder: integer("sequence_order").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("course_learning_outcome_sequence_unique").on(table.courseId, table.sequenceOrder), index("course_learning_outcomes_course_id_idx").on(table.courseId)],
);
