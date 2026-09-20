import {
  and,
  categoriesTable,
  courseProgressTable,
  coursePurchaseTable,
  coursesTable,
  db,
  eq,
  sql,
  userActivityTable,
  userGoalsTable,
} from "@repo/database";
import { StudyActivitySchema, WeeklyGoalSchema } from "@repo/zod";
import type { Request, Response } from "express";
import { addDays, startOfWeek, toDateKey } from "../utilities/date";
import { bestStreak, currentStreak } from "../utilities/streak";

/** Weekly target used until a learner saves their own goal. */
const DEFAULT_WEEKLY_GOAL_MINUTES = 600;

function toHours(minutes: number): number {
  return Math.round(minutes / 6) / 10;
}

function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function formatWeekRange(start: Date, end: Date): string {
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${format(start)} – ${format(end)}`;
}

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

function courseStatus(progress: number): {
  status: "green" | "purple" | "yellow";
  statusLabel: string;
} {
  if (progress >= 90) return { status: "yellow", statusLabel: "Almost Done" };
  if (progress >= 50) return { status: "green", statusLabel: "On Track" };
  return { status: "purple", statusLabel: "In Progress" };
}

/** Compose the learner's dashboard statistics and chart data. */
export const getDashboardStats = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
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
        .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))
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
    const dailyMinutes = Array.from(
      { length: 7 },
      (_, index) => minutesByDate.get(toDateKey(addDays(weekStart, index))) ?? 0,
    );
    const weekMinutes = dailyMinutes.reduce(
      (total, minutes) => total + minutes,
      0,
    );
    const targetMinutes =
      goalRows[0]?.targetMinutes ?? DEFAULT_WEEKLY_GOAL_MINUTES;

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
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

/** Add study minutes to a day; multiple logs for a day are accumulated. */
export const logStudyActivity = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
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

    return res.status(200).json({ message: "Study time logged" });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

/** Set or replace the learner's study-time target for the current week. */
export const updateWeeklyGoal = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
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
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};
