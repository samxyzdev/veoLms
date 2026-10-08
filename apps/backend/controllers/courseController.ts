import { categoriesTable, coursePurchaseTable, coursesTable, db, desc, eq, reviewsTable, sql, usersTable } from "@repo/database";
import { createPresignedDownloadUrl } from "../services/s3";
import type { NextFunction, Request, Response } from "express";

export const listCourses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        price: coursesTable.price,

        createdBy: coursesTable.createdBy,

        categoryId: coursesTable.categoryId,
        categoryName: categoriesTable.name,

        courseLanguage: coursesTable.courseLanguage,
        level: coursesTable.level,

        thumbnailUrl: coursesTable.thumbnailUrl,

        status: coursesTable.status,
        publishedAt: coursesTable.publishedAt,
        archivedAt: coursesTable.archivedAt,

        createdAt: coursesTable.createdAt,
        updatedAt: coursesTable.updatedAt,

        // Creator
        creatorName: usersTable.name,

        // -----------------------------------------------------
        // Total enrolled students
        // -----------------------------------------------------
        studentsCount: sql<number>`
          (
            SELECT COUNT(*)::int
            FROM ${coursePurchaseTable}
            WHERE ${coursePurchaseTable.courseId} = ${coursesTable.id}
          )
        `.as("students_count"),

        // -----------------------------------------------------
        // Total reviews
        // -----------------------------------------------------
        reviewCount: sql<number>`
          (
            SELECT COUNT(*)::int
            FROM ${reviewsTable}
            WHERE ${reviewsTable.courseId} = ${coursesTable.id}
          )
        `.as("review_count"),

        // -----------------------------------------------------
        // Average rating
        // -----------------------------------------------------
        rating: sql<number | null>`
          (
            SELECT ROUND(
              AVG(${reviewsTable.rating})::numeric,
              1
            )
            FROM ${reviewsTable}
            WHERE ${reviewsTable.courseId} = ${coursesTable.id}
          )
        `.as("rating"),
      })
      .from(coursesTable)

      // Creator
      .innerJoin(usersTable, eq(coursesTable.createdBy, usersTable.id))

      // Category
      .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))

      // Only published courses
      .where(eq(coursesTable.status, "published"))

      .orderBy(desc(coursesTable.createdAt))

      .limit(10);

    /* --------------------------------------------------------- */
    /* Generate temporary GET URL for thumbnails                 */
    /* --------------------------------------------------------- */

    const coursesWithThumbnailUrls = await Promise.all(
      courses.map(async (course) => {
        let thumbnailUrl = course.thumbnailUrl;

        if (thumbnailUrl) {
          thumbnailUrl = await createPresignedDownloadUrl({
            key: thumbnailUrl,
            expiresIn: 900,
          });
        }

        return {
          ...course,

          thumbnailUrl,

          // PostgreSQL COUNT can be returned as string
          studentsCount: Number(course.studentsCount),

          reviewCount: Number(course.reviewCount),

          // Keep null when there are no reviews
          rating: course.rating === null ? null : Number(course.rating),
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: coursesWithThumbnailUrls,
    });
  } catch (error) {
    return next(error);
  }
};
