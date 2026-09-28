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
import type { Request, Response } from "express";
import {
  CommentAndReviewsSchema,
  ContentProgressParamSchema,
  ContentProgressSchema,
  ParamSchema,
  PurchaseCourseSchema,
} from "@repo/zod";

/** Course request handlers; routes are registered in `routes/courseRoutes.ts`. */

// send first 10 course to frontend
// actual video nahi jayega isme
export const listCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await db.select().from(coursesTable).limit(10);
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    // next(error);
    return res.status(500).json({
      message: "somethign went wrong",
    });
  }
};

// get purchased course like history
export const getPurchasedCourses = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }

  try {
    // Purchase rows joined with the actual course details, so the frontend
    // can render titles/prices without a second request per course.
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
      purchasedCourses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "someting went wrong",
    });
  }
};

// purchase a course (mock checkout — real payment gateway comes later)
export const purchaseCourse = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
  }

  const { success, data, error } = PurchaseCourseSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: error,
    });
  }

  const { courseId } = data;

  try {
    const [course] = await db
      .select({ id: coursesTable.id })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId));

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const [existingPurchase] = await db
      .select({ id: coursePurchaseTable.id })
      .from(coursePurchaseTable)
      .where(
        and(
          eq(coursePurchaseTable.userId, userId),
          eq(coursePurchaseTable.courseId, courseId),
        ),
      );

    if (existingPurchase) {
      return res
        .status(400)
        .json({ message: "You have already purchased this course" });
    }

    await db.insert(coursePurchaseTable).values({ userId, courseId });

    return res.status(201).json({
      message: "Course purchased successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

// comment and reviews on specific videos
// if user have access to this course
export const createCourseReview = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }
  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: paramResult.error,
    });
  }

  const { courseId } = paramResult.data;

  const { success, data, error } = CommentAndReviewsSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: error,
    });
  }
  const { comment, rating } = data;
  // pure course pe hai particular vide pe nahi hai
  try {
    await db.insert(reviewsTable).values({ courseId, rating, userId, comment });
    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Input details are not correct",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    // Check whether user is enrolled in the course
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
        message: "You are not enrolled in this course",
      });
    }

    // Get course progress
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
        message: "Course progress not found",
      });
    }

    return res.status(200).json({
      progress,
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
/* ------------------------------------------------------------------ */
/* Course player (video page)                                          */
/* ------------------------------------------------------------------ */
/*
 * The player page needs three things in one request: the course, every section
 * with its lectures (ordered), and this user's progress on each lecture.
 * `contentUrl` is only ever returned from here, and only AFTER the purchase
 * check — so lecture links never leak to someone who hasn't bought the course.
 *
 * Progress lives in two tables on purpose:
 *  - content_progress  → per lecture (watched seconds / completed)
 *  - course_progress   → per course rollup (%, last lecture, last opened at)
 * Both stay in sync from `PUT /course/content/:contentId/progress`.
 */

/** Rolled-up lecture count + completion for one user on one course. */
async function courseContentProgress(userId: string, courseId: string) {
  const [row] = await db
    .select({
      totalCount: sql<number>`count(*)::int`,
      completedCount: sql<number>`(count(${contentProgressTable.id}) filter (where ${contentProgressTable.isCompleted}))::int`,
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

// Everything the player page renders: course details, sections → lectures and
// per-lecture progress. Returns 403 unless the user owns the course.
export const getCoursePlayer = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Input details are not correct",
      errors: paramResult.error.flatten(),
    });
  }

  const { courseId } = paramResult.data;

  try {
    // Access check comes first: only enrolled users get the lecture URLs.
    const [purchase] = await db
      .select({ id: coursePurchaseTable.id })
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
        message: "You are not enrolled in this course",
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
        message: "Course not found",
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
      course: {
        ...course,
        ...summary,
        lastContentId: courseProgressRows[0]?.lastContentId ?? null,
        lastAccessedAt: courseProgressRows[0]?.lastAccessedAt ?? null,
        sections,
      },
    });
  } catch (error) {
    console.error("Get course player error:", error);

    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

// Save where the user is in a lecture (and optionally mark it complete). Keeps
// `content_progress` and the `course_progress` rollup in sync.
export const saveContentProgress = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Please relogin",
    });
  }

  const paramResult = ContentProgressParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      message: "Input details are not correct",
      errors: paramResult.error.flatten(),
    });
  }

  const bodyResult = ContentProgressSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      message: "Input details are not correct",
      errors: bodyResult.error.flatten(),
    });
  }

  const { contentId } = paramResult.data;
  const { watchedSeconds, isCompleted } = bodyResult.data;

  try {
    // Which course does this lecture belong to? Needed for the ownership
    // check and for updating the rollup row.
    const [content] = await db
      .select({ courseId: courseSectionsTable.courseId })
      .from(courseContentsTable)
      .innerJoin(
        courseSectionsTable,
        eq(courseContentsTable.sectionId, courseSectionsTable.id),
      )
      .where(eq(courseContentsTable.id, contentId))
      .limit(1);

    if (!content) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    const [purchase] = await db
      .select({ id: coursePurchaseTable.id })
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
        message: "You are not enrolled in this course",
      });
    }

    // Watch position only grows (greatest) so a rewind doesn't lose it, and
    // the completed flag is only touched when the client sends it — that's
    // how the "mark as complete / incomplete" toggle works.
    const watchedGreatest = sql`greatest(${contentProgressTable.watchedSeconds}, ${watchedSeconds})`;
    const setValues =
      isCompleted === undefined
        ? { watchedSeconds: watchedGreatest, updatedAt: new Date() }
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
      message: "Progress saved",
      progress: { ...summary, lastContentId: contentId },
    });
  } catch (error) {
    console.error("Save content progress error:", error);

    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
