import { Router } from "express";
import { listCategories } from "../controllers/courseCreatorCourseController";
import { getCourseCreatorStats } from "../controllers/courseCreatorDashboardController";

export const courseCreatorDashboardRoutes = Router();

courseCreatorDashboardRoutes.get("/stats", getCourseCreatorStats);
courseCreatorDashboardRoutes.get("/categories", listCategories);
