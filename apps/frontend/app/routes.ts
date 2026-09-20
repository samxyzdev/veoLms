import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/my-courses", "routes/my-courses.tsx"),
  // Video player for a purchased course: dashboard/my-courses/:courseId
  route("dashboard/my-courses/:courseId", "routes/course-player.tsx"),
  route("dashboard/explore", "routes/explore.tsx"),
  route("dashboard/settings", "routes/settings.tsx"),
  route("admin", "routes/admin.tsx"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin/signup", "routes/admin-signup.tsx"),
  route("admin/users", "routes/admin-users.tsx"),
  route("admin/courses", "routes/admin-courses.tsx"),
] satisfies RouteConfig;