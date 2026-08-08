import {
  coursePurchaseTable,
  coursesTable,
  db,
  eq,
  reviewsTable,
} from "@repo/database";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { checkAuth } from "../middleware/checkAuth";
import { CommentAndReviewsSchema, ParamSchema } from "@repo/zod";

export const courseRoutes: Router = Router();

// send first 10 course to frontend
// actual video nahi jayega isme
courseRoutes.get("/", async (req, res, next) => {
  try {
    const courses = await db.select().from(coursesTable).limit(10);
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    // next(error);
    return res.status(500).json({
      message: "somethign went wrong",
    });
  }
});

// get purchased course like history
courseRoutes.get(
  "/purchased-course",
  checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please relogin",
      });
    }

    try {
      const purchasedCourse = await db
        .select()
        .from(coursePurchaseTable)
        .where(eq(coursePurchaseTable.userId, userId));

      return res.status(200).json({
        purchasedCourse,
      });
    } catch (error) {
      return res.status(500).json({
        message: "someting went wrong",
      });
    }
  },
);

// get specific video with progress
// and check is user have access to this course
courseRoutes.get(
  "/{:courseId}",
  checkAuth,
  async (req: Request, res: Response) => {},
);

// comment and reviews on specific videos
// if user have access to this course
courseRoutes.post(
  "/:courseId",
  checkAuth,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Please relogin",
      });
    }
    const paramResult = ParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      return res.status(400).json({
        message: "input details not correct",
        errors: paramResult.error,
      });
    }

    const { courseId } = paramResult.data;

    const { success, data, error } = CommentAndReviewsSchema.safeParse(
      req.body,
    );

    if (!success) {
      return res.status(400).json({
        message: "input details not correct",
        errors: error,
      });
    }
    const { comment, rating } = data;
    // pure course pe hai particular vide pe nahi hai
    try {
      await db
        .insert(reviewsTable)
        .values({ courseId, rating, userId, comment });
      return res.status(200).json({
        message: "success",
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
      });
    }
  },
);

// get all the course to preview

// get purchase course

// purchase course

//
