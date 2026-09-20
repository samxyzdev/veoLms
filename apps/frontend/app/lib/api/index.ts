/**
 * API layer — import everything from here:
 *
 *   import { signUp, type SignUpInput } from "~/lib/api";
 */
export { apiClient } from "./client";
export {
  adminSignIn,
  adminSignUp,
  generateOtp,
  getMe,
  logOut,
  signIn,
  signUp,
  updateProfile,
} from "./auth";
export type { MeResponse, SignUpInput, UpdateProfileInput, UserRole } from "./auth";
export {
  flattenLectures,
  getCoursePlayer,
  getCourses,
  getPurchasedCourses,
  purchaseCourse,
  saveContentProgress,
} from "./courses";
export type {
  Course,
  PlayerCourse,
  PlayerLecture,
  PlayerSection,
  PurchasedCourse,
  SavedProgress,
} from "./courses";
export {
  emptyDashboardStats,
  getDashboardStats,
  logStudyActivity,
  setWeeklyGoal,
} from "./dashboard";
export type {
  DashboardCourse,
  DashboardCourses,
  DashboardStats,
  DashboardStreak,
  DashboardStudy,
  DashboardWeeklyGoal,
} from "./dashboard";
export {
  createCourse,
  getAdminCategories,
  getAdminCourses,
  getAdminStats,
  getAdminUsers,
  updateUserRole,
} from "./admin";
export type {
  AdminCategory,
  AdminStats,
  AdminUser,
  CreateCourseInput,
} from "./admin";
