import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";

import { getDashboardCourseProgress, getDashboardStats, logStudyActivity, updateWeeklyGoal } from "../controllers/studentDashboardController";

/** HTTP mapping only; OTP workflow lives in the OTP controller. */
export const studentDashboardRoutes = Router();

studentDashboardRoutes.get("/stats", checkAuth, getDashboardStats);
studentDashboardRoutes.get("/course-progress", checkAuth, getDashboardCourseProgress);
studentDashboardRoutes.post("/activity", checkAuth, logStudyActivity);
studentDashboardRoutes.put("/goal", checkAuth, updateWeeklyGoal);
