import { Router } from "express";

import { getDashboardStats, logStudyActivity, updateWeeklyGoal } from "../controllers/studentDashboardController";
import { checkAuth } from "../middleware/checkAuth";
import { listCourses } from "../controllers/courseController";
import { createCourseReview, getCoursePlayer, getCourseProgress, getExploreCourse, getPurchasedCourses, purchaseCourse, saveContentProgress } from "../controllers/studentCourseController";

/** Course endpoint registration. Controllers contain validation and use models. */
export const studentCourseRoutes = Router();

// Collection
studentCourseRoutes.get("/", listCourses);
// Static routes
studentCourseRoutes.get("/purchased-courses", checkAuth, getPurchasedCourses);
studentCourseRoutes.post("/purchase", checkAuth, purchaseCourse);
studentCourseRoutes.put("/content/:contentId/progress", checkAuth, saveContentProgress);
// Course-specific nested routes
studentCourseRoutes.get("/:courseId/player", checkAuth, getCoursePlayer);
studentCourseRoutes.get("/:courseId/progress", checkAuth, getCourseProgress);
studentCourseRoutes.post("/:courseId/reviews", checkAuth, createCourseReview);
// Generic course route — keep last
studentCourseRoutes.get("/:courseId", checkAuth, getExploreCourse);
