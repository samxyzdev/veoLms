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
  sql,
  userActivityTable,
  userGoalsTable,
} from "@repo/database";

import { StudyActivitySchema, WeeklyGoalSchema } from "@repo/zod";

import type { NextFunction, Request, Response } from "express";

import { addDays, startOfWeek, toDateKey } from "../utilities/date";

import { bestStreak, currentStreak } from "../utilities/streak";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Weekly target used until a learner saves their own goal.
 */
const DEFAULT_WEEKLY_GOAL_MINUTES = 600;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toHours(minutes: number): number {
  return Math.round(minutes / 6) / 10;
}

function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function formatWeekRange(start: Date, end: Date): string {
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return `${format(start)} – ${format(end)}`;
}

function totalMinutesByDate(
  rows: {
    activityDate: string;
    minutesStudied: number;
  }[],
): Map<string, number> {
  const byDate = new Map<string, number>();

  for (const row of rows) {
    byDate.set(row.activityDate, (byDate.get(row.activityDate) ?? 0) + row.minutesStudied);
  }

  return byDate;
}

function courseStatus(progress: number): {
  status: "green" | "purple" | "yellow";
  statusLabel: string;
} {
  if (progress >= 90) {
    return {
      status: "yellow",
      statusLabel: "Almost Done",
    };
  }

  if (progress >= 50) {
    return {
      status: "green",
      statusLabel: "On Track",
    };
  }

  return {
    status: "purple",
    statusLabel: "In Progress",
  };
}

/* -------------------------------------------------------------------------- */
/* Dashboard Stats                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Returns the learner's complete dashboard statistics.
 *
 * Includes:
 * - weekly goal
 * - enrolled courses
 * - completed courses
 * - completed lessons
 * - study statistics
 * - streak
 * - overall progress
 * - study trend
 * - recent courses
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const today = new Date();

    const weekStart = startOfWeek(today);
    const weekEnd = addDays(weekStart, 6);

    const weekStartKey = toDateKey(weekStart);

    const [activityRows, enrolledCourses, goalRows, completedCourses, completedLessons] = await Promise.all([
      /* -------------------------------------------------------------------- */
      /* Study activity                                                        */
      /* -------------------------------------------------------------------- */

      db
        .select({
          activityDate: userActivityTable.activityDate,

          minutesStudied: userActivityTable.minutesStudied,
        })
        .from(userActivityTable)
        .where(eq(userActivityTable.userId, userId)),

      /* -------------------------------------------------------------------- */
      /* Enrolled courses                                                      */
      /* -------------------------------------------------------------------- */

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
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))
        .leftJoin(courseProgressTable, and(eq(courseProgressTable.courseId, coursesTable.id), eq(courseProgressTable.userId, userId)))
        .where(eq(coursePurchaseTable.userId, userId)),

      /* -------------------------------------------------------------------- */
      /* Weekly goal                                                           */
      /* -------------------------------------------------------------------- */

      db
        .select({
          targetMinutes: userGoalsTable.targetMinutes,
        })
        .from(userGoalsTable)
        .where(and(eq(userGoalsTable.userId, userId), eq(userGoalsTable.weekStart, weekStartKey)))
        .limit(1),

      /* -------------------------------------------------------------------- */
      /* Completed courses                                                     */
      /* -------------------------------------------------------------------- */

      db
        .select({
          courseId: courseProgressTable.courseId,
        })
        .from(courseProgressTable)
        .where(and(eq(courseProgressTable.userId, userId), eq(courseProgressTable.progressPercentage, 100))),

      /* -------------------------------------------------------------------- */
      /* Completed lessons                                                     */
      /* -------------------------------------------------------------------- */

      db
        .select({
          contentId: contentProgressTable.contentId,
        })
        .from(contentProgressTable)
        .where(and(eq(contentProgressTable.userId, userId), eq(contentProgressTable.isCompleted, true))),
    ]);

    /* ---------------------------------------------------------------------- */
    /* Activity calculations                                                  */
    /* ---------------------------------------------------------------------- */

    const minutesByDate = totalMinutesByDate(activityRows);

    const activeDates = new Set([...minutesByDate.entries()].filter(([, minutes]) => minutes > 0).map(([key]) => key));

    const dailyMinutes = Array.from({ length: 7 }, (_, index) => minutesByDate.get(toDateKey(addDays(weekStart, index))) ?? 0);

    const weekMinutes = dailyMinutes.reduce((total, minutes) => total + minutes, 0);

    const targetMinutes = goalRows[0]?.targetMinutes ?? DEFAULT_WEEKLY_GOAL_MINUTES;

    /* ---------------------------------------------------------------------- */
    /* Study trend - last 6 weeks                                             */
    /* ---------------------------------------------------------------------- */

    const studyTrend = Array.from({ length: 6 }, (_, index) => {
      const start = addDays(weekStart, -7 * (5 - index));

      let minutes = 0;

      for (let day = 0; day < 7; day += 1) {
        minutes += minutesByDate.get(toDateKey(addDays(start, day))) ?? 0;
      }

      return toHours(minutes);
    });

    /* ---------------------------------------------------------------------- */
    /* Overall progress                                                       */
    /* ---------------------------------------------------------------------- */

    const progressValues = enrolledCourses.map((course) => course.progress).filter((progress): progress is number => progress !== null);

    const overallProgress = progressValues.length > 0 ? Math.round(progressValues.reduce((total, value) => total + value, 0) / progressValues.length) : 0;

    /* ---------------------------------------------------------------------- */
    /* Recent courses                                                         */
    /* ---------------------------------------------------------------------- */

    const recentCourses = [...enrolledCourses]
      .sort((a, b) => (b.lastAccessedAt ?? b.purchasedAt).getTime() - (a.lastAccessedAt ?? a.purchasedAt).getTime())
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

    /* ---------------------------------------------------------------------- */
    /* Final response                                                         */
    /* ---------------------------------------------------------------------- */

    return res.status(200).json({
      success: true,

      data: {
        /* ------------------------------------------------------------------ */
        /* Weekly goal                                                        */
        /* ------------------------------------------------------------------ */

        weeklyGoal: {
          hoursDone: toHours(weekMinutes),

          hoursTarget: toHours(targetMinutes),

          minutesDone: weekMinutes,

          minutesTarget: targetMinutes,

          percent: targetMinutes > 0 ? Math.min(100, Math.round((weekMinutes / targetMinutes) * 100)) : 0,

          dateRange: formatWeekRange(weekStart, weekEnd),
        },

        /* ------------------------------------------------------------------ */
        /* Courses                                                            */
        /* ------------------------------------------------------------------ */

        courses: {
          enrolled: enrolledCourses.length,

          completed: completedCourses.length,

          active: enrolledCourses.filter((course) => {
            const progress = course.progress ?? 0;

            return progress > 0 && progress < 100;
          }).length,

          addedThisMonth: enrolledCourses.filter((course) => course.purchasedAt.getMonth() === today.getMonth() && course.purchasedAt.getFullYear() === today.getFullYear()).length,
        },

        /* ------------------------------------------------------------------ */
        /* Lessons                                                             */
        /* ------------------------------------------------------------------ */

        lessons: {
          completed: completedLessons.length,
        },

        /* ------------------------------------------------------------------ */
        /* Study                                                               */
        /* ------------------------------------------------------------------ */

        study: {
          hours: toHours(weekMinutes),

          avgPerDay: `${toHours(Math.round(weekMinutes / 7))}h`,

          dailyMinutes,

          highlightIndex: weekdayIndex(today),
        },

        /* ------------------------------------------------------------------ */
        /* Streak                                                              */
        /* ------------------------------------------------------------------ */

        streak: {
          days: currentStreak(activeDates, today),

          personalBest: bestStreak(activeDates),

          todayIndex: weekdayIndex(today),
        },

        /* ------------------------------------------------------------------ */
        /* Overall progress                                                   */
        /* ------------------------------------------------------------------ */

        overallProgress,

        /* ------------------------------------------------------------------ */
        /* Charts / recent courses                                            */
        /* ------------------------------------------------------------------ */

        studyTrend,

        recentCourses,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Dashboard Course Progress                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns course-wise progress for the current learner.
 */
export const getDashboardCourseProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const courses = await db
      .select({
        id: coursesTable.id,

        title: coursesTable.title,

        /* ------------------------------------------------------------------ */
        /* User's course progress                                              */
        /* ------------------------------------------------------------------ */

        progress: sql<number>`
          COALESCE(
            ${courseProgressTable.progressPercentage},
            0
          )
        `.as("progress"),

        /* ------------------------------------------------------------------ */
        /* Completed lessons                                                   */
        /* ------------------------------------------------------------------ */

        completedLessons: sql<number>`
          COUNT(${courseContentsTable.id})
          FILTER (
            WHERE ${contentProgressTable.isCompleted} = true
          )
        `.as("completed_lessons"),

        /* ------------------------------------------------------------------ */
        /* Total lessons                                                       */
        /* ------------------------------------------------------------------ */

        totalLessons: sql<number>`
          COUNT(${courseContentsTable.id})
        `.as("total_lessons"),

        /* ------------------------------------------------------------------ */
        /* Course completed                                                    */
        /* ------------------------------------------------------------------ */

        isCompleted: sql<boolean>`
          COALESCE(
            ${courseProgressTable.progressPercentage},
            0
          ) = 100
        `.as("is_completed"),
      })

      /* -------------------------------------------------------------------- */
      /* Purchased course                                                     */
      /* -------------------------------------------------------------------- */

      .from(coursePurchaseTable)

      .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))

      /* -------------------------------------------------------------------- */
      /* User-specific course progress                                        */
      /* -------------------------------------------------------------------- */

      .leftJoin(courseProgressTable, and(eq(courseProgressTable.courseId, coursesTable.id), eq(courseProgressTable.userId, userId)))

      /* -------------------------------------------------------------------- */
      /* Course -> Sections                                                   */
      /* -------------------------------------------------------------------- */

      .leftJoin(courseSectionsTable, eq(courseSectionsTable.courseId, coursesTable.id))

      /* -------------------------------------------------------------------- */
      /* Section -> Contents / Lessons                                        */
      /* -------------------------------------------------------------------- */

      .leftJoin(courseContentsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))

      /* -------------------------------------------------------------------- */
      /* User-specific content progress                                       */
      /* -------------------------------------------------------------------- */

      .leftJoin(contentProgressTable, and(eq(contentProgressTable.contentId, courseContentsTable.id), eq(contentProgressTable.userId, userId)))

      /* -------------------------------------------------------------------- */
      /* Current user's purchased courses                                     */
      /* -------------------------------------------------------------------- */

      .where(eq(coursePurchaseTable.userId, userId))

      .groupBy(coursesTable.id, coursesTable.title, courseProgressTable.progressPercentage)

      .orderBy(desc(coursesTable.createdAt));

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("getDashboardCourseProgress error:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Log Study Activity                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Add study minutes to a day.
 *
 * Multiple logs for the same day are accumulated.
 */
export const logStudyActivity = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const result = StudyActivitySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: result.error.flatten(),
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
          minutesStudied: sql`
            ${userActivityTable.minutesStudied}
            + ${minutes}
          `,

          updatedAt: new Date(),
        },
      });

    return res.status(200).json({
      success: true,
      message: "Study time logged.",
    });
  } catch (error) {
    console.error("logStudyActivity error:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Update Weekly Goal                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Set or replace the learner's study-time target
 * for the current week.
 */
export const updateWeeklyGoal = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const result = WeeklyGoalSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: result.error.flatten(),
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

        set: {
          targetMinutes,
          updatedAt: new Date(),
        },
      });

    return res.status(200).json({
      success: true,

      message: "Weekly goal updated.",

      weeklyGoal: {
        minutesTarget: targetMinutes,

        hoursTarget: toHours(targetMinutes),
      },
    });
  } catch (error) {
    console.error("updateWeeklyGoal error:", error);

    return next(error);
  }
};
