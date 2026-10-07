import { Router } from "express";

import { getDashboardStats, logStudyActivity, updateWeeklyGoal } from "../controllers/studentDashboardController";
import { checkAuth } from "../middleware/checkAuth";
import { listCourses } from "../controllers/courseController";
import { createCourseReview, getCoursePlayer, getCourseProgress, getExploreCourse, getPurchasedCourses, purchaseCourse, saveContentProgress } from "../controllers/studentCourseController";

/** Course endpoint registration. Controllers contain validation and use models. */
export const studentCourseRoutes = Router();

studentCourseRoutes.get("/", listCourses);
studentCourseRoutes.get("/:courseId", checkAuth, getExploreCourse);
studentCourseRoutes.get("/purchased-courses", checkAuth, getPurchasedCourses);
studentCourseRoutes.post("/purchase", checkAuth, purchaseCourse);
studentCourseRoutes.post("/:courseId/reviews", checkAuth, createCourseReview);
studentCourseRoutes.get("/:courseId/progress", checkAuth, getCourseProgress);
studentCourseRoutes.get("/:courseId/player", checkAuth, getCoursePlayer);
studentCourseRoutes.put("/content/:contentId/progress", checkAuth, saveContentProgress);
