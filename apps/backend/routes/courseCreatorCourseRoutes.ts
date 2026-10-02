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
} from "../controllers/courseCreatorCourseController";

export const courseCreatorCourseRoutes = Router();

/* -------------------------------------------------------------------------- */
/* COURSES                                                                    */
/* -------------------------------------------------------------------------- */

// GET /api/v1/course-creator/courses
courseCreatorCourseRoutes.get("/", listCreatorCourses);

// POST /api/v1/course-creator/courses
// Create a new course draft
courseCreatorCourseRoutes.post("/", createCourse);

// GET /api/v1/course-creator/courses/:courseId
// Get one course for editing
courseCreatorCourseRoutes.get("/:courseId", getCourse);

// PATCH /api/v1/course-creator/courses/:courseId
// Used for:
// - autosave
// - Save Draft
// - editing course information
courseCreatorCourseRoutes.patch("/:courseId", updateCourse);

/* -------------------------------------------------------------------------- */
/* COURSE LIFECYCLE                                                           */
/* -------------------------------------------------------------------------- */

// PATCH /api/v1/course-creator/courses/:courseId/publish
courseCreatorCourseRoutes.patch("/:courseId/publish", publishCourse);

// PATCH /api/v1/course-creator/courses/:courseId/private
courseCreatorCourseRoutes.patch("/:courseId/private", makeCoursePrivate);

// PATCH /api/v1/course-creator/courses/:courseId/archive
courseCreatorCourseRoutes.patch("/:courseId/archive", archiveCourse);

// PATCH /api/v1/course-creator/courses/:courseId/restore
courseCreatorCourseRoutes.patch("/:courseId/restore", restoreCourse);

/* -------------------------------------------------------------------------- */
/* COURSE SECTIONS                                                            */
/* -------------------------------------------------------------------------- */

// POST /api/v1/course-creator/courses/:courseId/sections
courseCreatorCourseRoutes.post("/:courseId/sections", createCourseSection);

// PATCH /api/v1/course-creator/courses/:courseId/sections/reorder
courseCreatorCourseRoutes.patch("/:courseId/sections/reorder", reorderCourseSections);

/* -------------------------------------------------------------------------- */
/* COURSE CONTENT                                                             */
/* -------------------------------------------------------------------------- */

// POST /api/v1/course-creator/sections/:sectionId/contents
courseCreatorCourseRoutes.post("/sections/:sectionId/contents", addCourseContent);

// PATCH /api/v1/course-creator/sections/:sectionId/contents/reorder
courseCreatorCourseRoutes.patch("/sections/:sectionId/contents/reorder", reorderCourseContents);

/* -------------------------------------------------------------------------- */
/* VIDEO                                                                      */
/* -------------------------------------------------------------------------- */

// POST /api/v1/course-creator/courses/:courseId/videos
courseCreatorCourseRoutes.post("/:courseId/videos", addCourseVideo);

/* -------------------------------------------------------------------------- */
/* CATEGORIES                                                                 */
/* -------------------------------------------------------------------------- */

// GET /api/v1/course-creator/categories
courseCreatorCourseRoutes.get("/categories", listCategories);
