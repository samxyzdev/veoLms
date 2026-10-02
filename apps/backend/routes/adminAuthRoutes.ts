import { Router } from "express";
import {
  signInCourseCreator,
  signUpCourseCreator,
} from "../controllers/adminAuthController";

/** Admin authentication endpoint registration. */
export const courseCreatorAuthRoutes = Router();

courseCreatorAuthRoutes.post("/signup", signUpCourseCreator);
courseCreatorAuthRoutes.post("/signin", signInCourseCreator);
