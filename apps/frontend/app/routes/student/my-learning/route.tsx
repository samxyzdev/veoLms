import { useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { redirect } from "react-router";

import type { Route } from "../+types/route";

import { LearningCourseCard, type LearningCourse } from "../components/my-learning/LearningCourseCard";

import { LearningTabs, type LearningTab } from "../components/my-learning/LearningTabs";

import { MyLearningHeader } from "../components/my-learning/MyLearningHeader";

import { api } from "~/lib/axios";

/* -------------------------------------------------------------------------- */
/* Backend response                                                           */
/* -------------------------------------------------------------------------- */

type PurchasedCourseResponse = {
  purchaseId: string;
  purchasedAt: string;

  courseId: string;

  title: string | null;
  description: string | null;

  price: number | null;

  courseLanguage: string | null;

  // Current endpoint may not send these yet.
  categoryName?: string | null;
  level?: string | null;
  thumbnailUrl?: string | null;

  instructorName?: string | null;

  progress?: number | null;
  completedLessons?: number | null;
  totalLessons?: number | null;

  duration?: string | null;
  nextLesson?: string | null;
};

/* -------------------------------------------------------------------------- */
/* Loader                                                                     */
/* -------------------------------------------------------------------------- */

export async function clientLoader() {
  try {
    const response = await api.get("/student/courses/purchased-courses");

    /*
     * Backend response:
     *
     * {
     *   success: true,
     *   data: [...]
     * }
     */

    const backendCourses = (response.data?.data ?? []) as PurchasedCourseResponse[];

    /*
     * Normalize backend data into the shape
     * expected by LearningCourseCard.
     */
    const courses: LearningCourse[] = backendCourses.map((course) => ({
      id: course.courseId,

      title: course.title ?? "Untitled Course",

      description: course.description ?? "Course description unavailable.",

      instructor: course.instructorName ?? "Instructor unavailable",

      lessons: course.totalLessons ?? 0,

      completedLessons: course.completedLessons ?? 0,

      duration: course.duration ?? "Duration unavailable",

      level: course.level ?? "Level unavailable",

      category: course.categoryName ?? "Category unavailable",

      progress: Math.min(100, Math.max(0, Number(course.progress) || 0)),

      status: course.progress != null ? (course.progress >= 100 ? "completed" : course.progress > 0 ? "in-progress" : "not-started") : "not-started",

      /*
       * LearningCourseCard uses CourseThumbnail.
       *
       * The current API does not send thumbnailUrl,
       * so keep an empty value and let CourseThumbnail
       * fall back to generated course art.
       */
      thumbnail: course.thumbnailUrl ?? "",

      nextLesson: course.nextLesson ?? "No lesson available yet.",
    }));

    return courses;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function MyLearningPage({ loaderData }: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<LearningTab>("all");

  const [sortBy, setSortBy] = useState("recent");

  const courses = loaderData as LearningCourse[];

  /* ------------------------------------------------------------------------ */
  /* Filter + Sort                                                            */
  /* ------------------------------------------------------------------------ */

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    /* ---------------------------------------------------------------------- */
    /* Filter by tab                                                          */
    /* ---------------------------------------------------------------------- */

    if (activeTab !== "all") {
      result = result.filter((course) => course.status === activeTab);
    }

    /* ---------------------------------------------------------------------- */
    /* Sort                                                                    */
    /* ---------------------------------------------------------------------- */

    switch (sortBy) {
      case "progress-high":
        result.sort((a, b) => b.progress - a.progress);
        break;

      case "progress-low":
        result.sort((a, b) => a.progress - b.progress);
        break;

      case "oldest":
        result.reverse();
        break;

      case "recent":
      default:
        break;
    }

    return result;
  }, [activeTab, sortBy, courses]);

  return (
    <div className="min-w-0">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <MyLearningHeader />

      {/* ------------------------------------------------------------------ */}
      {/* Tabs                                                                */}
      {/* ------------------------------------------------------------------ */}

      <LearningTabs activeTab={activeTab} sortBy={sortBy} onTabChange={setActiveTab} onSortChange={setSortBy} />

      {/* ------------------------------------------------------------------ */}
      {/* Courses                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2.5">
        {filteredCourses.map((course) => (
          <LearningCourseCard key={course.id} course={course} />
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* Empty state                                                       */}
        {/* ---------------------------------------------------------------- */}

        {filteredCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">📚</div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">{activeTab === "all" ? "No courses found" : `No ${activeTab} courses`}</h3>

            <p className="mt-1 text-xs text-slate-400">{activeTab === "all" ? "You haven't purchased any courses yet." : "You don't have any courses in this category."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
