import { useMemo, useState } from "react";
import type { Route } from "../+types/route";

import { Categories } from "../components/explore/Categories";
import { CourseFilters } from "../components/explore/CourseFilters";

import { ExploreCourseCard, type ExploreCourse } from "../components/explore/ExploreCourseCard";

import { ExploreHeader } from "../components/explore/ExploreHeader";

import { api } from "~/lib/axios";

/* -------------------------------------------------------------------------- */
/* Backend response type                                                      */
/* -------------------------------------------------------------------------- */

type StudentCourseResponse = {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  createdBy: string;
  categoryId: string | null;
  categoryName: string | null;
  courseLanguage: string | null;
  level: "beginner" | "intermediate" | "advanced" | "all_levels" | null;
  thumbnailUrl: string | null;
  status: "published" | "draft" | "private" | "archived";
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/* -------------------------------------------------------------------------- */
/* Loader                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Public route
 * No authentication check is required here.
 */
export async function clientLoader() {
  const response = await api.get("/student/courses");

  const backendCourses = (response.data?.data ?? []) as StudentCourseResponse[];

  const courses: ExploreCourse[] = backendCourses.map((course) => {
    return {
      id: course.id,
      title: course.title ?? "Untitled Course",
      description: course.description ?? "",
      price: course.price ?? 0,
      createdBy: course.createdBy,
      categoryId: course.categoryId,
      categoryName: course.categoryName,
      courseLanguage: course.courseLanguage,
      level: course.level,
      thumbnail: course.thumbnailUrl,
      badge: null,
      instructor: "You",
      category: course.categoryId ?? "Uncategorized",
      duration: "0h",
      rating: 0,
      students: "0",
      status: course.status,
      publishedAt: course.publishedAt,
      archivedAt: course.archivedAt,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  });

  return courses;
}
/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ExploreCoursesPage({ loaderData }: Route.ComponentProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const [search, setSearch] = useState("");

  const [level, setLevel] = useState("All Levels");

  const [duration, setDuration] = useState("Any Duration");

  const [rating, setRating] = useState("Any Rating");

  const [sortBy, setSortBy] = useState("popular");

  const courses = loaderData;

  /* ------------------------------------------------------------------------ */
  /* Filter + Sort                                                            */
  /* ------------------------------------------------------------------------ */

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    /* ---------------------------------------------------------------------- */
    /* Category                                                               */
    /* ---------------------------------------------------------------------- */

    if (activeCategory !== "all") {
      result = result.filter((course) => course.categoryId === activeCategory);
    }

    /* ---------------------------------------------------------------------- */
    /* Search                                                                 */
    /* ---------------------------------------------------------------------- */

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((course) => {
        const title = course.title?.toLowerCase() ?? "";

        const description = course.description?.toLowerCase() ?? "";

        const instructor = course.instructor?.toLowerCase() ?? "";

        const category = course.category?.toLowerCase() ?? "";

        const language = course.courseLanguage?.toLowerCase() ?? "";

        return title.includes(searchValue) || description.includes(searchValue) || instructor.includes(searchValue) || category.includes(searchValue) || language.includes(searchValue);
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Level                                                                  */
    /* ---------------------------------------------------------------------- */

    if (level !== "All Levels") {
      result = result.filter((course) => {
        const courseLevel = formatLevel(course.level);

        return courseLevel === level;
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Duration                                                               */
    /* ---------------------------------------------------------------------- */

    if (duration !== "Any Duration") {
      result = result.filter((course) => {
        const hours = parseDurationToHours(course.duration ?? "0h");

        if (duration === "0 - 5 Hours") {
          return hours <= 5;
        }

        if (duration === "5 - 10 Hours") {
          return hours > 5 && hours <= 10;
        }

        if (duration === "10+ Hours") {
          return hours > 10;
        }

        return true;
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Rating                                                                 */
    /* ---------------------------------------------------------------------- */

    if (rating !== "Any Rating") {
      const minimumRating = Number(rating.replace("+", ""));

      result = result.filter((course) => (course.rating ?? 0) >= minimumRating);
    }

    /* ---------------------------------------------------------------------- */
    /* Sorting                                                                */
    /* ---------------------------------------------------------------------- */

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;

      case "students":
        result.sort((a, b) => parseStudentCount(b.students ?? "0") - parseStudentCount(a.students ?? "0"));
        break;

      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;

      case "popular":
      default:
        /**
         * Keep backend order.
         */
        break;
    }

    return result;
  }, [courses, activeCategory, search, level, duration, rating, sortBy]);

  /* ------------------------------------------------------------------------ */
  /* Clear Filters                                                            */
  /* ------------------------------------------------------------------------ */

  function clearFilters() {
    setActiveCategory("all");
    setSearch("");
    setLevel("All Levels");
    setDuration("Any Duration");
    setRating("Any Rating");
    setSortBy("popular");
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-w-0">
      {/* ------------------------------------------------------------------ */}
      {/* Header + Hero                                                      */}
      {/* ------------------------------------------------------------------ */}

      <ExploreHeader />

      {/* ------------------------------------------------------------------ */}
      {/* Categories                                                         */}
      {/* ------------------------------------------------------------------ */}

      <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* ------------------------------------------------------------------ */}
      {/* Filters                                                            */}
      {/* ------------------------------------------------------------------ */}

      <CourseFilters
        search={search}
        level={level}
        duration={duration}
        rating={rating}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onLevelChange={setLevel}
        onDurationChange={setDuration}
        onRatingChange={setRating}
        onSortChange={setSortBy}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Results Count                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> of <span className="font-bold text-slate-900">{courses.length}</span> courses
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Course Grid                                                        */}
      {/* ------------------------------------------------------------------ */}

      {filteredCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <ExploreCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">🔎</div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">No courses found</h3>

          <p className="mt-1 text-xs text-slate-400">Try changing your search or filters.</p>

          <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatLevel(level: ExploreCourse["level"]): string {
  switch (level) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";

    case "all_levels":
      return "All Levels";

    default:
      return "All Levels";
  }
}

/**
 * Converts values such as:
 *
 * "2h 30m" -> 2.5
 * "5h"     -> 5
 * "12h"    -> 12
 */
function parseDurationToHours(duration: string): number {
  const hoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*h/i);

  const minutesMatch = duration.match(/(\d+)\s*m/i);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;

  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  return hours + minutes / 60;
}

/**
 * Converts:
 *
 * "1.5k" -> 1500
 * "10k"  -> 10000
 * "500"  -> 500
 */
function parseStudentCount(value: string): number {
  const normalized = value.trim().toLowerCase();

  const number = parseFloat(normalized);

  if (Number.isNaN(number)) {
    return 0;
  }

  if (normalized.includes("k")) {
    return number * 1_000;
  }

  if (normalized.includes("m")) {
    return number * 1_000_000;
  }

  return number;
}
