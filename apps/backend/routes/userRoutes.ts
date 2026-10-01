import { Router } from "express";
import {
  activateCourseCreator,
  confirmPasswordReset,
  getCurrentUser,
  logOut,
  requestPasswordReset,
  signIn,
  signUp,
  updateProfile,
} from "../controllers/userController";
import { checkAuth } from "../middleware/checkAuth";

/** HTTP mapping only; request handling lives in the user controller. */
export const studentRoutes = Router();

studentRoutes.post("/signup", signUp);
studentRoutes.post("/signin", signIn);
studentRoutes.post("/logout", logOut);
studentRoutes.post("/password-reset/request", requestPasswordReset);
studentRoutes.post("/password-reset/confirm", confirmPasswordReset);
studentRoutes.patch("/me", checkAuth, updateProfile);
studentRoutes.get("/me", checkAuth, getCurrentUser);
studentRoutes.patch(
  "/course-creator/activate",
  checkAuth,
  activateCourseCreator,
);
