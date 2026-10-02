import {
  and,
  asc,
  categoriesTable,
  count,
  courseContentsTable,
  coursePurchaseTable,
  courseSectionsTable,
  coursesTable,
  db,
  desc,
  eq,
  sql,
  sum,
  usersTable,
  countDistinct,
  gte,
} from "@repo/database";

import {
  CreateCourseSchema,
  CreateCourseVideoSchema,
  ParamSchema,
  UpdateCourseSchema,
  UpdateRoleSchema,
} from "@repo/zod";

import type { NextFunction, Request, Response } from "express";

/**
 * Baseline categories are inserted only when missing.
 * Existing category data is preserved.
 */
const DEFAULT_CATEGORIES = [
  "Web Development",
  "App Development",
  "Mobile Development",
  "Gaming",
  "Videography",
  "Data Science",
  "Design",
  "Photography",
  "Music",
  "Marketing",
  "Business",
  "Personal Growth",
];

// --------------------------------------------------
// CourseCreator Stats
// --------------------------------------------------

export const getCourseCreatorStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [
      totalCoursesRow,
      totalStudentsRow,
      totalPurchasesRow,
      revenueRow,
      enrollmentRows,
      popularCoursesRows,
      recentEnrollmentsRows,
      studentGrowthRows,
      courseCategoriesRows,
    ] = await Promise.all([
      // --------------------------------
      // Total courses created by creator
      // --------------------------------
      db
        .select({
          value: count(),
        })
        .from(coursesTable)
        .where(eq(coursesTable.createdBy, userId)),

      // --------------------------------
      // Unique students of creator's courses
      // --------------------------------
      db
        .select({
          value: countDistinct(coursePurchaseTable.userId),
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(eq(coursesTable.createdBy, userId)),

      // --------------------------------
      // Total purchases of creator's courses
      // --------------------------------
      db
        .select({
          value: count(),
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(eq(coursesTable.createdBy, userId)),

      // --------------------------------
      // Revenue from creator's courses
      // --------------------------------
      db
        .select({
          value: sum(coursesTable.price),
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(eq(coursesTable.createdBy, userId)),

      // --------------------------------
      // Enrollment overview - last 12 months
      // --------------------------------
      db
        .select({
          month: sql<string>`
            to_char(
              date_trunc(
                'month',
                ${coursePurchaseTable.createdAt}
              ),
              'Mon'
            )
          `,
          value: count(),
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(
          and(
            eq(coursesTable.createdBy, userId),
            gte(
              coursePurchaseTable.createdAt,
              sql`
                date_trunc('month', current_date)
                - interval '11 months'
              `,
            ),
          ),
        )
        .groupBy(
          sql`
            date_trunc(
              'month',
              ${coursePurchaseTable.createdAt}
            )
          `,
        )
        .orderBy(
          sql`
            date_trunc(
              'month',
              ${coursePurchaseTable.createdAt}
            )
          `,
        ),

      // --------------------------------
      // Popular courses - top 4
      // --------------------------------
      db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          enrollments: count(coursePurchaseTable.id),
        })
        .from(coursesTable)
        .leftJoin(
          coursePurchaseTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(eq(coursesTable.createdBy, userId))
        .groupBy(coursesTable.id, coursesTable.title)
        .orderBy(desc(count(coursePurchaseTable.id)))
        .limit(4),
      // Recent Enrollments
      db
        .select({
          id: coursePurchaseTable.id,
          student: usersTable.name,
          email: usersTable.email,
          course: coursesTable.title,
          date: coursePurchaseTable.createdAt,
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .innerJoin(usersTable, eq(coursePurchaseTable.userId, usersTable.id))
        .where(eq(coursesTable.createdBy, userId))
        .orderBy(desc(coursePurchaseTable.createdAt))
        .limit(5),
      // --------------------------------
      // Student Growth - last 6 months
      // --------------------------------
      db
        .select({
          month: sql<string>`
      to_char(
        date_trunc(
          'month',
          ${coursePurchaseTable.createdAt}
        ),
        'Mon'
      )
    `,
          value: countDistinct(coursePurchaseTable.userId),
        })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        )
        .where(
          and(
            eq(coursesTable.createdBy, userId),
            gte(
              coursePurchaseTable.createdAt,
              sql`
          date_trunc('month', current_date)
          - interval '11 months'
        `,
            ),
          ),
        )
        .groupBy(
          sql`
      date_trunc(
        'month',
        ${coursePurchaseTable.createdAt}
      )
    `,
        )
        .orderBy(
          sql`
      date_trunc(
        'month',
        ${coursePurchaseTable.createdAt}
      )
    `,
        ),
      // --------------------------------
      // Course Categories
      // --------------------------------
      db
        .select({
          name: coursesTable.categoryId,
          courses: count(),
        })
        .from(coursesTable)
        .where(eq(coursesTable.createdBy, userId))
        .groupBy(coursesTable.categoryId)
        .orderBy(desc(count())),
    ]);

    return res.status(200).json({
      data: {
        totalCourses: Number(totalCoursesRow[0]?.value ?? 0),

        totalStudents: Number(totalStudentsRow[0]?.value ?? 0),

        totalPurchases: Number(totalPurchasesRow[0]?.value ?? 0),

        totalRevenue: Number(revenueRow[0]?.value ?? 0),

        enrollmentOverview: enrollmentRows.map((item) => ({
          month: item.month,
          value: Number(item.value),
        })),

        popularCourses: popularCoursesRows.map((course, index) => ({
          id: course.id,
          title: course.title,
          enrollments: Number(course.enrollments),
          rank: index + 1,
        })),
        recentEnrollments: recentEnrollmentsRows.map((item) => ({
          id: item.id,
          student: item.student,
          email: item.email,
          course: item.course,
          date: item.date,
          status: "Enrolled",
        })),
        studentGrowth: studentGrowthRows.map((item) => ({
          month: item.month,
          value: Number(item.value),
        })),
        courseCategories: courseCategoriesRows.map((item) => ({
          name: item.name,
          courses: Number(item.courses),
          percentage:
            Number(totalCoursesRow[0]?.value ?? 0) > 0
              ? Number(
                  (
                    (Number(item.courses) / Number(totalCoursesRow[0]?.value)) *
                    100
                  ).toFixed(1),
                )
              : 0,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
};
// --------------------------------------------------
// List Users
// --------------------------------------------------

export const listCreatorCourses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        roles: usersTable.roles,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Update User Role
// --------------------------------------------------

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      message: "Invalid user ID.",
    });
  }

  const result = UpdateRoleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    await db
      .update(usersTable)
      .set({
        roles: result.data.role,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    return res.status(200).json({
      message: "User role updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// List Courses
// --------------------------------------------------

export const listCourseCreatorCourses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        price: coursesTable.price,
        createdBy: coursesTable.createdBy,
        categoryId: coursesTable.categoryId,
        courseLanguage: coursesTable.courseLanguage,
        createdAt: coursesTable.createdAt,
        updatedAt: coursesTable.updatedAt,
      })
      .from(coursesTable)
      .orderBy(desc(coursesTable.createdAt));

    return res.status(200).json({
      data: courses,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// List Categories
// --------------------------------------------------

export const listCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existing = await db
      .select({
        name: categoriesTable.name,
      })
      .from(categoriesTable);

    const existingNames = new Set(existing.map((row) => row.name));

    const missing = DEFAULT_CATEGORIES.filter(
      (name) => !existingNames.has(name),
    );

    if (missing.length > 0) {
      await db.insert(categoriesTable).values(
        missing.map((name) => ({
          name,
        })),
      );
    }

    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));

    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Create Course
// --------------------------------------------------

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const result = CreateCourseSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { title, description, price, courseLanguage, categoryId } = result.data;

  try {
    const [category] = await db
      .select({
        id: categoriesTable.id,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const [course] = await db
      .insert(coursesTable)
      .values({
        title,
        description: description || null,
        price,
        createdBy: userId,
        categoryId,
        courseLanguage,
      })
      .returning({
        id: coursesTable.id,
      });

    if (!course) {
      return res.status(500).json({
        message: "Could not create course.",
      });
    }

    return res.status(201).json({
      message: "Course created successfully.",
      data: {
        courseId: course.id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Update Course
// --------------------------------------------------

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const paramResult = ParamSchema.safeParse(req.params);

  const bodyResult = UpdateCourseSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: {
        params: paramResult.success ? undefined : paramResult.error.flatten(),

        body: bodyResult.success ? undefined : bodyResult.error.flatten(),
      },
    });
  }

  const { courseId } = paramResult.data;
  const updates = bodyResult.data;

  try {
    if (updates.categoryId) {
      const [category] = await db
        .select({
          id: categoriesTable.id,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, updates.categoryId))
        .limit(1);

      if (!category) {
        return res.status(404).json({
          message: "Category not found.",
        });
      }
    }

    const [course] = await db
      .update(coursesTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(coursesTable.id, courseId))
      .returning({
        id: coursesTable.id,
      });

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Add Course Video
// --------------------------------------------------

export const addCourseVideo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const paramResult = ParamSchema.safeParse(req.params);

  const bodyResult = CreateCourseVideoSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: {
        params: paramResult.success ? undefined : paramResult.error.flatten(),

        body: bodyResult.success ? undefined : bodyResult.error.flatten(),
      },
    });
  }

  const { courseId } = paramResult.data;

  const { sectionTitle, title, contentUrl } = bodyResult.data;

  try {
    const [course] = await db
      .select({
        id: coursesTable.id,
      })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    let [section] = await db
      .select({
        id: courseSectionsTable.id,
      })
      .from(courseSectionsTable)
      .where(
        and(
          eq(courseSectionsTable.courseId, courseId),
          eq(courseSectionsTable.title, sectionTitle),
        ),
      )
      .limit(1);

    if (!section) {
      const [sequence] = await db
        .select({
          value: sql<number>`
            coalesce(
              max(${courseSectionsTable.sequenceOrder}),
              0
            )
          `,
        })
        .from(courseSectionsTable)
        .where(eq(courseSectionsTable.courseId, courseId));

      [section] = await db
        .insert(courseSectionsTable)
        .values({
          courseId,
          title: sectionTitle,
          sequenceOrder: (sequence?.value ?? 0) + 1,
        })
        .returning({
          id: courseSectionsTable.id,
        });
    }

    if (!section) {
      return res.status(500).json({
        message: "Could not create course section.",
      });
    }

    const [sequence] = await db
      .select({
        value: sql<number>`
          coalesce(
            max(${courseContentsTable.sequenceOrder}),
            0
          )
        `,
      })
      .from(courseContentsTable)
      .where(eq(courseContentsTable.sectionId, section.id));

    const [video] = await db
      .insert(courseContentsTable)
      .values({
        sectionId: section.id,
        title,
        contentType: "video",
        contentUrl,
        sequenceOrder: (sequence?.value ?? 0) + 1,
      })
      .returning({
        id: courseContentsTable.id,
      });

    if (!video) {
      return res.status(500).json({
        message: "Could not add video.",
      });
    }

    return res.status(201).json({
      message: "Video added successfully.",
      data: {
        videoId: video.id,
      },
    });
  } catch (error) {
    return next(error);
  }
};
