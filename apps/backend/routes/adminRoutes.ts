import { Router } from "express";
import { createVideoUploadUrl } from "../controllers/uploadController";
import { checkCourseCreator } from "../middleware/checkCourseCreator";
import { checkAuth } from "../middleware/checkAuth";

/** Admin upload endpoint registration. */
export const courseCreatorUploadRoutes = Router();

courseCreatorUploadRoutes.get("/", checkAuth, checkCourseCreator, createVideoUploadUrl);
