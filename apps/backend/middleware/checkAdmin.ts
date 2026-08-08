import { db, eq, ne, usersTable } from "@repo/database";
import type { NextFunction, Request, Response } from "express";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};
