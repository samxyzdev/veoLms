import { Router } from "express";
import { activateCourseCreator, confirmPasswordReset, getCurrentUser, logOut, requestPasswordReset, signIn, signUp, updateProfile } from "../controllers/userController";
import { checkAuth } from "../middleware/checkAuth";
import { studentDashboardRoutes } from "./studentDashboardRoutes";
import { studentCourseRoutes } from "./studentCourseRoutes";
import { addCourseToCart, clearCourseCart, getCourseCart, removeCourseFromCart } from "../controllers/studentCourseController";

/** HTTP mapping only; request handling lives in the user controller. */
export const studentRoutes = Router();

studentRoutes.use(checkAuth);
studentRoutes.get("/cart", getCourseCart);
studentRoutes.post("/addtocard", addCourseToCart);
studentRoutes.delete("/cart/:courseId", removeCourseFromCart);
studentRoutes.delete("/cart", clearCourseCart);
studentRoutes.patch("/course-creator/activate", activateCourseCreator);
studentRoutes.use("/dashboard", studentDashboardRoutes);
studentRoutes.use("/courses", studentCourseRoutes);
