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
  eq,
  reviewsTable,
  sql,
} from "@repo/database";

import type { NextFunction, Request, Response } from "express";

import { CommentAndReviewsSchema, ContentProgressParamSchema, ContentProgressSchema, ParamSchema, PurchaseCourseSchema } from "@repo/zod";

/* -------------------------------------------------------------------------- */
/* Get Purchased Courses                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns all courses purchased by the current student.
 */
export const getPurchasedCourses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
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
      .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
      .where(eq(coursePurchaseTable.userId, userId));

    return res.status(200).json({
      success: true,
      data: purchasedCourses,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Purchase Course                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Purchases/enrolls the current student into a course.
 */
export const purchaseCourse = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const result = PurchaseCourseSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { courseId } = result.data;

  try {
    /* ---------------------------------------------------------------------- */
    /* Check course exists                                                    */
    /* ---------------------------------------------------------------------- */

    const [course] = await db
      .select({
        id: coursesTable.id,
      })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Check existing purchase                                                */
    /* ---------------------------------------------------------------------- */

    const [existingPurchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(and(eq(coursePurchaseTable.userId, userId), eq(coursePurchaseTable.courseId, courseId)))
      .limit(1);

    if (existingPurchase) {
      return res.status(409).json({
        success: false,
        message: "You have already purchased this course.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Create purchase                                                         */
    /* ---------------------------------------------------------------------- */

    await db.insert(coursePurchaseTable).values({
      userId,
      courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Course purchased successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Create Course Review                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Creates a review for a purchased course.
 */
export const createCourseReview = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  const bodyResult = CommentAndReviewsSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: bodyResult.error.flatten(),
    });
  }

  const { comment, rating } = bodyResult.data;

  try {
    /* ---------------------------------------------------------------------- */
    /* Check course exists                                                    */
    /* ---------------------------------------------------------------------- */

    const [course] = await db
      .select({
        id: coursesTable.id,
      })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Check purchase                                                         */
    /* ---------------------------------------------------------------------- */

    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(and(eq(coursePurchaseTable.userId, userId), eq(coursePurchaseTable.courseId, courseId)))
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You must purchase this course before reviewing it.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Create review                                                          */
    /* ---------------------------------------------------------------------- */

    await db.insert(reviewsTable).values({
      courseId,
      rating,
      userId,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Get Course Progress                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Returns the current student's progress for a course.
 */
export const getCourseProgress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    /* ---------------------------------------------------------------------- */
    /* Check enrollment                                                       */
    /* ---------------------------------------------------------------------- */

    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(and(eq(coursePurchaseTable.userId, userId), eq(coursePurchaseTable.courseId, courseId)))
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Get progress                                                           */
    /* ---------------------------------------------------------------------- */

    const [progress] = await db
      .select({
        id: courseProgressTable.id,
        courseId: courseProgressTable.courseId,
        progressPercentage: courseProgressTable.progressPercentage,
        lastContentId: courseProgressTable.lastContentId,
        lastAccessedAt: courseProgressTable.lastAccessedAt,
      })
      .from(courseProgressTable)
      .where(and(eq(courseProgressTable.userId, userId), eq(courseProgressTable.courseId, courseId)))
      .limit(1);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Internal Helper: Course Content Progress                                  */
/* -------------------------------------------------------------------------- */

/**
 * Calculates total lessons, completed lessons and
 * progress percentage for a course.
 *
 * Internal helper used by saveContentProgress().
 */
async function courseContentProgress(userId: string, courseId: string) {
  const [row] = await db
    .select({
      totalCount: sql<number>`
        count(*)::int
      `,

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
    .innerJoin(courseSectionsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))
    .leftJoin(contentProgressTable, and(eq(contentProgressTable.contentId, courseContentsTable.id), eq(contentProgressTable.userId, userId)))
    .where(eq(courseSectionsTable.courseId, courseId));

  const totalCount = row?.totalCount ?? 0;

  const completedCount = row?.completedCount ?? 0;

  return {
    totalCount,
    completedCount,

    progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
  };
}

/* -------------------------------------------------------------------------- */
/* Course Player                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Returns the complete course-player data
 * for an enrolled student.
 */
export const getCoursePlayer = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    /* ---------------------------------------------------------------------- */
    /* Check enrollment                                                       */
    /* ---------------------------------------------------------------------- */

    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(and(eq(coursePurchaseTable.userId, userId), eq(coursePurchaseTable.courseId, courseId)))
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Load course/player data                                                */
    /* ---------------------------------------------------------------------- */

    const [courseRows, sectionRows, contentRows, progressRows, courseProgressRows] = await Promise.all([
      /* -------------------------------------------------------------------- */
      /* Course                                                                */
      /* -------------------------------------------------------------------- */

      db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          description: coursesTable.description,
          courseLanguage: coursesTable.courseLanguage,
          categoryName: categoriesTable.name,
        })
        .from(coursesTable)
        .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))
        .where(eq(coursesTable.id, courseId))
        .limit(1),

      /* -------------------------------------------------------------------- */
      /* Sections                                                              */
      /* -------------------------------------------------------------------- */

      db
        .select({
          id: courseSectionsTable.id,
          title: courseSectionsTable.title,
          sequenceOrder: courseSectionsTable.sequenceOrder,
        })
        .from(courseSectionsTable)
        .where(eq(courseSectionsTable.courseId, courseId))
        .orderBy(courseSectionsTable.sequenceOrder),

      /* -------------------------------------------------------------------- */
      /* Contents                                                              */
      /* -------------------------------------------------------------------- */

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
        .innerJoin(courseSectionsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))
        .where(eq(courseSectionsTable.courseId, courseId))
        .orderBy(courseContentsTable.sequenceOrder),

      /* -------------------------------------------------------------------- */
      /* Content progress                                                      */
      /* -------------------------------------------------------------------- */

      db
        .select({
          contentId: contentProgressTable.contentId,
          isCompleted: contentProgressTable.isCompleted,
          watchedSeconds: contentProgressTable.watchedSeconds,
          completedAt: contentProgressTable.completedAt,
        })
        .from(contentProgressTable)
        .innerJoin(courseContentsTable, eq(contentProgressTable.contentId, courseContentsTable.id))
        .innerJoin(courseSectionsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))
        .where(and(eq(contentProgressTable.userId, userId), eq(courseSectionsTable.courseId, courseId))),

      /* -------------------------------------------------------------------- */
      /* Course progress                                                       */
      /* -------------------------------------------------------------------- */

      db
        .select({
          lastContentId: courseProgressTable.lastContentId,

          lastAccessedAt: courseProgressTable.lastAccessedAt,
        })
        .from(courseProgressTable)
        .where(and(eq(courseProgressTable.userId, userId), eq(courseProgressTable.courseId, courseId)))
        .limit(1),
    ]);

    const course = courseRows[0];

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Map progress by content ID                                             */
    /* ---------------------------------------------------------------------- */

    const progressByContent = new Map(progressRows.map((row) => [row.contentId, row]));

    /* ---------------------------------------------------------------------- */
    /* Build sections with contents                                           */
    /* ---------------------------------------------------------------------- */

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

        completedCount: contents.filter((content) => content.isCompleted).length,

        contents,
      };
    });

    /* ---------------------------------------------------------------------- */
    /* Course summary                                                         */
    /* ---------------------------------------------------------------------- */

    const summary = {
      totalCount: contentRows.length,

      completedCount: contentRows.filter((content) => progressByContent.get(content.id)?.isCompleted).length,

      progressPercentage: 0,
    };

    summary.progressPercentage = summary.totalCount > 0 ? Math.round((summary.completedCount / summary.totalCount) * 100) : 0;

    /* ---------------------------------------------------------------------- */
    /* Response                                                               */
    /* ---------------------------------------------------------------------- */

    return res.status(200).json({
      success: true,

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

/* -------------------------------------------------------------------------- */
/* Save Content Progress                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Saves the student's watch position and/or completion state.
 *
 * Also updates overall course progress.
 */
export const saveContentProgress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const paramResult = ContentProgressParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid content ID.",
      errors: paramResult.error.flatten(),
    });
  }

  const bodyResult = ContentProgressSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: bodyResult.error.flatten(),
    });
  }

  const { contentId } = paramResult.data;

  const { watchedSeconds, isCompleted } = bodyResult.data;

  try {
    /* ---------------------------------------------------------------------- */
    /* Find lesson and course                                                */
    /* ---------------------------------------------------------------------- */

    const [content] = await db
      .select({
        courseId: courseSectionsTable.courseId,
      })
      .from(courseContentsTable)
      .innerJoin(courseSectionsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))
      .where(eq(courseContentsTable.id, contentId))
      .limit(1);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Check enrollment                                                       */
    /* ---------------------------------------------------------------------- */

    const [purchase] = await db
      .select({
        id: coursePurchaseTable.id,
      })
      .from(coursePurchaseTable)
      .where(and(eq(coursePurchaseTable.userId, userId), eq(coursePurchaseTable.courseId, content.courseId)))
      .limit(1);

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Never decrease watched time                                            */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Upsert content progress                                                */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Recalculate course progress                                            */
    /* ---------------------------------------------------------------------- */

    const summary = await courseContentProgress(userId, content.courseId);

    /* ---------------------------------------------------------------------- */
    /* Update course progress                                                 */
    /* ---------------------------------------------------------------------- */

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
      success: true,
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
