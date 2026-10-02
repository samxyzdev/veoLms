import { coursesTable, db } from "@repo/database";
import type { NextFunction, Request, Response } from "express";

export const listCourses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await db.select().from(coursesTable).limit(10);

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return next(error);
  }
};
