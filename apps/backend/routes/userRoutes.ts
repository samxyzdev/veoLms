import { Router } from "express";
import {
  checkAuth,
  confirmPasswordReset,
  getCurrentUser,
  logOut,
  requestPasswordReset,
  signIn,
  signUp,
  updateProfile,
} from "../controllers/userController";

/** HTTP mapping only; request handling lives in the user controller. */
export const userRoutes = Router();

userRoutes.post("/signup", signUp);
userRoutes.post("/signin", signIn);
userRoutes.post("/logout", logOut);
userRoutes.post("/password-reset/request", requestPasswordReset);
userRoutes.post("/password-reset/confirm", confirmPasswordReset);
userRoutes.patch("/me", checkAuth, updateProfile);
userRoutes.get("/me", checkAuth, getCurrentUser);
