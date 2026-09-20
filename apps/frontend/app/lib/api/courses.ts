/**
 * Course endpoints — everything under `/course` on the backend.
 */
import { apiClient } from "./client";

/** A course row from `GET /course` (public listing). */
export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  createdBy: string;
  categoryId: string;
  courseLanguage: string;
  createdAt: string;
  updatedAt: string;
}

/** A purchased course (purchase row joined with course details). */
export interface PurchasedCourse {
  purchaseId: string;
  purchasedAt: string;
  courseId: string;
  title: string;
  description: string | null;
  price: number;
  courseLanguage: string;
}

/** All courses available on the platform (first 10 from the backend). */
export async function getCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<{ courses: Course[] }>("/course");
  return data.courses;
}

/** Courses the logged-in user has purchased. Requires a valid session. */
export async function getPurchasedCourses(): Promise<PurchasedCourse[]> {
  const { data } = await apiClient.get<{ purchasedCourses: PurchasedCourse[] }>(
    "/course/purchased-course",
  );
  return data.purchasedCourses;
}

/** Purchase a course for the logged-in user (mock checkout for now). */
export async function purchaseCourse(courseId: string): Promise<void> {
  await apiClient.post("/course/purchase", { courseId });
}

/* ------------------------------------------------------------------ */
/* Course player                                                       */
/* ------------------------------------------------------------------ */

/** One lecture (video/document) with this user's progress on it. */
export interface PlayerLecture {
  id: string;
  title: string;
  contentType: string;
  contentUrl: string;
  sequenceOrder: number;
  isCompleted: boolean;
  watchedSeconds: number;
  completedAt: string | null;
}

/** A section of the course — lectures are always ordered inside a section. */
export interface PlayerSection {
  id: string;
  title: string;
  sequenceOrder: number;
  totalCount: number;
  completedCount: number;
  contents: PlayerLecture[];
}

/** Everything the player page needs (`GET /course/:courseId/player`). */
export interface PlayerCourse {
  id: string;
  title: string;
  description: string | null;
  courseLanguage: string;
  categoryName: string | null;
  totalCount: number;
  completedCount: number;
  progressPercentage: number;
  lastContentId: string | null;
  lastAccessedAt: string | null;
  sections: PlayerSection[];
}

/** Rolls up a course progress update returned by the backend. */
export interface SavedProgress {
  totalCount: number;
  completedCount: number;
  progressPercentage: number;
  lastContentId: string;
}

/**
 * Course + sections + lectures + this user's progress, in one request.
 * Throws a 403 error when the user hasn't purchased the course.
 */
export async function getCoursePlayer(courseId: string): Promise<PlayerCourse> {
  const { data } = await apiClient.get<{ course: PlayerCourse }>(
    `/course/${courseId}/player`,
  );
  return data.course;
}

/**
 * Save the watch position for a lecture. Pass `isCompleted` to also flip the
 * completed flag (used by the "mark as complete" toggle and on video end).
 */
export async function saveContentProgress(
  contentId: string,
  input: { watchedSeconds: number; isCompleted?: boolean },
): Promise<SavedProgress> {
  const { data } = await apiClient.put<{ progress: SavedProgress }>(
    `/course/content/${contentId}/progress`,
    input,
  );
  return data.progress;
}

/** Sections → one flat lecture list, in the order the player plays them. */
export function flattenLectures(sections: PlayerSection[]): PlayerLecture[] {
  return sections.flatMap((section) => section.contents);
}