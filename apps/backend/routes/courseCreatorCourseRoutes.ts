import { Router } from "express";

import {
  addCourseVideo,
  createCourse,
  getCourse,
  listCategories,
  listCreatorCourses,
  updateCourse,
  // Course lifecycle
  publishCourse,
  makeCoursePrivate,
  archiveCourse,
  restoreCourse,
  // Course sections
  createCourseSection,
  reorderCourseSections,
  // Course contents
  addCourseContent,
  reorderCourseContents,
  updateCourseContent,
  updateCourseSection,
  deleteCourseSection,
  deleteCourseContent,
} from "../controllers/courseCreatorCourseController";
import { createCourseThumbnailUploadUrl } from "../controllers/courseCreatorUploadController";

export const courseCreatorCourseRoutes = Router();

// COURSE LIST + CATEGORIES
courseCreatorCourseRoutes.get("/", listCreatorCourses);
courseCreatorCourseRoutes.post("/", createCourse);
courseCreatorCourseRoutes.get("/categories", listCategories);
// COURSE LIFECYCLE
courseCreatorCourseRoutes.patch("/:courseId/publish", publishCourse);
courseCreatorCourseRoutes.patch("/:courseId/private", makeCoursePrivate);
courseCreatorCourseRoutes.patch("/:courseId/archive", archiveCourse);
courseCreatorCourseRoutes.patch("/:courseId/restore", restoreCourse);
// COURSE SECTIONS
courseCreatorCourseRoutes.post("/:courseId/sections", createCourseSection);
courseCreatorCourseRoutes.patch("/:courseId/sections/reorder", reorderCourseSections);
courseCreatorCourseRoutes.patch("/sections/:sectionId", updateCourseSection);
courseCreatorCourseRoutes.delete("/sections/:sectionId", deleteCourseSection);
// COURSE CONTENT
courseCreatorCourseRoutes.post("/sections/:sectionId/contents", addCourseContent);
courseCreatorCourseRoutes.patch("/sections/:sectionId/contents/reorder", reorderCourseContents);
courseCreatorCourseRoutes.patch("/sections/:sectionId/contents/:contentId", updateCourseContent);
courseCreatorCourseRoutes.delete("/sections/:sectionId/contents/:contentId", deleteCourseContent);
//  VIDEO
courseCreatorCourseRoutes.post("/:courseId/videos", addCourseVideo);
// THUMBNAIL
courseCreatorCourseRoutes.post("/:courseId/thumbnail/presign", createCourseThumbnailUploadUrl);
// COURSE
courseCreatorCourseRoutes.get("/:courseId", getCourse);
courseCreatorCourseRoutes.patch("/:courseId", updateCourse);
