import { useMemo, useState } from "react";
import { redirect } from "react-router";
import { isAxiosError } from "axios";

import type { Route } from "../+types/route";

import {
  LearningCourseCard,
  type LearningCourse,
} from "../components/my-learning/LearningCourseCard";

import {
  LearningTabs,
  type LearningTab,
} from "../components/my-learning/LearningTabs";

import { MyLearningHeader } from "../components/my-learning/MyLearningHeader";

import { api } from "~/lib/axios";

/**
 * Fetch purchased/enrolled courses for the logged-in user.
 */
export async function clientLoader() {
  try {
    const response = await api.get("/course/purchased-course");

    /**
     * Supports both response formats:
     *
     * 1. { courses: [...] }
     * 2. [...]
     */
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data.courses ?? [];
  } catch (error) {
    /**
     * User is not authenticated.
     * Send them to signin page.
     */
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    throw error;
  }
}

export default function MyLearningPage({ loaderData }: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<LearningTab>("all");

  const [sortBy, setSortBy] = useState("recent");

  /**
   * Data now comes from the backend through clientLoader.
   */
  const courses = loaderData as LearningCourse[];

  /**
   * Filter + sort courses.
   */
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // -------------------------
    // Filter by tab
    // -------------------------
    if (activeTab !== "all") {
      result = result.filter((course) => course.status === activeTab);
    }

    // -------------------------
    // Sort
    // -------------------------
    switch (sortBy) {
      case "progress-high":
        result.sort((a, b) => b.progress - a.progress);
        break;

      case "progress-low":
        result.sort((a, b) => a.progress - b.progress);
        break;

      case "oldest":
        /**
         * Assumes API already returns courses
         * in recent-first order.
         */
        result.reverse();
        break;

      case "recent":
      default:
        /**
         * Keep API order.
         */
        break;
    }

    return result;
  }, [activeTab, sortBy, courses]);

  return (
    <div className="min-w-0">
      {/* ------------------------- */}
      {/* Page Header */}
      {/* ------------------------- */}
      <MyLearningHeader />

      {/* ------------------------- */}
      {/* Tabs + Filters */}
      {/* ------------------------- */}
      <LearningTabs
        activeTab={activeTab}
        sortBy={sortBy}
        onTabChange={setActiveTab}
        onSortChange={setSortBy}
      />

      {/* ------------------------- */}
      {/* Courses */}
      {/* ------------------------- */}
      <div className="space-y-2.5">
        {filteredCourses.map((course) => (
          <LearningCourseCard key={course.id} course={course} />
        ))}

        {/* ------------------------- */}
        {/* Empty State */}
        {/* ------------------------- */}
        {filteredCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
              📚
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              {activeTab === "all"
                ? "No courses found"
                : `No ${activeTab} courses`}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {activeTab === "all"
                ? "You haven't purchased any courses yet."
                : "You don't have any courses in this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
