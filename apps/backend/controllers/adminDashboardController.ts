import {
  and,
  asc,
  categoriesTable,
  count,
  courseContentsTable,
  coursePurchaseTable,
  courseSectionsTable,
  coursesTable,
  db,
  desc,
  eq,
  sql,
  sum,
  usersTable,
} from "@repo/database";
import {
  CreateCourseSchema,
  CreateCourseVideoSchema,
  ParamSchema,
  UpdateCourseSchema,
  UpdateRoleSchema,
} from "@repo/zod";
import type { Request, Response } from "express";

/** Baseline categories are inserted only when missing; existing data is intact. */
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

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalCourses, totalPurchases, revenueRow] =
      await Promise.all([
        db.select({ value: count() }).from(usersTable),
        db.select({ value: count() }).from(coursesTable),
        db.select({ value: count() }).from(coursePurchaseTable),
        db
          .select({ value: sum(coursesTable.price) })
          .from(coursePurchaseTable)
          .innerJoin(
            coursesTable,
            eq(coursePurchaseTable.courseId, coursesTable.id),
          ),
      ]);

    return res.status(200).json({
      stats: {
        totalUsers: Number(totalUsers[0]?.value ?? 0),
        totalCourses: Number(totalCourses[0]?.value ?? 0),
        totalPurchases: Number(totalPurchases[0]?.value ?? 0),
        totalRevenue: Number(revenueRow[0]?.value ?? 0),
      },
    });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const listAdminUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    return res.status(200).json({ users });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "input details not correct" });
  }

  const { success, data, error } = UpdateRoleSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: error,
    });
  }

  try {
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await db
      .update(usersTable)
      .set({ role: data.role })
      .where(eq(usersTable.id, userId));

    return res.status(200).json({ message: "Role updated successfully" });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const listAdminCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        price: coursesTable.price,
        createdBy: coursesTable.createdBy,
        categoryId: coursesTable.categoryId,
        courseLanguage: coursesTable.courseLanguage,
        createdAt: coursesTable.createdAt,
        updatedAt: coursesTable.updatedAt,
      })
      .from(coursesTable)
      .orderBy(desc(coursesTable.createdAt));

    return res.status(200).json({ courses });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const existing = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable);
    const existingNames = new Set(existing.map((row) => row.name));
    const missing = DEFAULT_CATEGORIES.filter((name) => !existingNames.has(name));

    if (missing.length > 0) {
      await db.insert(categoriesTable).values(missing.map((name) => ({ name })));
    }

    const categories = await db
      .select({ id: categoriesTable.id, name: categoriesTable.name })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));

    return res.status(200).json({ categories });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please relogin" });
  }

  const { success, data, error } = CreateCourseSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "input details not correct",
      errors: error,
    });
  }

  const { title, description, price, courseLanguage, categoryId } = data;

  try {
    const [category] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId));

    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const [course] = await db
      .insert(coursesTable)
      .values({
        title,
        description: description || null,
        price,
        createdBy: userId,
        categoryId,
        courseLanguage,
      })
      .returning({ id: coursesTable.id });

    return res.status(201).json({
      message: "Course created successfully",
      courseId: course?.id,
    });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const paramResult = ParamSchema.safeParse(req.params);
  const bodyResult = UpdateCourseSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({ message: "Course details are not valid" });
  }

  const { courseId } = paramResult.data;
  const updates = bodyResult.data;

  try {
    if (updates.categoryId) {
      const [category] = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, updates.categoryId))
        .limit(1);

      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    const [course] = await db
      .update(coursesTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(coursesTable.id, courseId))
      .returning({ id: coursesTable.id });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course updated successfully" });
  } catch {
    return res.status(500).json({ message: "Could not update course" });
  }
};

export const addCourseVideo = async (req: Request, res: Response) => {
  const paramResult = ParamSchema.safeParse(req.params);
  const bodyResult = CreateCourseVideoSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({ message: "Video details are not valid" });
  }

  const { courseId } = paramResult.data;
  const { sectionTitle, title, contentUrl } = bodyResult.data;

  try {
    const [course] = await db
      .select({ id: coursesTable.id })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let [section] = await db
      .select({ id: courseSectionsTable.id })
      .from(courseSectionsTable)
      .where(
        and(
          eq(courseSectionsTable.courseId, courseId),
          eq(courseSectionsTable.title, sectionTitle),
        ),
      )
      .limit(1);

    if (!section) {
      const [sequence] = await db
        .select({
          value: sql<number>`coalesce(max(${courseSectionsTable.sequenceOrder}), 0)`,
        })
        .from(courseSectionsTable)
        .where(eq(courseSectionsTable.courseId, courseId));
      [section] = await db
        .insert(courseSectionsTable)
        .values({
          courseId,
          title: sectionTitle,
          sequenceOrder: (sequence?.value ?? 0) + 1,
        })
        .returning({ id: courseSectionsTable.id });
    }

    if (!section) {
      return res.status(500).json({ message: "Could not create course section" });
    }

    const [sequence] = await db
      .select({
        value: sql<number>`coalesce(max(${courseContentsTable.sequenceOrder}), 0)`,
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
        sequenceOrder: (sequence?.value ?? 0) + 1,
      })
      .returning({ id: courseContentsTable.id });

    return res.status(201).json({
      message: "Video added successfully",
      videoId: video?.id,
    });
  } catch {
    return res.status(500).json({ message: "Could not add video" });
  }
};
