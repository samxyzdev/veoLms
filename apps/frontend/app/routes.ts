import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // =========================================
  // PUBLIC ROUTES
  // =========================================
  index("routes/landing/route.tsx"),
  // User authentication
  route("signin", "./routes/auth/Signin/route.tsx"),
  route("signup", "./routes/auth/signup/route.tsx"),
  // Course Creator authentication
  route(
    "course-creator/signin",
    "./routes/auth/course-creator-auth/signin/route.tsx",
  ),
  route(
    "course-creator/signup",
    "./routes/auth/course-creator-auth/signup/route.tsx",
  ),
  // =========================================
  // STUDENT DASHBOARD
  // =========================================
  route("dashboard", "./routes/student/route.tsx", [
    index("./routes/student/home/route.tsx"),
    route("my-learning", "./routes/student/my-learning/route.tsx"),
    route(
      "my-learning/:courseId",
      "./routes/student/my-learning/$courseId/route.tsx",
    ),
    route("explore-courses", "./routes/student/explore-courses/route.tsx"),
    route("wishlist", "./routes/student/wishlist/route.tsx"),
    route("certificates", "./routes/student/certificates/route.tsx"),
    route("achievements", "./routes/student/achievements/route.tsx"),
    route("notifications", "./routes/student/notifications/route.tsx"),
    route("settings", "./routes/student/settings/route.tsx"),
  ]),

  // =========================================
  // COURSE CREATOR DASHBOARD
  // =========================================
  route("course-creator", "./routes/course-creator/route.tsx", [
    index("./routes/course-creator/home/route.tsx"),
    route("courses", "./routes/course-creator/courses/route.tsx"),
    route("courses/new", "./routes/course-creator/courses/new/route.tsx"),
    route(
      "courses/:courseId/edit",
      "./routes/course-creator/courses/$courseId/edit/route.tsx",
    ),
    route("students", "./routes/course-creator/students/route.tsx"),
    route("instructors", "./routes/course-creator/instructors/route.tsx"),
    route("enrollments", "./routes/course-creator/enrollments/route.tsx"),
    route("analytics", "./routes/course-creator/analytics/route.tsx"),
    route("settings", "./routes/course-creator/settings/route.tsx"),
  ]),
] satisfies RouteConfig;
