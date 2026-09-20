import { Router } from "express";
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
import { checkAdmin } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";

/** All admin dashboard endpoints share the same auth and role checks. */
export const adminDashboardRoutes = Router();

adminDashboardRoutes.use(checkAuth, checkAdmin);
adminDashboardRoutes.get("/stats", getAdminStats);
adminDashboardRoutes.get("/users", listAdminUsers);
adminDashboardRoutes.patch("/users/:userId/role", updateUserRole);
adminDashboardRoutes.get("/courses", listAdminCourses);
adminDashboardRoutes.get("/categories", listCategories);
adminDashboardRoutes.post("/courses", createCourse);
adminDashboardRoutes.patch("/courses/:courseId", updateCourse);
adminDashboardRoutes.post("/courses/:courseId/videos", addCourseVideo);
