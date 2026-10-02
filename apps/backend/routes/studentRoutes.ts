import { Router } from "express";
import { activateCourseCreator, confirmPasswordReset, getCurrentUser, logOut, requestPasswordReset, signIn, signUp, updateProfile } from "../controllers/userController";
import { checkAuth } from "../middleware/checkAuth";
import { studentDashboardRoutes } from "./studentDashboardRoutes";
import { studentCourseRoutes } from "./studentCourseRoutes";

/** HTTP mapping only; request handling lives in the user controller. */
export const studentRoutes = Router();

studentRoutes.use(checkAuth);
studentRoutes.patch("/course-creator/activate", activateCourseCreator);
studentRoutes.use("/dashboard", studentDashboardRoutes);
studentRoutes.use("/courses", studentCourseRoutes);
