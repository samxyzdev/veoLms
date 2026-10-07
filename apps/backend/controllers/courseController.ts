import { categoriesTable, coursesTable, db, desc, eq, usersTable } from "@repo/database";
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

        // Creator actual name
        creatorName: usersTable.name,
      })
      .from(coursesTable)

      // Creator
      .innerJoin(usersTable, eq(coursesTable.createdBy, usersTable.id))

      // Category
      .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))

      .where(eq(coursesTable.status, "published"))

      .orderBy(desc(coursesTable.createdAt))

      .limit(10);

    /* --------------------------------------------------------- */
    /* Generate temporary GET URL for thumbnails                 */
    /* --------------------------------------------------------- */

    const coursesWithThumbnailUrls = await Promise.all(
      courses.map(async (course) => {
        if (!course.thumbnailUrl) {
          return course;
        }

        const thumbnailUrl = await createPresignedDownloadUrl({
          key: course.thumbnailUrl,
          expiresIn: 900,
        });

        return {
          ...course,
          thumbnailUrl,
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
