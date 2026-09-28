import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "course_creator",
  "admin",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "refunded",
]);

export const providerEnum = pgEnum("oauth_provider", [
  "google",
  "github",
  "discord",
]);
export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 512 }).notNull(),
  role: userRoleEnum().default("user").notNull(),
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

export const coursesTable = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  price: integer().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoriesTable.id),
  courseLanguage: varchar("course_language", {
    length: 50,
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
});

export const courseSectionsTable = pgTable("course_sections", {
  id: uuid().primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => coursesTable.id),
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
});

export const courseContentsTable = pgTable("course_contents", {
  id: uuid().primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => courseSectionsTable.id),
  title: varchar({ length: 255 }).notNull(),
  contentType: varchar("content_type", {
    length: 50,
  }).notNull(),
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
});

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
    unique("course_purchase_user_course_unique").on(
      table.userId,
      table.courseId,
    ),
  ],
);

export const reviewsTable = pgTable(
  "reviews",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
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
  (table) => [unique("user_reviews").on(table.userId, table.courseId)],
);

export const cartTable = pgTable(
  "cart",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),
  },
  (table) => [unique("cart_user").on(table.userId, table.courseId)],
);

export const transactionsTable = pgTable("transactions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  courseId: uuid("course_id")
    .notNull()
    .references(() => coursesTable.id),
  amountPaid: integer("amount_paid").notNull(),
  paymentGatewayId: varchar("payment_gateway_id", { length: 255 }).notNull(),
  status: paymentStatusEnum().default("pending").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const otpTable = pgTable(
  "otp",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    hashOtp: varchar("hashOtp", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    // expiresAt manually set karna hoga (e.g. +15 mins in JS)
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  },
  (table) => [index("otp_email_idx").on(table.email)],
);

export const sessionTable = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    token: varchar("token").notNull().unique(),
    userId: uuid("userId")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    // expiresAt me defaultNow nahi rakha taaki app logic future time set kar sake
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const courseProgressTable = pgTable(
  "course_progress",
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id),

    // User ne last kaunsa lesson/content dekha tha
    lastContentId: uuid("last_content_id").references(
      () => courseContentsTable.id,
    ),

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
    unique("course_progress_user_course_unique").on(
      table.userId,
      table.courseId,
    ),

    index("course_progress_user_id_idx").on(table.userId),
    index("course_progress_course_id_idx").on(table.courseId),
    index("course_progress_last_accessed_at_idx").on(table.lastAccessedAt),
  ],
);

export const contentProgressTable = pgTable(
  "content_progress",
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

    contentId: uuid("content_id")
      .notNull()
      .references(() => courseContentsTable.id),

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
    unique("content_progress_user_content_unique").on(
      table.userId,
      table.contentId,
    ),

    index("content_progress_user_id_idx").on(table.userId),
    index("content_progress_content_id_idx").on(table.contentId),
  ],
);

export const userActivityTable = pgTable(
  "user_activity",
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

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
    unique("user_activity_user_date_unique").on(
      table.userId,
      table.activityDate,
    ),

    index("user_activity_user_id_idx").on(table.userId),
    index("user_activity_activity_date_idx").on(table.activityDate),
  ],
);

export const userGoalsTable = pgTable(
  "user_goals",
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

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
  ],
);

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

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.provider, table.providerAccountId)],
);
