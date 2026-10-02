import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // =========================================================
  // PUBLIC ROUTES
  // =========================================================

  index("./routes/landing/route.tsx"),

  // ---------------------------------------------------------
  // STUDENT AUTH
  // ---------------------------------------------------------
  route("signin", "./routes/auth/student/signin/route.tsx"),
  route("signup", "./routes/auth/student/signup/route.tsx"),
  // route("forgot-password", "./routes/auth/student/forgot-password/route.tsx"),
  // route("reset-password", "./routes/auth/student/reset-password/route.tsx"),
  // ---------------------------------------------------------
  // COURSE CREATOR AUTH
  // ---------------------------------------------------------
  route("course-creator/signin", "./routes/auth/course-creator/signin/route.tsx"),
  route("course-creator/signup", "./routes/auth/course-creator/signup/route.tsx"),
  // =========================================================
  // STUDENT DASHBOARD
  // =========================================================
  route("dashboard", "./routes/student/route.tsx", [
    // /dashboard
    index("./routes/student/home/route.tsx"),

    // /dashboard/my-learning
    route("my-learning", "./routes/student/my-learning/route.tsx"),

    // /dashboard/my-learning/:courseId
    route("my-learning/:courseId", "./routes/student/my-learning/$courseId/route.tsx"),

    // /dashboard/explore-courses
    route("explore-courses", "./routes/student/explore-courses/route.tsx"),

    // /dashboard/wishlist
    route("wishlist", "./routes/student/wishlist/route.tsx"),

    // /dashboard/certificates
    route("certificates", "./routes/student/certificates/route.tsx"),

    // /dashboard/achievements
    route("achievements", "./routes/student/achievements/route.tsx"),

    // /dashboard/notifications
    route("notifications", "./routes/student/notifications/route.tsx"),

    // /dashboard/settings
    route("settings", "./routes/student/settings/route.tsx"),
  ]),

  // =========================================================
  // COURSE CREATOR DASHBOARD
  // =========================================================

  route("course-creator", "./routes/course-creator/route.tsx", [
    // /course-creator
    index("./routes/course-creator/home/route.tsx"),

    // /course-creator/courses
    route("courses", "./routes/course-creator/courses/route.tsx"),

    // /course-creator/courses/new
    route("courses/new", "./routes/course-creator/courses/new/route.tsx"),

    // /course-creator/courses/:courseId/edit
    route("courses/:courseId/edit", "./routes/course-creator/courses/$courseId/edit/route.tsx"),

    // /course-creator/students
    route("students", "./routes/course-creator/students/route.tsx"),

    // /course-creator/instructors
    route("instructors", "./routes/course-creator/instructors/route.tsx"),

    // /course-creator/enrollments
    route("enrollments", "./routes/course-creator/enrollments/route.tsx"),

    // /course-creator/analytics
    route("analytics", "./routes/course-creator/analytics/route.tsx"),

    // /course-creator/settings
    route("settings", "./routes/course-creator/settings/route.tsx"),
  ]),
] satisfies RouteConfig;
