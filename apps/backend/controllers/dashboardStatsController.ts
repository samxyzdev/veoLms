import {
  and,
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
} from "@repo/database";
import type { NextFunction, Request, Response } from "express";

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
// Dashboard Stats
// --------------------------------------------------

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    // ----------------------------------------------
    // 1. Enrolled Courses
    // ----------------------------------------------

    const enrolledCourses = await db
      .select({
        courseId: coursePurchaseTable.courseId,
      })
      .from(coursePurchaseTable)
      .where(eq(coursePurchaseTable.userId, userId));

    // ----------------------------------------------
    // 2. Completed Courses
    // ----------------------------------------------

    const completedCourses = await db
      .select({
        courseId: courseProgressTable.courseId,
      })
      .from(courseProgressTable)
      .where(
        and(
          eq(courseProgressTable.userId, userId),
          eq(courseProgressTable.progressPercentage, 100),
        ),
      );

    // ----------------------------------------------
    // 3. Completed Lessons
    // ----------------------------------------------

    const completedLessons = await db
      .select({
        contentId: contentProgressTable.contentId,
      })
      .from(contentProgressTable)
      .where(
        and(
          eq(contentProgressTable.userId, userId),
          eq(contentProgressTable.isCompleted, true),
        ),
      );

    // ----------------------------------------------
    // 4. Learning Activity
    // ----------------------------------------------

    const activities = await db
      .select({
        activityDate: userActivityTable.activityDate,
      })
      .from(userActivityTable)
      .where(eq(userActivityTable.userId, userId))
      .orderBy(desc(userActivityTable.activityDate));

    // ----------------------------------------------
    // Calculate streak
    // ----------------------------------------------

    const activityDates = activities.map((activity) => activity.activityDate);

    const learningStreak = calculateLearningStreak(activityDates);

    // ----------------------------------------------
    // Final Response
    // ----------------------------------------------

    return res.status(200).json({
      data: {
        enrolledCourses: enrolledCourses.length,
        completedCourses: completedCourses.length,
        lessonsCompleted: completedLessons.length,
        learningStreak,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// --------------------------------------------------
// Dashboard Course Progress
// --------------------------------------------------

export async function getDashboardCourseProgress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,

        // User's course progress
        progress: sql<number>`
          COALESCE(
            ${courseProgressTable.progressPercentage},
            0
          )
        `.as("progress"),

        // Completed lessons
        completedLessons: sql<number>`
          COUNT(${courseContentsTable.id})
          FILTER (
            WHERE ${contentProgressTable.isCompleted} = true
          )
        `.as("completed_lessons"),

        // Total lessons
        totalLessons: sql<number>`
          COUNT(${courseContentsTable.id})
        `.as("total_lessons"),

        // Course completed when progress is 100%
        isCompleted: sql<boolean>`
          COALESCE(
            ${courseProgressTable.progressPercentage},
            0
          ) = 100
        `.as("is_completed"),
      })
      .from(coursePurchaseTable)

      // Purchased course
      .innerJoin(
        coursesTable,
        eq(coursePurchaseTable.courseId, coursesTable.id),
      )

      // User-specific course progress
      .leftJoin(
        courseProgressTable,
        and(
          eq(courseProgressTable.courseId, coursesTable.id),
          eq(courseProgressTable.userId, userId),
        ),
      )

      // Course -> Sections
      .leftJoin(
        courseSectionsTable,
        eq(courseSectionsTable.courseId, coursesTable.id),
      )

      // Section -> Contents / Lessons
      .leftJoin(
        courseContentsTable,
        eq(courseContentsTable.sectionId, courseSectionsTable.id),
      )

      // User-specific content progress
      .leftJoin(
        contentProgressTable,
        and(
          eq(contentProgressTable.contentId, courseContentsTable.id),
          eq(contentProgressTable.userId, userId),
        ),
      )

      // Current user's purchased courses
      .where(eq(coursePurchaseTable.userId, userId))

      .groupBy(
        coursesTable.id,
        coursesTable.title,
        courseProgressTable.progressPercentage,
      )

      .orderBy(desc(coursesTable.createdAt));

    return res.status(200).json({
      data: courses,
    });
  } catch (error) {
    console.error("getDashboardCourseProgress error:", error);
    return next(error);
  }
}
