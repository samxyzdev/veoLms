import {
  asc,
  categoriesTable,
  count,
  coursePurchaseTable,
  coursesTable,
  db,
  desc,
  eq,
  sum,
  usersTable,
} from "@repo/database";
import type { Request, Response } from "express";
import { Router } from "express";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";
import { CreateCourseSchema, UpdateRoleSchema } from "@repo/zod";

export const adminDashboardRoutes: Router = Router();

/**
 * Category options the create-course form picks from. Every default that is
 * missing from the table gets inserted, so adding a new entry here also shows
 * up on databases that were seeded before it existed. Existing rows are never
 * renamed or removed because courses already reference them.
 */
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

// Everything here is admin-only: requires a valid session AND role === "admin".

adminDashboardRoutes.get(
  "/stats",
  checkAuth,
  checkAdmin,
  async (_req: Request, res: Response) => {
    try {
      const [totalUsers] = await db
        .select({ value: count() })
        .from(usersTable);
      const [totalCourses] = await db
        .select({ value: count() })
        .from(coursesTable);
      const [totalPurchases] = await db
        .select({ value: count() })
        .from(coursePurchaseTable);
      const [revenueRow] = await db
        .select({ value: sum(coursesTable.price) })
        .from(coursePurchaseTable)
        .innerJoin(
          coursesTable,
          eq(coursePurchaseTable.courseId, coursesTable.id),
        );

      return res.status(200).json({
        stats: {
          totalUsers: Number(totalUsers?.value ?? 0),
          totalCourses: Number(totalCourses?.value ?? 0),
          totalPurchases: Number(totalPurchases?.value ?? 0),
          totalRevenue: Number(revenueRow?.value ?? 0),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

adminDashboardRoutes.get(
  "/users",
  checkAuth,
  checkAdmin,
  async (_req: Request, res: Response) => {
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
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

adminDashboardRoutes.patch(
  "/users/:userId/role",
  checkAuth,
  checkAdmin,
  async (req: Request, res: Response) => {
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

      return res.status(200).json({
        message: "Role updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

adminDashboardRoutes.get(
  "/courses",
  checkAuth,
  checkAdmin,
  async (_req: Request, res: Response) => {
    try {
      const courses = await db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          description: coursesTable.description,
          price: coursesTable.price,
          courseLanguage: coursesTable.courseLanguage,
          createdAt: coursesTable.createdAt,
        })
        .from(coursesTable)
        .orderBy(desc(coursesTable.createdAt));

      return res.status(200).json({ courses });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

// Categories for the create-course form. Seeds any missing default so the form
// always has options, then returns the full list.
adminDashboardRoutes.get(
  "/categories",
  checkAuth,
  checkAdmin,
  async (_req: Request, res: Response) => {
    try {
      const existing = await db
        .select({ name: categoriesTable.name })
        .from(categoriesTable);
      const existingNames = new Set(existing.map((row) => row.name));
      const missing = DEFAULT_CATEGORIES.filter(
        (name) => !existingNames.has(name),
      );

      if (missing.length > 0) {
        await db
          .insert(categoriesTable)
          .values(missing.map((name) => ({ name })));
      }

      const categories = await db
        .select({ id: categoriesTable.id, name: categoriesTable.name })
        .from(categoriesTable)
        .orderBy(asc(categoriesTable.name));

      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);

// Create a course. Requires a valid session + admin role.
adminDashboardRoutes.post(
  "/courses",
  checkAuth,
  checkAdmin,
  async (req: Request, res: Response) => {
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

      await db.insert(coursesTable).values({
        title,
        description: description || null,
        price,
        createdBy: userId,
        categoryId,
        courseLanguage,
      });

      return res.status(201).json({
        message: "Course created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  },
);