import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  BookOpen,
  ChevronDown,
  CircleEllipsis,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Link } from "react-router";

type CourseStatus = "published" | "draft" | "archived";
type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  level: CourseLevel;
  price: number;
  students: number;
  status: CourseStatus;
  updatedAt: string;
  lessons: number;
  thumbnail: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Learn React from scratch with practical projects.",
    instructor: "John Smith",
    instructorAvatar: "JS",
    category: "Development",
    level: "Beginner",
    price: 49,
    students: 12450,
    status: "published",
    updatedAt: "Sep 24, 2026",
    lessons: 42,
    thumbnail: "react",
  },
  {
    id: 2,
    title: "Node.js Masterclass",
    description: "Build scalable backend applications with Node.js.",
    instructor: "Sarah Wilson",
    instructorAvatar: "SW",
    category: "Development",
    level: "Intermediate",
    price: 69,
    students: 8930,
    status: "published",
    updatedAt: "Sep 22, 2026",
    lessons: 58,
    thumbnail: "node",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Master the basics of modern UI and UX design.",
    instructor: "Emily Carter",
    instructorAvatar: "EC",
    category: "Design",
    level: "Beginner",
    price: 39,
    students: 7280,
    status: "published",
    updatedAt: "Sep 19, 2026",
    lessons: 34,
    thumbnail: "design",
  },
  {
    id: 4,
    title: "TypeScript Masterclass",
    description: "Write scalable and type-safe TypeScript applications.",
    instructor: "Alex Johnson",
    instructorAvatar: "AJ",
    category: "Development",
    level: "Advanced",
    price: 79,
    students: 6240,
    status: "published",
    updatedAt: "Sep 18, 2026",
    lessons: 51,
    thumbnail: "typescript",
  },
  {
    id: 5,
    title: "Next.js Full Stack",
    description: "Build full-stack applications using Next.js.",
    instructor: "Michael Brown",
    instructorAvatar: "MB",
    category: "Development",
    level: "Advanced",
    price: 89,
    students: 5120,
    status: "draft",
    updatedAt: "Sep 16, 2026",
    lessons: 63,
    thumbnail: "nextjs",
  },
  {
    id: 6,
    title: "Digital Marketing",
    description: "Learn practical digital marketing strategies.",
    instructor: "Olivia Martin",
    instructorAvatar: "OM",
    category: "Marketing",
    level: "Intermediate",
    price: 45,
    students: 3980,
    status: "published",
    updatedAt: "Sep 14, 2026",
    lessons: 29,
    thumbnail: "marketing",
  },
  {
    id: 7,
    title: "Python for Data Science",
    description: "Analyze data and build useful data science workflows.",
    instructor: "David Miller",
    instructorAvatar: "DM",
    category: "Data Science",
    level: "Intermediate",
    price: 59,
    students: 4620,
    status: "draft",
    updatedAt: "Sep 11, 2026",
    lessons: 47,
    thumbnail: "python",
  },
  {
    id: 8,
    title: "HTML & CSS Fundamentals",
    description: "Build beautiful responsive websites from scratch.",
    instructor: "Sophia Davis",
    instructorAvatar: "SD",
    category: "Development",
    level: "Beginner",
    price: 29,
    students: 15780,
    status: "archived",
    updatedAt: "Sep 08, 2026",
    lessons: 36,
    thumbnail: "html",
  },
];

const tabs = [
  { id: "all", label: "All Courses" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
  { id: "archived", label: "Archived" },
] as const;

const thumbnailStyles: Record<
  Course["thumbnail"],
  {
    wrapper: string;
    label: string;
  }
> = {
  react: {
    wrapper: "bg-sky-50",
    label: "REACT",
  },
  node: {
    wrapper: "bg-emerald-50",
    label: "NODE",
  },
  design: {
    wrapper: "bg-pink-50",
    label: "UI/UX",
  },
  typescript: {
    wrapper: "bg-blue-50",
    label: "TS",
  },
  nextjs: {
    wrapper: "bg-slate-100",
    label: "NEXT",
  },
  marketing: {
    wrapper: "bg-orange-50",
    label: "MKT",
  },
  python: {
    wrapper: "bg-yellow-50",
    label: "PY",
  },
  html: {
    wrapper: "bg-purple-50",
    label: "HTML",
  },
};

function formatStudents(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return value.toString();
}

function getStatusClasses(status: CourseStatus) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700";
    case "draft":
      return "bg-amber-50 text-amber-700";
    case "archived":
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusLabel(status: CourseStatus) {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
  }
}

function CourseThumbnail({ type }: { type: Course["thumbnail"] }) {
  const thumbnail = thumbnailStyles[type];

  return (
    <div
      className={`flex h-14 w-20 shrink-0 items-center justify-center rounded-xl ${thumbnail.wrapper}`}
    >
      <span className="text-[10px] font-bold tracking-wider text-slate-500">
        {thumbnail.label}
      </span>
    </div>
  );
}

export default function CoursesRoute() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [level, setLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("recent");

  const categories = useMemo(() => {
    return [
      "All Categories",
      ...new Set(courses.map((course) => course.category)),
    ];
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (activeTab !== "all") {
      result = result.filter((course) => course.status === activeTab);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query),
      );
    }

    if (category !== "All Categories") {
      result = result.filter((course) => course.category === category);
    }

    if (level !== "All Levels") {
      result = result.filter((course) => course.level === level);
    }

    switch (sortBy) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "students":
        result.sort((a, b) => b.students - a.students);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "recent":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [activeTab, category, level, search, sortBy]);

  const tabCounts = useMemo(() => {
    return {
      all: courses.length,
      published: courses.filter((course) => course.status === "published")
        .length,
      draft: courses.filter((course) => course.status === "draft").length,
      archived: courses.filter((course) => course.status === "archived").length,
    };
  }, []);

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 lg:px-10">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/admin" className="transition-colors hover:text-slate-900">
            Home
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-900">Courses</span>
        </div>

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Courses
            </h1>

            <p className="mt-1 text-sm text-slate-500 md:text-base">
              Manage all your courses, content and publishing status.
            </p>
          </div>

          <Link
            to="/admin/courses/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-5 overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max items-center gap-7">
            {tabs.map((tab) => {
              const count = tabCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label} ({count})
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses, instructors..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 min-w-[175px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Level */}
            <div className="relative">
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="h-11 min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option value="recent">Recently Updated</option>
                <option value="title">Course Name</option>
                <option value="students">Most Students</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Filter Button */}
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

        {/* Result count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredCourses.length}
            </span>{" "}
            course{filteredCourses.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Instructor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Level
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Students
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Updated
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      {/* Course */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <CourseThumbnail type={course.thumbnail} />

                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">
                              {course.title}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            {course.instructorAvatar}
                          </div>

                          <span className="text-sm font-medium text-slate-700">
                            {course.instructor}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {course.category}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {course.level}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          ${course.price}
                        </span>
                      </td>

                      {/* Students */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Users className="h-4 w-4 text-slate-400" />
                          {formatStudents(course.students)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            course.status,
                          )}`}
                        >
                          {getStatusLabel(course.status)}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap text-sm text-slate-500">
                          {course.updatedAt}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/admin/courses/${course.id}/edit`}
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 opacity-100 transition hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`More actions for ${course.title}`}
                          >
                            <CircleEllipsis className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900">
                          No courses found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom */}
        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Total courses:{" "}
            <span className="font-semibold text-slate-900">
              {courses.length}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-400"
            >
              Previous
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white">
              1
            </span>

            <button
              type="button"
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
