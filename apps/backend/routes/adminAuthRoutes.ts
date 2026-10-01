import { Router } from "express";
import {
  signInCourseCreator,
  signUpCourseCreator,
} from "../controllers/adminAuthController";

/** Admin authentication endpoint registration. */
export const adminAuthRoutes = Router();

adminAuthRoutes.post("/signup", signUpCourseCreator);
adminAuthRoutes.post("/signin", signInCourseCreator);
