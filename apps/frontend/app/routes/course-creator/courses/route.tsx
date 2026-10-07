import { useMemo, useState } from "react";

import { ArrowDownUp, BookOpen, ChevronDown, CircleEllipsis, Filter, Plus, Search, SlidersHorizontal, UserRound, Users } from "lucide-react";

import { Link, redirect, useLoaderData } from "react-router";

import { isAxiosError } from "axios";

import { api } from "~/lib/axios";

// =========================================================
// TYPES
// =========================================================

type CourseStatus = "published" | "draft" | "private" | "archived";

type CourseLevel = "beginner" | "intermediate" | "advanced" | "all_levels";

type CreatorCourse = {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  createdBy: string;
  categoryId: string | null;
  courseLanguage: string | null;
  status: CourseStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  level: CourseLevel | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: string;
  name: string;
};

// =========================================================
// TABS
// =========================================================

const tabs = [
  {
    id: "all",
    label: "All Courses",
  },
  {
    id: "published",
    label: "Published",
  },
  {
    id: "draft",
    label: "Drafts",
  },
  {
    id: "archived",
    label: "Archived",
  },
] as const;

// =========================================================
// LOAD DATA
// =========================================================

export async function clientLoader() {
  try {
    const [coursesResponse, categoriesResponse] = await Promise.all([api.get("/course-creator/courses"), api.get("/course-creator/dashboard/categories")]);

    return {
      courses: (coursesResponse.data.data ?? []) as CreatorCourse[],
      categories: (categoriesResponse.data.data ?? []) as Category[],
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    console.error("Failed to load course creator courses:", error);

    return {
      courses: [],
      categories: [],
      loadError: "Failed to load courses.",
    };
  }
}

// =========================================================
// HELPERS
// =========================================================

function formatPrice(price: number | null) {
  if (price === null || price === undefined) {
    return "Free";
  }

  return `$${price.toFixed(2)}`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatLevel(level: CourseLevel | null) {
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
      return "—";
  }
}

function getStatusClasses(status: CourseStatus) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700";

    case "draft":
      return "bg-amber-50 text-amber-700";

    case "private":
      return "bg-blue-50 text-blue-700";

    case "archived":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusLabel(status: CourseStatus) {
  switch (status) {
    case "published":
      return "Published";

    case "draft":
      return "Draft";

    case "private":
      return "Private";

    case "archived":
      return "Archived";

    default:
      return "Unknown";
  }
}

function getCategoryName(categoryId: string | null, categories: Category[]) {
  if (!categoryId) {
    return "Uncategorized";
  }

  return categories.find((category) => category.id === categoryId)?.name ?? "Uncategorized";
}

function getThumbnailLabel(title: string | null) {
  if (!title) {
    return "COURSE";
  }

  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// =========================================================
// THUMBNAIL
// =========================================================

function CourseThumbnail({ course }: { course: CreatorCourse }) {
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !course.thumbnailUrl || imageError;

  if (showPlaceholder) {
    return (
      <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        <span className="text-[10px] font-bold tracking-wider text-slate-500">{getThumbnailLabel(course.title)}</span>
      </div>
    );
  }

  return (
    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
      <img src={course.thumbnailUrl} alt={course.title ?? "Course thumbnail"} className="block h-full w-full object-cover" loading="lazy" onError={() => setImageError(true)} />
    </div>
  );
}

// =========================================================
// ROUTE
// =========================================================

export default function CoursesRoute() {
  const loaderData = useLoaderData<typeof clientLoader>();

  const courses = loaderData.courses;
  const categories = loaderData.categories;

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("all");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [level, setLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("recent");

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================

  const categoryOptions = useMemo(() => {
    return ["All Categories", ...categories.map((item) => item.name).sort((a, b) => a.localeCompare(b))];
  }, [categories]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // -------------------------------------------------------
    // STATUS TAB
    // -------------------------------------------------------

    if (activeTab !== "all") {
      result = result.filter((course) => course.status === activeTab);
    }

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((course) => {
        const courseCategory = getCategoryName(course.categoryId, categories);

        return (
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          courseCategory.toLowerCase().includes(query) ||
          course.courseLanguage?.toLowerCase().includes(query)
        );
      });
    }

    // -------------------------------------------------------
    // CATEGORY
    // -------------------------------------------------------

    if (category !== "All Categories") {
      result = result.filter((course) => getCategoryName(course.categoryId, categories) === category);
    }

    // -------------------------------------------------------
    // LEVEL
    // -------------------------------------------------------

    if (level !== "All Levels") {
      result = result.filter((course) => {
        return formatLevel(course.level) === level;
      });
    }

    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    switch (sortBy) {
      case "title":
        result.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
        break;

      case "price-high":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;

      case "price-low":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;

      case "recent":
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return result;
  }, [courses, categories, activeTab, category, level, search, sortBy]);

  // =========================================================
  // TAB COUNTS
  // =========================================================

  const tabCounts = useMemo(() => {
    return {
      all: courses.length,

      published: courses.filter((course) => course.status === "published").length,

      draft: courses.filter((course) => course.status === "draft").length,

      archived: courses.filter((course) => course.status === "archived").length,
    };
  }, [courses]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 lg:px-10">
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/course-creator" className="transition-colors hover:text-slate-900">
            Home
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-900">Courses</span>
        </div>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Courses</h1>

            <p className="mt-1 text-sm text-slate-500 md:text-base">Manage all your courses, content and publishing status.</p>
          </div>

          <Link
            to="/course-creator/courses/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {loaderData.loadError && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loaderData.loadError}</div>}

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="mb-5 overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max items-center gap-7">
            {tabs.map((tab) => {
              const count = tabCounts[tab.id];
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {tab.label} ({count}){isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* CATEGORY */}

            <div className="relative">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 min-w-[175px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* LEVEL */}

            <div className="relative">
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="h-11 min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* SORT */}

            <div className="relative">
              <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option value="recent">Recently Updated</option>

                <option value="title">Course Name</option>

                <option value="price-high">Price: High to Low</option>

                <option value="price-low">Price: Low to High</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* FILTER BUTTON */}

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              <Filter className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </section>

        {/* =====================================================
            RESULT COUNT
        ====================================================== */}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredCourses.length}</span> course
            {filteredCourses.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Course</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Creator</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Level</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Students</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const categoryName = getCategoryName(course.categoryId, categories);

                    return (
                      <tr key={course.id} className="group transition-colors hover:bg-slate-50/70">
                        {/* COURSE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <CourseThumbnail course={course} />

                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">{course.title || "Untitled Course"}</p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                <BookOpen className="h-3.5 w-3.5" />

                                <span>Content count unavailable</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CREATOR */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <UserRound className="h-4 w-4" />
                            </div>

                            <span className="text-sm font-medium text-slate-700">You</span>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">{categoryName}</span>
                        </td>

                        {/* LEVEL */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">{formatLevel(course.level)}</span>
                        </td>

                        {/* PRICE */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-slate-900">{formatPrice(course.price)}</span>
                        </td>

                        {/* STUDENTS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Users className="h-4 w-4 text-slate-400" />

                            <span>—</span>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(course.status)}`}>{getStatusLabel(course.status)}</span>
                        </td>

                        {/* UPDATED */}

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-sm text-slate-500">{formatDate(course.updatedAt)}</span>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <Link to={`/course-creator/courses/${course.id}/edit`} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 opacity-100 transition hover:bg-slate-100">
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label={`More actions for ${course.title ?? "course"}`}
                            >
                              <CircleEllipsis className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900">No courses found</h3>

                        <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Total courses: <span className="font-semibold text-slate-900">{courses.length}</span>
          </p>

          <div className="flex items-center gap-2">
            <button type="button" disabled className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-400">
              Previous
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white">1</span>

            <button type="button" disabled className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-400">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
