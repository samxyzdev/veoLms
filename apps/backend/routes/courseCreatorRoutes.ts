import { Router } from "express";

import { checkCourseCreator } from "../middleware/checkCourseCreator";
import { checkAuth } from "../middleware/checkAuth";

import { courseCreatorCourseRoutes } from "./courseCreatorCourseRoutes";
import { courseCreatorUploadRoutes } from "./adminRoutes";
import { courseCreatorDashboardRoutes } from "./courseCreatorDashboardRoutes";

export const courseCreatorRoutes = Router();

courseCreatorRoutes.use(checkAuth, checkCourseCreator);
courseCreatorRoutes.use("/dashboard", courseCreatorDashboardRoutes);
courseCreatorRoutes.use("/courses", courseCreatorCourseRoutes);
courseCreatorRoutes.use("/uploads", courseCreatorUploadRoutes);
