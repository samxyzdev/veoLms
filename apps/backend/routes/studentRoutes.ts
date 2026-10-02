import { Router } from "express";
import { activateCourseCreator, confirmPasswordReset, getCurrentUser, logOut, requestPasswordReset, signIn, signUp, updateProfile } from "../controllers/userController";
import { checkAuth } from "../middleware/checkAuth";
import { studentDashboardRoutes } from "./dashboardStatsRoutes";
import { studentCourseRoutes } from "./courseRoutes";

/** HTTP mapping only; request handling lives in the user controller. */
export const studentRoutes = Router();

studentRoutes.patch("/course-creator/activate", checkAuth, activateCourseCreator);
studentRoutes.use("/dashboard", studentDashboardRoutes);
studentRoutes.use("/courses", studentCourseRoutes);
