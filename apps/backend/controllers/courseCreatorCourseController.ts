import { and, asc, categoriesTable, count, courseContentsTable, courseSectionsTable, coursesTable, db, desc, eq, inArray, sql } from "@repo/database";

import { CreateCourseSchema, CreateCourseVideoSchema, ParamSchema, UpdateCourseSchema } from "@repo/zod";

import type { NextFunction, Request, Response } from "express";

import { z } from "@repo/zod";

const DEFAULT_CATEGORIES = [
  "Web Development",
  "App Development",
  "Mobile Development",
  "Gaming",
  "Videography",
  "Data Science",
  "Design",
  "Photography",
  "Music",
  "Marketing",
  "Business",
  "Personal Growth",
];

const CreateCourseDraftSchema = CreateCourseSchema.partial();

const CreateSectionSchema = z.object({
  title: z.string().trim().min(1, "Section title is required").max(255, "Section title is too long"),
});

const CreateContentSchema = z.object({
  title: z.string().trim().min(1, "Content title is required").max(255, "Content title is too long"),

  contentType: z.string().trim().min(1, "Content type is required").max(50),

  contentUrl: z.string().trim().min(1, "Content URL is required"),
});

const ReorderIdsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
});

async function getOwnedCourse(courseId: string, userId: string) {
  const [course] = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      price: coursesTable.price,
      createdBy: coursesTable.createdBy,
      categoryId: coursesTable.categoryId,
      courseLanguage: coursesTable.courseLanguage,

      status: coursesTable.status,
      publishedAt: coursesTable.publishedAt,
      archivedAt: coursesTable.archivedAt,

      level: coursesTable.level,
      thumbnailUrl: coursesTable.thumbnailUrl,

      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
    })
    .from(coursesTable)
    .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
    .limit(1);

  return course;
}

/* -------------------------------------------------------------------------- */
/* List creator courses                                                       */
/* -------------------------------------------------------------------------- */

export const listCreatorCourses = async (req: Request, res: Response, next: NextFunction) => {
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
        description: coursesTable.description,
        price: coursesTable.price,
        createdBy: coursesTable.createdBy,
        categoryId: coursesTable.categoryId,
        courseLanguage: coursesTable.courseLanguage,

        status: coursesTable.status,
        publishedAt: coursesTable.publishedAt,
        archivedAt: coursesTable.archivedAt,

        level: coursesTable.level,
        thumbnailUrl: coursesTable.thumbnailUrl,

        createdAt: coursesTable.createdAt,
        updatedAt: coursesTable.updatedAt,
      })
      .from(coursesTable)
      .where(eq(coursesTable.createdBy, userId))
      .orderBy(desc(coursesTable.createdAt));

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Backward-compatible alias                                                  */
/* -------------------------------------------------------------------------- */

export const listCourseCreatorCourses = listCreatorCourses;

/* -------------------------------------------------------------------------- */
/* List categories                                                            */
/* -------------------------------------------------------------------------- */

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await db
      .select({
        name: categoriesTable.name,
      })
      .from(categoriesTable);

    const existingNames = new Set(existing.map((row) => row.name));

    const missing = DEFAULT_CATEGORIES.filter((name) => !existingNames.has(name));

    if (missing.length > 0) {
      await db.insert(categoriesTable).values(
        missing.map((name) => ({
          name,
        })),
      );
    }

    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Create course / create draft                                               */
/* -------------------------------------------------------------------------- */

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const result = CreateCourseDraftSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: result.error.flatten(),
    });
  }

  const { title, description, price, courseLanguage, categoryId, level, thumbnailUrl } = result.data;

  try {
    if (categoryId) {
      const [category] = await db
        .select({
          id: categoriesTable.id,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId))
        .limit(1);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    }

    const [course] = await db
      .insert(coursesTable)
      .values({
        title: title?.trim() || null,
        description: description?.trim() || null,
        price: price ?? null,
        createdBy: userId,
        categoryId: categoryId ?? null,
        courseLanguage: courseLanguage?.trim() || null,
        level: level ?? null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        status: "draft",
      })
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        createdAt: coursesTable.createdAt,
      });

    if (!course) {
      return res.status(500).json({
        success: false,
        message: "Could not create course draft.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Course draft created successfully.",
      data: {
        courseId: course.id,
        status: course.status,
        createdAt: course.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Get one course                                                             */
/* -------------------------------------------------------------------------- */

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const sections = await db
      .select({
        id: courseSectionsTable.id,
        courseId: courseSectionsTable.courseId,
        title: courseSectionsTable.title,
        sequenceOrder: courseSectionsTable.sequenceOrder,
        createdAt: courseSectionsTable.createdAt,
        updatedAt: courseSectionsTable.updatedAt,
      })
      .from(courseSectionsTable)
      .where(eq(courseSectionsTable.courseId, courseId))
      .orderBy(asc(courseSectionsTable.sequenceOrder));

    const contents = await db
      .select({
        id: courseContentsTable.id,
        sectionId: courseContentsTable.sectionId,
        title: courseContentsTable.title,
        contentType: courseContentsTable.contentType,
        contentUrl: courseContentsTable.contentUrl,
        sequenceOrder: courseContentsTable.sequenceOrder,
        createdAt: courseContentsTable.createdAt,
        updatedAt: courseContentsTable.updatedAt,
      })
      .from(courseContentsTable)
      .innerJoin(courseSectionsTable, eq(courseContentsTable.sectionId, courseSectionsTable.id))
      .where(eq(courseSectionsTable.courseId, courseId))
      .orderBy(asc(courseContentsTable.sequenceOrder));

    const sectionsWithContents = sections.map((section) => ({
      ...section,
      contents: contents.filter((content) => content.sectionId === section.id),
    }));

    return res.status(200).json({
      success: true,
      data: {
        course,
        sections: sectionsWithContents,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Update course                                                              */
/* -------------------------------------------------------------------------- */

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const paramResult = ParamSchema.safeParse(req.params);

  const bodyResult = UpdateCourseSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: {
        params: paramResult.success ? undefined : paramResult.error.flatten(),

        body: bodyResult.success ? undefined : bodyResult.error.flatten(),
      },
    });
  }

  const { courseId } = paramResult.data;
  const updates = bodyResult.data;

  try {
    const existingCourse = await getOwnedCourse(courseId, userId);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (existingCourse.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be edited. Restore it first.",
      });
    }

    if (updates.categoryId) {
      const [category] = await db
        .select({
          id: categoriesTable.id,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, updates.categoryId))
        .limit(1);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    }

    const [course] = await db
      .update(coursesTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        updatedAt: coursesTable.updatedAt,
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course saved successfully.",
      data: {
        courseId: course.id,
        status: course.status,
        updatedAt: course.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Publish course                                                             */
/* -------------------------------------------------------------------------- */

export const publishCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Restore the course before publishing it.",
      });
    }

    const missingFields: string[] = [];

    if (!course.title?.trim()) {
      missingFields.push("title");
    }

    if (!course.description?.trim()) {
      missingFields.push("description");
    }

    if (course.categoryId === null || course.categoryId === undefined) {
      missingFields.push("category");
    }

    if (!course.courseLanguage?.trim()) {
      missingFields.push("language");
    }

    if (course.price === null || course.price === undefined) {
      missingFields.push("price");
    }

    if (!course.level) {
      missingFields.push("level");
    }

    if (!course.thumbnailUrl?.trim()) {
      missingFields.push("thumbnail");
    }

    const sectionCountRow = await db
      .select({
        value: count(),
      })
      .from(courseSectionsTable)
      .where(eq(courseSectionsTable.courseId, courseId));

    const sectionCount = Number(sectionCountRow[0]?.value ?? 0);

    if (sectionCount === 0) {
      missingFields.push("course content");
    }

    if (missingFields.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Course is not ready to be published.",
        errors: {
          missingFields,
        },
      });
    }

    const [updatedCourse] = await db
      .update(coursesTable)
      .set({
        status: "published",
        publishedAt: new Date(),
        archivedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        publishedAt: coursesTable.publishedAt,
      });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course published successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Make course private                                                        */
/* -------------------------------------------------------------------------- */

export const makeCoursePrivate = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      });
    }

    const { courseId } = paramResult.data;

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be made private.",
      });
    }

    if (course.status === "draft") {
      return res.status(409).json({
        success: false,
        message: "Draft course cannot be made private. Save/complete it first.",
      });
    }

    const [updatedCourse] = await db
      .update(coursesTable)
      .set({
        status: "private",
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        updatedAt: coursesTable.updatedAt,
      });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course is now private.",
      data: updatedCourse,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Archive course                                                             */
/* -------------------------------------------------------------------------- */

export const archiveCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      });
    }

    const { courseId } = paramResult.data;

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Course is already archived.",
      });
    }

    const [updatedCourse] = await db
      .update(coursesTable)
      .set({
        status: "archived",
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        archivedAt: coursesTable.archivedAt,
      });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course archived successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Restore course                                                             */
/* -------------------------------------------------------------------------- */

export const restoreCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      });
    }

    const { courseId } = paramResult.data;

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status !== "archived") {
      return res.status(409).json({
        success: false,
        message: "Only archived courses can be restored.",
      });
    }

    const [updatedCourse] = await db
      .update(coursesTable)
      .set({
        status: "draft",
        archivedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .returning({
        id: coursesTable.id,
        status: coursesTable.status,
        archivedAt: coursesTable.archivedAt,
      });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course restored to draft.",
      data: updatedCourse,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Create course section                                                      */
/* -------------------------------------------------------------------------- */

export const createCourseSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const paramResult = ParamSchema.safeParse(req.params);

    const bodyResult = CreateSectionSchema.safeParse(req.body);

    if (!paramResult.success || !bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: {
          params: paramResult.success ? undefined : paramResult.error.flatten(),

          body: bodyResult.success ? undefined : bodyResult.error.flatten(),
        },
      });
    }

    const { courseId } = paramResult.data;
    const { title } = bodyResult.data;

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be edited.",
      });
    }

    const [sequence] = await db
      .select({
        value: sql<number>`
          coalesce(
            max(
              ${courseSectionsTable.sequenceOrder}
            ),
            0
          )
        `,
      })
      .from(courseSectionsTable)
      .where(eq(courseSectionsTable.courseId, courseId));

    const nextOrder = Number(sequence?.value ?? 0) + 1;

    const [section] = await db
      .insert(courseSectionsTable)
      .values({
        courseId,
        title,
        sequenceOrder: nextOrder,
      })
      .returning({
        id: courseSectionsTable.id,
        title: courseSectionsTable.title,
        sequenceOrder: courseSectionsTable.sequenceOrder,
      });

    if (!section) {
      return res.status(500).json({
        success: false,
        message: "Could not create course section.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Course section created successfully.",
      data: section,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Reorder course sections                                                    */
/* -------------------------------------------------------------------------- */

export const reorderCourseSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const paramResult = ParamSchema.safeParse(req.params);

    const bodyResult = ReorderIdsSchema.safeParse(req.body);

    if (!paramResult.success || !bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
      });
    }

    const { courseId } = paramResult.data;
    const { ids } = bodyResult.data;

    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const sections = await db
      .select({
        id: courseSectionsTable.id,
      })
      .from(courseSectionsTable)
      .where(and(eq(courseSectionsTable.courseId, courseId), inArray(courseSectionsTable.id, ids)));

    const existingIds = new Set(sections.map((section) => section.id));

    if (existingIds.size !== ids.length || !ids.every((id) => existingIds.has(id))) {
      return res.status(400).json({
        success: false,
        message: "One or more section IDs are invalid.",
      });
    }

    await db.transaction(async (tx) => {
      for (let index = 0; index < ids.length; index++) {
        await tx
          .update(courseSectionsTable)
          .set({
            sequenceOrder: index + 1,
            updatedAt: new Date(),
          })
          .where(and(eq(courseSectionsTable.id, ids[index]), eq(courseSectionsTable.courseId, courseId)));
      }

      await tx
        .update(coursesTable)
        .set({
          updatedAt: new Date(),
        })
        .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)));
    });

    return res.status(200).json({
      success: true,
      message: "Course sections reordered successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Add course content                                                         */
/* -------------------------------------------------------------------------- */

export const addCourseContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { sectionId } = req.params;

    if (!sectionId || typeof sectionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID.",
      });
    }

    const bodyResult = CreateContentSchema.safeParse(req.body);

    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: bodyResult.error.flatten(),
      });
    }

    const { title, contentType, contentUrl } = bodyResult.data;

    const [section] = await db
      .select({
        id: courseSectionsTable.id,
        courseId: courseSectionsTable.courseId,
        courseStatus: coursesTable.status,
      })
      .from(courseSectionsTable)
      .innerJoin(coursesTable, eq(courseSectionsTable.courseId, coursesTable.id))
      .where(and(eq(courseSectionsTable.id, sectionId), eq(coursesTable.createdBy, userId)))
      .limit(1);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Course section not found.",
      });
    }

    if (section.courseStatus === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be edited.",
      });
    }

    const [sequence] = await db
      .select({
        value: sql<number>`
          coalesce(
            max(
              ${courseContentsTable.sequenceOrder}
            ),
            0
          )
        `,
      })
      .from(courseContentsTable)
      .where(eq(courseContentsTable.sectionId, sectionId));

    const nextOrder = Number(sequence?.value ?? 0) + 1;

    const [content] = await db
      .insert(courseContentsTable)
      .values({
        sectionId,
        title,
        contentType,
        contentUrl,
        sequenceOrder: nextOrder,
      })
      .returning({
        id: courseContentsTable.id,
        title: courseContentsTable.title,
        contentType: courseContentsTable.contentType,
        sequenceOrder: courseContentsTable.sequenceOrder,
      });

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "Could not add course content.",
      });
    }

    await db
      .update(coursesTable)
      .set({
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, section.courseId), eq(coursesTable.createdBy, userId)));

    return res.status(201).json({
      success: true,
      message: "Course content added successfully.",
      data: content,
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Reorder course contents                                                   */
/* -------------------------------------------------------------------------- */

export const reorderCourseContents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { sectionId } = req.params;

    if (!sectionId || typeof sectionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID.",
      });
    }

    const bodyResult = ReorderIdsSchema.safeParse(req.body);

    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: bodyResult.error.flatten(),
      });
    }

    const { ids } = bodyResult.data;

    const [section] = await db
      .select({
        id: courseSectionsTable.id,
        courseId: courseSectionsTable.courseId,
        courseStatus: coursesTable.status,
      })
      .from(courseSectionsTable)
      .innerJoin(coursesTable, eq(courseSectionsTable.courseId, coursesTable.id))
      .where(and(eq(courseSectionsTable.id, sectionId), eq(coursesTable.createdBy, userId)))
      .limit(1);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Course section not found.",
      });
    }

    if (section.courseStatus === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be edited.",
      });
    }

    const contents = await db
      .select({
        id: courseContentsTable.id,
      })
      .from(courseContentsTable)
      .where(and(eq(courseContentsTable.sectionId, sectionId), inArray(courseContentsTable.id, ids)));

    const existingIds = new Set(contents.map((content) => content.id));

    if (existingIds.size !== ids.length || !ids.every((id) => existingIds.has(id))) {
      return res.status(400).json({
        success: false,
        message: "One or more content IDs are invalid.",
      });
    }

    await db.transaction(async (tx) => {
      for (let index = 0; index < ids.length; index++) {
        await tx
          .update(courseContentsTable)
          .set({
            sequenceOrder: index + 1,
            updatedAt: new Date(),
          })
          .where(and(eq(courseContentsTable.id, ids[index]), eq(courseContentsTable.sectionId, sectionId)));
      }

      await tx
        .update(coursesTable)
        .set({
          updatedAt: new Date(),
        })
        .where(and(eq(coursesTable.id, section.courseId), eq(coursesTable.createdBy, userId)));
    });

    return res.status(200).json({
      success: true,
      message: "Course content reordered successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* Add course video                                                           */
/* -------------------------------------------------------------------------- */

export const addCourseVideo = async (req: Request, res: Response, next: NextFunction) => {
  const paramResult = ParamSchema.safeParse(req.params);

  const bodyResult = CreateCourseVideoSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: {
        params: paramResult.success ? undefined : paramResult.error.flatten(),

        body: bodyResult.success ? undefined : bodyResult.error.flatten(),
      },
    });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const { courseId } = paramResult.data;

  const { sectionTitle, title, contentUrl } = bodyResult.data;

  try {
    const course = await getOwnedCourse(courseId, userId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.status === "archived") {
      return res.status(409).json({
        success: false,
        message: "Archived course cannot be edited.",
      });
    }

    let [section] = await db
      .select({
        id: courseSectionsTable.id,
      })
      .from(courseSectionsTable)
      .where(and(eq(courseSectionsTable.courseId, courseId), eq(courseSectionsTable.title, sectionTitle)))
      .limit(1);

    if (!section) {
      const [sequence] = await db
        .select({
          value: sql<number>`
            coalesce(
              max(
                ${courseSectionsTable.sequenceOrder}
              ),
              0
            )
          `,
        })
        .from(courseSectionsTable)
        .where(eq(courseSectionsTable.courseId, courseId));

      [section] = await db
        .insert(courseSectionsTable)
        .values({
          courseId,
          title: sectionTitle,
          sequenceOrder: Number(sequence?.value ?? 0) + 1,
        })
        .returning({
          id: courseSectionsTable.id,
        });
    }

    if (!section) {
      return res.status(500).json({
        success: false,
        message: "Could not create course section.",
      });
    }

    const [sequence] = await db
      .select({
        value: sql<number>`
          coalesce(
            max(
              ${courseContentsTable.sequenceOrder}
            ),
            0
          )
        `,
      })
      .from(courseContentsTable)
      .where(eq(courseContentsTable.sectionId, section.id));

    const [video] = await db
      .insert(courseContentsTable)
      .values({
        sectionId: section.id,
        title,
        contentType: "video",
        contentUrl,
        sequenceOrder: Number(sequence?.value ?? 0) + 1,
      })
      .returning({
        id: courseContentsTable.id,
        title: courseContentsTable.title,
        contentType: courseContentsTable.contentType,
      });

    if (!video) {
      return res.status(500).json({
        success: false,
        message: "Could not add video.",
      });
    }

    await db
      .update(coursesTable)
      .set({
        updatedAt: new Date(),
      })
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)));

    return res.status(201).json({
      success: true,
      message: "Video added successfully.",
      data: {
        videoId: video.id,
        title: video.title,
        contentType: video.contentType,
      },
    });
  } catch (error) {
    return next(error);
  }
};
