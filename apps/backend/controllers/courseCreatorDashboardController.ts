import { and, count, countDistinct, coursePurchaseTable, coursesTable, db, desc, eq, gte, sql, sum, usersTable } from "@repo/database";

import type { NextFunction, Request, Response } from "express";

export const getCourseCreatorStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [totalCoursesRow, totalStudentsRow, totalPurchasesRow, revenueRow, enrollmentRows, popularCoursesRows, recentEnrollmentsRows, studentGrowthRows, courseCategoriesRows] = await Promise.all([
      // =====================================================
      // TOTAL COURSES
      // =====================================================

      db
        .select({
          value: count(),
        })
        .from(coursesTable)
        .where(eq(coursesTable.createdBy, userId)),

      // =====================================================
      // UNIQUE STUDENTS
      // =====================================================

      db
        .select({
          value: countDistinct(coursePurchaseTable.userId),
        })
        .from(coursePurchaseTable)
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(eq(coursesTable.createdBy, userId)),

      // =====================================================
      // TOTAL PURCHASES
      // =====================================================

      db
        .select({
          value: count(),
        })
        .from(coursePurchaseTable)
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(eq(coursesTable.createdBy, userId)),

      // =====================================================
      // REVENUE
      // =====================================================

      db
        .select({
          value: sum(coursesTable.price),
        })
        .from(coursePurchaseTable)
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(eq(coursesTable.createdBy, userId)),

      // =====================================================
      // ENROLLMENT OVERVIEW
      // LAST 12 MONTHS
      // =====================================================

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
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(
          and(
            eq(coursesTable.createdBy, userId),
            gte(
              coursePurchaseTable.createdAt,
              sql`
                date_trunc(
                  'month',
                  current_date
                ) - interval '11 months'
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

      // =====================================================
      // POPULAR COURSES
      // =====================================================

      db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          enrollments: count(coursePurchaseTable.id),
        })
        .from(coursesTable)
        .leftJoin(coursePurchaseTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(eq(coursesTable.createdBy, userId))
        .groupBy(coursesTable.id, coursesTable.title)
        .orderBy(desc(count(coursePurchaseTable.id)))
        .limit(4),

      // =====================================================
      // RECENT ENROLLMENTS
      // =====================================================

      db
        .select({
          id: coursePurchaseTable.id,
          student: usersTable.name,
          email: usersTable.email,
          course: coursesTable.title,
          date: coursePurchaseTable.createdAt,
        })
        .from(coursePurchaseTable)
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .innerJoin(usersTable, eq(coursePurchaseTable.userId, usersTable.id))
        .where(eq(coursesTable.createdBy, userId))
        .orderBy(desc(coursePurchaseTable.createdAt))
        .limit(5),

      // =====================================================
      // STUDENT GROWTH
      // LAST 12 MONTHS
      // =====================================================

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
        .innerJoin(coursesTable, eq(coursePurchaseTable.courseId, coursesTable.id))
        .where(
          and(
            eq(coursesTable.createdBy, userId),
            gte(
              coursePurchaseTable.createdAt,
              sql`
                date_trunc(
                  'month',
                  current_date
                ) - interval '11 months'
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

      // =====================================================
      // COURSE CATEGORIES
      // =====================================================

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

    const totalCourses = Number(totalCoursesRow[0]?.value ?? 0);

    return res.status(200).json({
      success: true,

      data: {
        totalCourses,

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
          percentage: totalCourses > 0 ? Number(((Number(item.courses) / totalCourses) * 100).toFixed(1)) : 0,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
};
