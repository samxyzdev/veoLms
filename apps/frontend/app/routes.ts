// import { type RouteConfig, index, route } from "@react-router/dev/routes";

// export default [
//   index("routes/landing/route.tsx"),
//   route("signin", "./routes/auth/Signin/route.tsx"),
//   route("signup", "./routes/auth/signup/route.tsx"),
//   route("dashboard", "./routes/dashboard/route.tsx", [
//     index("./routes/dashboard/home/route.tsx"),
//     route("my-learning", "./routes/dashboard/my-learning/route.tsx"),
//     route("explore-courses", "./routes/dashboard/explore-courses/route.tsx"),
//     route("wishlist", "./routes/dashboard/wishlist/route.tsx"),
//     route("certificates", "./routes/dashboard/certificates/route.tsx"),
//     route("achievements", "./routes/dashboard/achievements/route.tsx"),
//     route("notifications", "./routes/dashboard/notifications/route.tsx"),
//     route("settings", "./routes/dashboard/settings/route.tsx"),
//   ]),
//   route("admin", "./routes/admin/route.tsx", [
//     index("./routes/admin/home/route.tsx"),
//     route("courses", "./routes/admin/courses/route.tsx"),
//     route("courses/new", "./routes/admin/courses/new/route.tsx"),
//     route(
//       "courses/:courseId/edit",
//       "./routes/admin/courses/$courseId/edit/route.tsx",
//     ),
//     route("students", "./routes/admin/students/route.tsx"),
//     route("instructors", "./routes/admin/instructors/route.tsx"),
//     route("enrollments", "./routes/admin/enrollments/route.tsx"),
//     route("analytics", "./routes/admin/analytics/route.tsx"),
//     route("settings", "./routes/admin/settings/route.tsx"),
//   ]),
// ] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // =========================================
  // PUBLIC ROUTES
  // =========================================

  index("routes/landing/route.tsx"),

  route("signin", "./routes/auth/Signin/route.tsx"),

  route("signup", "./routes/auth/signup/route.tsx"),

  // =========================================
  // DASHBOARD
  // =========================================

  route("dashboard", "./routes/dashboard/route.tsx", [
    index("./routes/dashboard/home/route.tsx"),

    // My Learning page
    route("my-learning", "./routes/dashboard/my-learning/route.tsx"),

    // Course Player
    route(
      "my-learning/:courseId",
      "./routes/dashboard/my-learning/$courseId/route.tsx",
    ),

    route("explore-courses", "./routes/dashboard/explore-courses/route.tsx"),

    route("wishlist", "./routes/dashboard/wishlist/route.tsx"),

    route("certificates", "./routes/dashboard/certificates/route.tsx"),

    route("achievements", "./routes/dashboard/achievements/route.tsx"),

    route("notifications", "./routes/dashboard/notifications/route.tsx"),

    route("settings", "./routes/dashboard/settings/route.tsx"),
  ]),

  // =========================================
  // ADMIN
  // =========================================

  route("admin", "./routes/admin/route.tsx", [
    index("./routes/admin/home/route.tsx"),

    route("courses", "./routes/admin/courses/route.tsx"),

    route("courses/new", "./routes/admin/courses/new/route.tsx"),

    route(
      "courses/:courseId/edit",
      "./routes/admin/courses/$courseId/edit/route.tsx",
    ),

    route("students", "./routes/admin/students/route.tsx"),

    route("instructors", "./routes/admin/instructors/route.tsx"),

    route("enrollments", "./routes/admin/enrollments/route.tsx"),

    route("analytics", "./routes/admin/analytics/route.tsx"),

    route("settings", "./routes/admin/settings/route.tsx"),
  ]),
] satisfies RouteConfig;
