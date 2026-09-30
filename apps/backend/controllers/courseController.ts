import {
  and,
  categoriesTable,
  contentProgressTable,
  courseContentsTable,
  courseProgressTable,
  coursePurchaseTable,
  courseSectionsTable,
  coursesTable,
  db,
  desc,
  eq,
  reviewsTable,
  sql,
} from "@repo/database";

import type { NextFunction, Request, Response } from "express";

import {
  CommentAndReviewsSchema,
  ContentProgressParamSchema,
  ContentProgressSchema,
  ParamSchema,
  PurchaseCourseSchema,
} from "@repo/zod";

// --------------------------------------------------
// Helper: Current date in user's timezone
// --------------------------------------------------

function getTodayDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// --------------------------------------------------
// Helper: Learning streak
// --------------------------------------------------

function calculateLearningStreak(activityDates: string[]): number {
  if (activityDates.length === 0) {
    return 0;
  }

  const today = new Date(`${getTodayDate()}T00:00:00`);

  let streak = 0;
  let expectedDate = today;

  for (const activityDate of activityDates) {
    const currentDate = new Date(`${activityDate}T00:00:00`);

    const differenceInDays = Math.floor(
      (expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (differenceInDays === 0) {
      streak++;
      expectedDate = new Date(expectedDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (differenceInDays > 0) {
      break;
    }
  }

  return streak;
}

// --------------------------------------------------
// Get first 10 courses
// --------------------------------------------------

export const listCourses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await db.select().from(coursesTable).limit(10);

    return res.status(200).json({
      data: courses,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Get purchased courses
// --------------------------------------------------

export const getPurchasedCourses = async (
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

  try {
    const purchasedCourses = await db
      .select({
        purchaseId: coursePurchaseTable.id,
        purchasedAt: coursePurchaseTable.createdAt,
        courseId: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        price: coursesTable.price,
        courseLanguage: coursesTable.courseLanguage,
      })
      .from(coursePurchaseTable)
      .innerJoin(
        coursesTable,
        eq(coursePurchaseTable.courseId, coursesTable.id),
      )
      .where(eq(coursePurchaseTable.userId, userId));

    return res.status(200).json({
      data: purchasedCourses,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Purchase course
// --------------------------------------------------

export const purchaseCourse = async (
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

  const result = PurchaseCourseSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { courseId } = result.data;

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

    const [existingPurchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, courseId),
        ),
      )
      .limit(1);

    if (existingPurchase) {
      return res.status(409).json({
        message: "You have already purchased this course.",
      });
    }

    await db.insert(coursePurchaseTable).values({
      userId,
      courseId,
    });

    return res.status(201).json({
      message: "Course purchased successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Create course review
// --------------------------------------------------

export const createCourseReview = async (
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

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  const bodyResult = CommentAndReviewsSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: bodyResult.error.flatten(),
    });
  }

  const { comment, rating } = bodyResult.data;

  try {
    // Check whether the course exists
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

    // Check whether the user purchased the course
    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, courseId),
        ),
      )
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        message: "You must purchase this course before reviewing it.",
      });
    }

    await db.insert(reviewsTable).values({
      courseId,
      rating,
      userId,
      comment,
    });

    return res.status(201).json({
      message: "Review created successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Get course progress
// --------------------------------------------------

export const getCourseProgress = async (
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

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, courseId),
        ),
      )
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    const [progress] = await db
      .select({
        id: courseProgressTable.id,
        courseId: courseProgressTable.courseId,
        progressPercentage: courseProgressTable.progressPercentage,
        lastContentId: courseProgressTable.lastContentId,
        lastAccessedAt: courseProgressTable.lastAccessedAt,
      })
      .from(courseProgressTable)
      .where(
        and(
          eq(courseProgressTable.userId, userId),
          eq(courseProgressTable.courseId, courseId),
        ),
      )
      .limit(1);

    if (!progress) {
      return res.status(404).json({
        message: "Course progress not found.",
      });
    }

    return res.status(200).json({
      data: progress,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Course player
// --------------------------------------------------

async function courseContentProgress(userId: string, courseId: string) {
  const [row] = await db
    .select({
      totalCount: sql<number>`count(*)::int`,
      completedCount: sql<number>`
        (
          count(${contentProgressTable.id})
          filter (
            where ${contentProgressTable.isCompleted}
          )
        )::int
      `,
    })
    .from(courseContentsTable)
    .innerJoin(
      courseSectionsTable,
      eq(courseContentsTable.sectionId, courseSectionsTable.id),
    )
    .leftJoin(
      contentProgressTable,
      and(
        eq(contentProgressTable.contentId, courseContentsTable.id),
        eq(contentProgressTable.userId, userId),
      ),
    )
    .where(eq(courseSectionsTable.courseId, courseId));

  const totalCount = row?.totalCount ?? 0;
  const completedCount = row?.completedCount ?? 0;

  return {
    totalCount,
    completedCount,
    progressPercentage:
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
  };
}

export const getCoursePlayer = async (
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

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, courseId),
        ),
      )
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    const [
      courseRows,
      sectionRows,
      contentRows,
      progressRows,
      courseProgressRows,
    ] = await Promise.all([
      db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          description: coursesTable.description,
          courseLanguage: coursesTable.courseLanguage,
          categoryName: categoriesTable.name,
        })
        .from(coursesTable)
        .leftJoin(
          categoriesTable,
          eq(coursesTable.categoryId, categoriesTable.id),
        )
        .where(eq(coursesTable.id, courseId))
        .limit(1),

      db
        .select({
          id: courseSectionsTable.id,
          title: courseSectionsTable.title,
          sequenceOrder: courseSectionsTable.sequenceOrder,
        })
        .from(courseSectionsTable)
        .where(eq(courseSectionsTable.courseId, courseId))
        .orderBy(courseSectionsTable.sequenceOrder),

      db
        .select({
          id: courseContentsTable.id,
          sectionId: courseContentsTable.sectionId,
          title: courseContentsTable.title,
          contentType: courseContentsTable.contentType,
          contentUrl: courseContentsTable.contentUrl,
          sequenceOrder: courseContentsTable.sequenceOrder,
        })
        .from(courseContentsTable)
        .innerJoin(
          courseSectionsTable,
          eq(courseContentsTable.sectionId, courseSectionsTable.id),
        )
        .where(eq(courseSectionsTable.courseId, courseId))
        .orderBy(courseContentsTable.sequenceOrder),

      db
        .select({
          contentId: contentProgressTable.contentId,
          isCompleted: contentProgressTable.isCompleted,
          watchedSeconds: contentProgressTable.watchedSeconds,
          completedAt: contentProgressTable.completedAt,
        })
        .from(contentProgressTable)
        .innerJoin(
          courseContentsTable,
          eq(contentProgressTable.contentId, courseContentsTable.id),
        )
        .innerJoin(
          courseSectionsTable,
          eq(courseContentsTable.sectionId, courseSectionsTable.id),
        )
        .where(
          and(
            eq(contentProgressTable.userId, userId),
            eq(courseSectionsTable.courseId, courseId),
          ),
        ),

      db
        .select({
          lastContentId: courseProgressTable.lastContentId,
          lastAccessedAt: courseProgressTable.lastAccessedAt,
        })
        .from(courseProgressTable)
        .where(
          and(
            eq(courseProgressTable.userId, userId),
            eq(courseProgressTable.courseId, courseId),
          ),
        )
        .limit(1),
    ]);

    const course = courseRows[0];

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const progressByContent = new Map(
      progressRows.map((row) => [row.contentId, row]),
    );

    const sections = sectionRows.map((section) => {
      const contents = contentRows
        .filter((content) => content.sectionId === section.id)
        .map((content) => {
          const progress = progressByContent.get(content.id);

          return {
            id: content.id,
            title: content.title,
            contentType: content.contentType,
            contentUrl: content.contentUrl,
            sequenceOrder: content.sequenceOrder,
            isCompleted: progress?.isCompleted ?? false,
            watchedSeconds: progress?.watchedSeconds ?? 0,
            completedAt: progress?.completedAt ?? null,
          };
        });

      return {
        id: section.id,
        title: section.title,
        sequenceOrder: section.sequenceOrder,
        totalCount: contents.length,
        completedCount: contents.filter((content) => content.isCompleted)
          .length,
        contents,
      };
    });

    const summary = {
      totalCount: contentRows.length,
      completedCount: contentRows.filter(
        (content) => progressByContent.get(content.id)?.isCompleted,
      ).length,
      progressPercentage: 0,
    };

    summary.progressPercentage =
      summary.totalCount > 0
        ? Math.round((summary.completedCount / summary.totalCount) * 100)
        : 0;

    return res.status(200).json({
      data: {
        course: {
          ...course,
          ...summary,
          lastContentId: courseProgressRows[0]?.lastContentId ?? null,
          lastAccessedAt: courseProgressRows[0]?.lastAccessedAt ?? null,
          sections,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Save content progress
// --------------------------------------------------

export const saveContentProgress = async (
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

  const paramResult = ContentProgressParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Invalid content ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const bodyResult = ContentProgressSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: bodyResult.error.flatten(),
    });
  }

  const { contentId } = paramResult.data;
  const { watchedSeconds, isCompleted } = bodyResult.data;

  try {
    const [content] = await db
      .select({
        courseId: courseSectionsTable.courseId,
      })
      .from(courseContentsTable)
      .innerJoin(
        courseSectionsTable,
        eq(courseContentsTable.sectionId, courseSectionsTable.id),
      )
      .where(eq(courseContentsTable.id, contentId))
      .limit(1);

    if (!content) {
      return res.status(404).json({
        message: "Lesson not found.",
      });
    }

    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, content.courseId),
        ),
      )
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    const watchedGreatest = sql`
      greatest(
        ${contentProgressTable.watchedSeconds},
        ${watchedSeconds}
      )
    `;

    const setValues =
      isCompleted === undefined
        ? {
            watchedSeconds: watchedGreatest,
            updatedAt: new Date(),
          }
        : {
            watchedSeconds: watchedGreatest,
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
            updatedAt: new Date(),
          };

    await db
      .insert(contentProgressTable)
      .values({
        userId,
        contentId,
        watchedSeconds,
        isCompleted: isCompleted ?? false,
        completedAt: isCompleted ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [contentProgressTable.userId, contentProgressTable.contentId],
        set: setValues,
      });

    const summary = await courseContentProgress(userId, content.courseId);

    await db
      .insert(courseProgressTable)
      .values({
        userId,
        courseId: content.courseId,
        lastContentId: contentId,
        progressPercentage: summary.progressPercentage,
        lastAccessedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [courseProgressTable.userId, courseProgressTable.courseId],
        set: {
          lastContentId: contentId,
          progressPercentage: summary.progressPercentage,
          lastAccessedAt: new Date(),
          updatedAt: new Date(),
        },
      });

    return res.status(200).json({
      message: "Progress saved successfully.",
      data: {
        ...summary,
        lastContentId: contentId,
      },
    });
  } catch (error) {
    return next(error);
  }
};
