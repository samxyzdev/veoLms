import { Router } from "express";
import {
  createCourseReview,
  getCoursePlayer,
  getCourseProgress,
  getPurchasedCourses,
  listCourses,
  purchaseCourse,
  saveContentProgress,
} from "../controllers/courseController";
import {
  getDashboardStats,
  logStudyActivity,
  updateWeeklyGoal,
} from "../controllers/dashboardController";
import { checkAuth } from "../middleware/checkAuth";

/** Course endpoint registration. Controllers contain validation and use models. */
export const courseRoutes = Router();

courseRoutes.get("/", listCourses);
courseRoutes.get("/purchased-course", checkAuth, getPurchasedCourses);
courseRoutes.post("/purchase", checkAuth, purchaseCourse);
courseRoutes.post("/:courseId", checkAuth, createCourseReview);
courseRoutes.get("/:courseId/progress", checkAuth, getCourseProgress);
courseRoutes.get("/dashboard/stats", checkAuth, getDashboardStats);
courseRoutes.post("/dashboard/activity", checkAuth, logStudyActivity);
courseRoutes.put("/dashboard/goal", checkAuth, updateWeeklyGoal);
courseRoutes.get("/:courseId/player", checkAuth, getCoursePlayer);
courseRoutes.put("/content/:contentId/progress", checkAuth, saveContentProgress);
