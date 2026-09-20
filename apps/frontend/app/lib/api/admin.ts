/**
 * Admin endpoints — everything under `/admin` on the backend.
 * Every call here requires the logged-in user to have role "admin".
 */
import { apiClient } from "./client";
import type { UserRole } from "./auth";
import type { Course } from "./courses";

/** Platform-wide numbers shown on the admin overview. */
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalPurchases: number;
  totalRevenue: number;
}

/** A user row as seen by admins (password never included). */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/** Overview numbers for the admin dashboard. */
export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<{ stats: AdminStats }>("/admin/stats");
  return data.stats;
}

/** Every user on the platform, newest first. */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<{ users: AdminUser[] }>("/admin/users");
  return data.users;
}

/** Change a user's role (user / course_creator / admin). */
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  await apiClient.patch(`/admin/users/${userId}/role`, { role });
}

/** Every course on the platform, newest first. */
export async function getAdminCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<{ courses: Course[] }>("/admin/courses");
  return data.courses;
}

/** A category the create-course form can pick from. */
export interface AdminCategory {
  id: string;
  name: string;
}

/** Categories for courses (seeds a few defaults on first use). */
export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { data } = await apiClient.get<{ categories: AdminCategory[] }>(
    "/admin/categories",
  );
  return data.categories;
}

/** Fields needed to create a course as an admin. */
export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  courseLanguage: string;
  categoryId: string;
}

export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface CourseVideoInput {
  sectionTitle: string;
  title: string;
  contentUrl: string;
}

/** Create a course. The backend requires the logged-in user to be an admin. */
export async function createCourse(input: CreateCourseInput): Promise<string> {
  const { data } = await apiClient.post<{ courseId: string }>("/admin/courses", input);
  return data.courseId;
}

/** Update a course's title, description, price, language, or category. */
export async function updateCourse(
  courseId: string,
  input: UpdateCourseInput,
): Promise<void> {
  await apiClient.patch(`/admin/courses/${courseId}`, input);
}

/** Request a short-lived direct-upload URL for one course video. */
export async function requestVideoUpload(file: File): Promise<{
  uploadUrl: string;
  publicUrl: string;
}> {
  const { data } = await apiClient.get<{
    uploadUrl: string;
    publicUrl: string;
  }>("/admin/uploads", {
    params: { fileName: file.name, fileType: file.type },
  });
  return data;
}

/** Attach an uploaded video to a course as a lecture. */
export async function addCourseVideo(
  courseId: string,
  input: CourseVideoInput,
): Promise<void> {
  await apiClient.post(`/admin/courses/${courseId}/videos`, input);
}
