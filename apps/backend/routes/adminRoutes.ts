import { Router } from "express";
import { createVideoUploadUrl } from "../controllers/uploadController";
import { checkCourseCreator } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";

/** Admin upload endpoint registration. */
export const adminRoutes = Router();

adminRoutes.get("/", checkAuth, checkCourseCreator, createVideoUploadUrl);
