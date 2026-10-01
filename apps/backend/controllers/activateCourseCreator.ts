import { db, eq, usersTable } from "@repo/database";
import type { NextFunction, Request, Response } from "express";

export const activateCourseCreator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * IMPORTANT:
     * Replace req.user.id with whatever your
     * auth middleware uses to expose the logged-in
     * user's ID.
     */
    const userId = req.userId;

    if (!)

    const [user] = await db
      .select({
        id: usersTable.id,
        roles: usersTable.roles,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /**
     * Already a course creator.
     */
    if (user.roles.includes("course_creator")) {
      return res.status(200).json({
        message: "You are already a course creator.",
      });
    }

    /**
     * Preserve existing roles and add course_creator.
     */
    const updatedRoles = [...new Set([...user.roles, "course_creator"])];

    await db
      .update(usersTable)
      .set({
        roles: updatedRoles,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    return res.status(200).json({
      message: "You are now a course creator.",
    });
  } catch (error) {
    return next(error);
  }
};
