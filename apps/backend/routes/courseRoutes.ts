import { Router } from "express";
import { createCourseReview, getCoursePlayer, getCourseProgress, getPurchasedCourses, listCourses, purchaseCourse, saveContentProgress } from "../controllers/courseController";
import { getDashboardStats, logStudyActivity, updateWeeklyGoal } from "../controllers/dashboardController";
import { checkAuth } from "../middleware/checkAuth";

/** Course endpoint registration. Controllers contain validation and use models. */
export const studentCourseRoutes = Router();

studentCourseRoutes.get("/", listCourses);
studentCourseRoutes.get("/purchased-courses", checkAuth, getPurchasedCourses);
studentCourseRoutes.post("/purchase", checkAuth, purchaseCourse);
studentCourseRoutes.post("/:courseId/reviews", checkAuth, createCourseReview);
studentCourseRoutes.get("/:courseId/progress", checkAuth, getCourseProgress);
studentCourseRoutes.get("/:courseId/player", checkAuth, getCoursePlayer);
studentCourseRoutes.put("/content/:contentId/progress", checkAuth, saveContentProgress);
