import { ArrowRight } from "lucide-react";
import { Link, useOutletContext } from "react-router";

type PopularCourse = {
  id: string;
  title: string;
  enrollments: number;
  rank: number;
};

type CourseCreatorStats = {
  totalCourses: number;
  totalStudents: number;
  totalPurchases: number;
  totalRevenue: number;

  enrollmentOverview: {
    month: string;
    value: number;
  }[];

  popularCourses: PopularCourse[];
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStats;
};

export function PopularCourses() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  const courses = stats.popularCourses ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Popular Courses
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Courses with the most enrollment activity.
          </p>
        </div>

        <Link
          to="/course-creator/courses"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Courses */}
      <div>
        {courses.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-400">
              No courses found.
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0"
            >
              {/* Rank */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xs font-extrabold text-slate-500">
                {course.rank}
              </span>

              {/* Thumbnail */}
              <div className="flex h-12 w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-500">
                <span className="text-sm font-extrabold text-white">
                  {course.title.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-bold text-slate-900">
                  {course.title}
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  {course.enrollments} students
                </p>
              </div>

              {/* Enrollments */}
              <div className="w-16 text-right">
                <p className="text-sm font-extrabold text-slate-900">
                  {course.enrollments}
                </p>

                <p className="text-[9px] text-slate-400">enrollments</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
