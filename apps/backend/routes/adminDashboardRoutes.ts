import { Router, type NextFunction, type Request, type Response } from "express";
import { addCourseVideo, createCourse, getCourseCreatorStats, listCategories, listCourseCreatorUsers, listCreatorCourses, updateCourse, updateUserRole } from "../controllers/adminDashboardController";
import { checkCourseCreator } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";
import { db, eq, usersTable } from "@repo/database";
import { courseCreatorUploadRoutes } from "./adminRoutes";

/** All admin dashboard endpoints share the same auth and role checks. */
export const courseCreatorRoutes = Router();

courseCreatorRoutes.get("/stats", checkAuth, checkCourseCreator, getCourseCreatorStats);
// courseCreatorRoutes.get("/users", "");
courseCreatorRoutes.patch("/users/:userId/role", checkAuth, checkCourseCreator, updateUserRole);
courseCreatorRoutes.get("/courses", checkAuth, checkCourseCreator, listCreatorCourses);
courseCreatorRoutes.get("/categories", checkAuth, checkCourseCreator, listCategories);
courseCreatorRoutes.post("/courses", checkAuth, checkCourseCreator, createCourse);
courseCreatorRoutes.patch("/courses/:courseId", checkAuth, checkCourseCreator, updateCourse);
courseCreatorRoutes.post("/courses/:courseId/videos", checkAuth, checkCourseCreator, addCourseVideo);
courseCreatorRoutes.post("/uploads", courseCreatorUploadRoutes);
// courseCreatorRoutes.patch("/courses/:courseId/publish", checkAuth, checkCourseCreator, publishCourse);
// courseCreatorRoutes.patch("/courses/:courseId/private", checkAuth, checkCourseCreator, makeCoursePrivate);
// courseCreatorRoutes.patch("/courses/:courseId/archive", checkAuth, checkCourseCreator, archiveCourse);
// courseCreatorRoutes.patch("/courses/:courseId/restore", checkAuth, checkCourseCreator, restoreCourse);
// courseCreatorRoutes.post("/courses/:courseId/sections", checkAuth, checkCourseCreator, createCourseSection);
// courseCreatorRoutes.patch("/courses/:courseId/sections/reorder", checkAuth, checkCourseCreator, reorderCourseSections);
// courseCreatorRoutes.post("/sections/:sectionId/contents", checkAuth, checkCourseCreator, addCourseContent);
// courseCreatorRoutes.patch("/sections/:sectionId/contents/reorder", checkAuth, checkCourseCreator, reorderCourseContents);
