import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import {
  getDashboardCourseProgress,
  getDashboardStats,
} from "../controllers/dashboardStatsController";

/** HTTP mapping only; OTP workflow lives in the OTP controller. */
export const dashboardRoutes = Router();

dashboardRoutes.get("/stats", checkAuth, getDashboardStats);
dashboardRoutes.get("/course-progress", checkAuth, getDashboardCourseProgress);
