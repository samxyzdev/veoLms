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
        message: "Please relogin",
      });
    }

    const [user] = await db
      .select({
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
