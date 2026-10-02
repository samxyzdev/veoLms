import { Router } from "express";
import { confirmPasswordReset, getCurrentUser, logOut, requestPasswordReset, signIn, signUp, updateProfile } from "../controllers/userController";
import { checkAuth } from "../middleware/checkAuth";

export const userRoutes = Router();

userRoutes.post("/signup", signUp);
userRoutes.post("/signin", signIn);
userRoutes.post("/logout", logOut);
userRoutes.post("/password-reset/request", requestPasswordReset);
userRoutes.post("/password-reset/confirm", confirmPasswordReset);
// ye student or course-creator dono ke liye work karega
// kyunki in the end hum details hi send kar rahe hai.
// roles as an array send ho jayega
userRoutes.get("/me", checkAuth, getCurrentUser);
userRoutes.patch("/me", checkAuth, updateProfile);
