// app/routes/admin/home/route.tsx

import { CourseCreatorDashboardHeader } from "../components/dashboard/CourseCreatorDashboardHeader";
import { CourseCreatorStats } from "../components/dashboard/CourseCreatorStats";
import { CourseCategories } from "../components/dashboard/CourseCategories";
import { EnrollmentOverview } from "../components/dashboard/EnrollmentOverview";
import { PopularCourses } from "../components/dashboard/PopularCourses";
import { RecentEnrollments } from "../components/dashboard/RecentEnrollments";
import { StudentGrowth } from "../components/dashboard/StudentGrowth";

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <CourseCreatorDashboardHeader />

      {/* Stats */}
      <CourseCreatorStats />

      {/* Enrollment + Popular Courses */}
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <EnrollmentOverview />

        <PopularCourses />
      </div>

      {/* Recent enrollments + Student Growth + Categories */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr_0.9fr]">
        <RecentEnrollments />

        <StudentGrowth />

        <CourseCategories />
      </div>
    </div>
  );
}
