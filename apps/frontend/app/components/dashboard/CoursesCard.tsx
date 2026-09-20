import type { ReactNode } from "react";
import { Link } from "react-router";

import type { DashboardCourse, DashboardStats } from "../../lib/api";
import { ChevronRightIcon, CodeIcon, MegaphoneIcon, PaletteIcon } from "../landing/icons";

/** Backend sends one of these; the chip picks the matching color. */
const statusStyles: Record<DashboardCourse["status"], string> = {
  green: "bg-emerald-500/15 text-emerald-400",
  purple: "bg-brand/15 text-brand-light",
  yellow: "bg-amber-500/15 text-amber-400",
};

/** Rough category → icon match (falls back to the code icon). */
function iconForCategory(category: string): ReactNode {
  const name = category.toLowerCase();

  if (name.includes("design") || name.includes("photo") || name.includes("art")) {
    return <PaletteIcon className="size-4.5 text-brand-light" />;
  }
  if (name.includes("market") || name.includes("business") || name.includes("growth")) {
    return <MegaphoneIcon className="size-4.5 text-brand-light" />;
  }
  return <CodeIcon className="size-4.5 text-brand-light" />;
}

/** The user's most recently touched enrolled courses, from the dashboard stats. */
export function CoursesCard({ stats }: { stats: DashboardStats }) {
  const courses = stats.recentCourses;

  return (
    <div className="rounded-xl border border-line bg-surface">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">My Courses</h3>
          <p className="mt-0.5 text-xs text-gray-500">Continue where you left off</p>
        </div>
        <Link
          to="/dashboard/my-courses"
          className="text-xs font-semibold text-brand-light transition hover:text-brand"
        >
          View all
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-white">No courses yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Enroll in a course to see it here with your progress.
          </p>
          <Link
            to="/dashboard/explore"
            className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-hover"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        /* Course rows */
        <ul className="divide-y divide-line">
          {courses.map((course) => (
            <li key={course.id} className="flex items-center gap-4 px-5 py-4">
              {/* Icon */}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-ink">
                {iconForCategory(course.category)}
              </span>

              {/* Title + category */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{course.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{course.category}</p>
              </div>

              {/* Progress bar + percentage (hidden on very small screens) */}
              <div className="hidden w-40 items-center gap-3 sm:flex">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="w-9 text-right text-xs font-semibold text-gray-300">
                  {course.progress}%
                </span>
              </div>

              {/* Status chip */}
              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-semibold md:inline-block ${statusStyles[course.status]}`}
              >
                {course.statusLabel}
              </span>

              {/* Action */}
              <ChevronRightIcon className="size-4 shrink-0 text-gray-500" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
