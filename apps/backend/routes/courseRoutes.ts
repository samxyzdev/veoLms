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
  userActivityTable,
  userGoalsTable,
} from "@repo/database";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { checkAuth } from "../middleware/checkAuth";
import {
  CommentAndReviewsSchema,
  ContentProgressParamSchema,
  ContentProgressSchema,
  ParamSchema,
  PurchaseCourseSchema,
  StudyActivitySchema,
  WeeklyGoalSchema,
} from "@repo/zod";

export const courseRoutes: Router = Router();

// send first 10 course to frontend
// actual video nahi jayega isme
courseRoutes.get("/", async (req, res, next) => {
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
});

// get purchased course like history
courseRoutes.get(
  "/purchased-course",
  checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

// purchase a course (mock checkout — real payment gateway comes later)
courseRoutes.post(
  "/purchase",
  checkAuth,
  async (req: Request, res: Response) => {
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
  },
);

// get specific video with progress
// and check is user have access to this course
courseRoutes.get(
  "/{:courseId}",
  checkAuth,
  async (req: Request, res: Response) => {},
);

// comment and reviews on specific videos
// if user have access to this course
courseRoutes.post(
  "/:courseId",
  checkAuth,
  async (req: Request, res: Response) => {
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

    const { success, data, error } = CommentAndReviewsSchema.safeParse(
      req.body,
    );

    if (!success) {
      return res.status(400).json({
        message: "input details not correct",
        errors: error,
      });
    }
    const { comment, rating } = data;
    // pure course pe hai particular vide pe nahi hai
    try {
      await db
        .insert(reviewsTable)
        .values({ courseId, rating, userId, comment });
      return res.status(200).json({
        message: "success",
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
      });
    }
  },
);

courseRoutes.get(
  "/:courseId/progress",
  checkAuth,
  async (req: Request, res: Response) => {
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
  },
);
courseRoutes.patch("/:courseId/progress", async (req, res) => {
  return res.json({
    msg: "Hello",
  });
});

// get all the course to preview

// get purchase course

// purchase course

//

/* ------------------------------------------------------------------ */
/* Student dashboard                                                   */
/* ------------------------------------------------------------------ */
/*
 * Everything the student dashboard shows is derived from data that already
 * exists in the DB:
 *  - course_purchase          → courses enrolled / active / added this month
 *  - course_progress          → per-course % and overall progress
 *  - user_activity            → study hours, weekly bars, day streak, trend
 *  - user_goals               → this week's goal (falls back to a default)
 * These routes are read-only for the dashboard plus two small writes that let
 * the frontend log study time and change the weekly target.
 */

/** Weekly goal used until a user sets their own (10 hours). */
const DEFAULT_WEEKLY_GOAL_MINUTES = 600;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** `YYYY-MM-DD` — the exact string a postgres `date` column stores/returns. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Midnight on the Monday of the week containing `date` (weeks run Mon → Sun). */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // getDay(): 0 = Sunday … 6 = Saturday. Shift so Monday becomes 0.
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

/** New Date `days` after `date`, at midnight local time. */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

/** Minutes → hours rounded to one decimal, so cards never show 7.4999. */
function toHours(minutes: number): number {
  return Math.round(minutes / 6) / 10;
}

/** Weekday index with Monday as 0 (JS gives Sunday as 0). */
function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** "Sep 14 – Sep 20" label for the weekly goal card. */
function formatWeekRange(start: Date, end: Date): string {
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${format(start)} – ${format(end)}`;
}

/** date key → minutes studied that day (summed, in case of duplicate rows). */
function totalMinutesByDate(
  rows: { activityDate: string; minutesStudied: number }[],
): Map<string, number> {
  const byDate = new Map<string, number>();
  for (const row of rows) {
    byDate.set(
      row.activityDate,
      (byDate.get(row.activityDate) ?? 0) + row.minutesStudied,
    );
  }
  return byDate;
}

/**
 * Current run of consecutive active days. Today counts when the user already
 * studied today; otherwise the run is still alive from yesterday.
 */
export function currentStreak(activeDates: Set<string>, today: Date): number {
  const cursor = new Date(today);
  if (!activeDates.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (activeDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Longest consecutive run of active days the user has ever had. */
export function bestStreak(activeDates: Set<string>): number {
  const timestamps = [...activeDates]
    .map((key) => new Date(`${key}T00:00:00`).getTime())
    .sort((a, b) => a - b);

  let best = 0;
  let run = 0;
  let previous: number | null = null;

  for (const timestamp of timestamps) {
    run = previous !== null && timestamp - previous === ONE_DAY_MS ? run + 1 : 1;
    if (run > best) best = run;
    previous = timestamp;
  }
  return best;
}

/** Chip shown next to a course in the dashboard list. */
function courseStatus(progress: number): {
  status: "green" | "purple" | "yellow";
  statusLabel: string;
} {
  if (progress >= 90) return { status: "yellow", statusLabel: "Almost Done" };
  if (progress >= 50) return { status: "green", statusLabel: "On Track" };
  return { status: "purple", statusLabel: "In Progress" };
}

// Everything the student dashboard renders, in a single request: weekly goal,
// course counts, study hours, day streak, charts data and recent courses.
courseRoutes.get(
  "/dashboard/stats",
  checkAuth,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please relogin",
      });
    }

    try {
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = addDays(weekStart, 6);
      const weekStartKey = toDateKey(weekStart);

      const [activityRows, enrolledCourses, goalRows] = await Promise.all([
        db
          .select({
            activityDate: userActivityTable.activityDate,
            minutesStudied: userActivityTable.minutesStudied,
          })
          .from(userActivityTable)
          .where(eq(userActivityTable.userId, userId)),

        // Every purchase with the course details, its category and (if the
        // user started it) the progress row for that course.
        db
          .select({
            courseId: coursesTable.id,
            title: coursesTable.title,
            categoryName: categoriesTable.name,
            purchasedAt: coursePurchaseTable.createdAt,
            progress: courseProgressTable.progressPercentage,
            lastAccessedAt: courseProgressTable.lastAccessedAt,
          })
          .from(coursePurchaseTable)
          .innerJoin(
            coursesTable,
            eq(coursePurchaseTable.courseId, coursesTable.id),
          )
          .leftJoin(
            categoriesTable,
            eq(coursesTable.categoryId, categoriesTable.id),
          )
          .leftJoin(
            courseProgressTable,
            and(
              eq(courseProgressTable.courseId, coursesTable.id),
              eq(courseProgressTable.userId, userId),
            ),
          )
          .where(eq(coursePurchaseTable.userId, userId)),

        db
          .select({ targetMinutes: userGoalsTable.targetMinutes })
          .from(userGoalsTable)
          .where(
            and(
              eq(userGoalsTable.userId, userId),
              eq(userGoalsTable.weekStart, weekStartKey),
            ),
          )
          .limit(1),
      ]);

      const minutesByDate = totalMinutesByDate(activityRows);
      const activeDates = new Set(
        [...minutesByDate.entries()]
          .filter(([, minutes]) => minutes > 0)
          .map(([key]) => key),
      );

      // One number per weekday (Mon → Sun) for the bar chart.
      const dailyMinutes = Array.from(
        { length: 7 },
        (_, index) => minutesByDate.get(toDateKey(addDays(weekStart, index))) ?? 0,
      );
      const weekMinutes = dailyMinutes.reduce((total, minutes) => total + minutes, 0);

      const targetMinutes =
        goalRows[0]?.targetMinutes ?? DEFAULT_WEEKLY_GOAL_MINUTES;

      // Last 6 weeks of study time (hours per week), oldest first.
      const studyTrend = Array.from({ length: 6 }, (_, index) => {
        const start = addDays(weekStart, -7 * (5 - index));
        let minutes = 0;
        for (let day = 0; day < 7; day += 1) {
          minutes += minutesByDate.get(toDateKey(addDays(start, day))) ?? 0;
        }
        return toHours(minutes);
      });

      const progressValues = enrolledCourses
        .map((course) => course.progress)
        .filter((progress): progress is number => progress !== null);

      // Courses the user touched most recently, newest activity first.
      const recentCourses = [...enrolledCourses]
        .sort(
          (a, b) =>
            (b.lastAccessedAt ?? b.purchasedAt).getTime() -
            (a.lastAccessedAt ?? a.purchasedAt).getTime(),
        )
        .slice(0, 3)
        .map((course) => {
          const progress = course.progress ?? 0;
          return {
            id: course.courseId,
            title: course.title,
            category: course.categoryName ?? "General",
            progress,
            ...courseStatus(progress),
          };
        });

      return res.status(200).json({
        stats: {
          weeklyGoal: {
            hoursDone: toHours(weekMinutes),
            hoursTarget: toHours(targetMinutes),
            minutesDone: weekMinutes,
            minutesTarget: targetMinutes,
            percent:
              targetMinutes > 0
                ? Math.min(100, Math.round((weekMinutes / targetMinutes) * 100))
                : 0,
            dateRange: formatWeekRange(weekStart, weekEnd),
          },
          courses: {
            enrolled: enrolledCourses.length,
            active: enrolledCourses.filter(
              (course) =>
                (course.progress ?? 0) > 0 && (course.progress ?? 0) < 100,
            ).length,
            addedThisMonth: enrolledCourses.filter(
              (course) =>
                course.purchasedAt.getMonth() === today.getMonth() &&
                course.purchasedAt.getFullYear() === today.getFullYear(),
            ).length,
          },
          study: {
            hours: toHours(weekMinutes),
            avgPerDay: `${toHours(Math.round(weekMinutes / 7))}h`,
            dailyMinutes,
            highlightIndex: weekdayIndex(today),
          },
          streak: {
            days: currentStreak(activeDates, today),
            personalBest: bestStreak(activeDates),
            todayIndex: weekdayIndex(today),
          },
          overallProgress:
            progressValues.length > 0
              ? Math.round(
                  progressValues.reduce((total, value) => total + value, 0) /
                    progressValues.length,
                )
              : 0,
          studyTrend,
          recentCourses,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

// Log study time for a day (today by default). This is what feeds study hours
// and the day streak; several calls for the same day add up.
courseRoutes.post(
  "/dashboard/activity",
  checkAuth,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please relogin",
      });
    }

    const result = StudyActivitySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "input details not correct",
        errors: result.error,
      });
    }

    const { minutes, activityDate } = result.data;

    try {
      await db
        .insert(userActivityTable)
        .values({
          userId,
          activityDate: activityDate ?? toDateKey(new Date()),
          minutesStudied: minutes,
        })
        .onConflictDoUpdate({
          target: [userActivityTable.userId, userActivityTable.activityDate],
          set: {
            minutesStudied: sql`${userActivityTable.minutesStudied} + ${minutes}`,
            updatedAt: new Date(),
          },
        });

      return res.status(200).json({
        message: "Study time logged",
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

// Set (or replace) the study-time target for the current week.
courseRoutes.put(
  "/dashboard/goal",
  checkAuth,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please relogin",
      });
    }

    const result = WeeklyGoalSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "input details not correct",
        errors: result.error,
      });
    }

    const { targetMinutes } = result.data;
    const weekStart = startOfWeek(new Date());

    try {
      await db
        .insert(userGoalsTable)
        .values({
          userId,
          targetMinutes,
          weekStart: toDateKey(weekStart),
          weekEnd: toDateKey(addDays(weekStart, 6)),
        })
        .onConflictDoUpdate({
          target: [userGoalsTable.userId, userGoalsTable.weekStart],
          set: { targetMinutes, updatedAt: new Date() },
        });

      return res.status(200).json({
        message: "Weekly goal updated",
        weeklyGoal: {
          minutesTarget: targetMinutes,
          hoursTarget: toHours(targetMinutes),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

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
courseRoutes.get(
  "/:courseId/player",
  checkAuth,
  async (req: Request, res: Response) => {
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
        completedCount: contentRows.filter((content) =>
          progressByContent.get(content.id)?.isCompleted,
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
  },
);

// Save where the user is in a lecture (and optionally mark it complete). Keeps
// `content_progress` and the `course_progress` rollup in sync.
courseRoutes.put(
  "/content/:contentId/progress",
  checkAuth,
  async (req: Request, res: Response) => {
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
  },
);
