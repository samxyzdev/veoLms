import { db, eq, usersTable } from "@repo/database";
import type { NextFunction, Request, Response } from "express";

export const checkCourseCreator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const [user] = await db
      .select({
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

    if (!user.roles.includes("course_creator")) {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
