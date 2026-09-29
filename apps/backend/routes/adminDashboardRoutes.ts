import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  addCourseVideo,
  createCourse,
  getAdminStats,
  listAdminCourses,
  listAdminUsers,
  listCategories,
  updateCourse,
  updateUserRole,
} from "../controllers/adminDashboardController";
import { checkCourseCreator } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";
import { db, eq, usersTable } from "@repo/database";

/** All admin dashboard endpoints share the same auth and role checks. */
export const adminDashboardRoutes = Router();

adminDashboardRoutes.use(checkAuth, checkCourseCreator);
adminDashboardRoutes.get(
  "/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      // checkAuth already guarantees this
      if (!userId) {
        return res.status(401).json({
          message: "Please login",
        });
      }

      const [admin] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      if (!admin) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        user: admin,
      });
    } catch (error) {
      next(error);
    }
  },
);
adminDashboardRoutes.get("/stats", getAdminStats);
adminDashboardRoutes.get("/users", listAdminUsers);
adminDashboardRoutes.patch("/users/:userId/role", updateUserRole);
adminDashboardRoutes.get("/courses", listAdminCourses);
adminDashboardRoutes.get("/categories", listCategories);
adminDashboardRoutes.post("/courses", createCourse);
adminDashboardRoutes.patch("/courses/:courseId", updateCourse);
adminDashboardRoutes.post("/courses/:courseId/videos", addCourseVideo);
