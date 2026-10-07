import { Link } from "react-router";
import { ArrowRight, Heart, Languages, Tag } from "lucide-react";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ExploreCourse = {
  id: string;

  title: string;

  description: string;

  price: number;

  createdBy: string;

  categoryId: string | null;

  categoryName: string | null;

  courseLanguage: string | null;

  level: "beginner" | "intermediate" | "advanced" | "all_levels" | null;

  /**
   * Presigned GET URL returned by backend.
   */
  thumbnail: string | null;

  badge: string | null;

  /**
   * Actual creator name.
   */
  instructor: string;

  /**
   * Kept for compatibility with your current page.
   */
  duration: string;

  rating: number;

  students: string;

  status: "published" | "draft" | "private" | "archived";

  publishedAt: string | null;

  archivedAt: string | null;

  createdAt: string;

  updatedAt: string;
};

interface ExploreCourseCardProps {
  course: ExploreCourse;
}

/* -------------------------------------------------------------------------- */
/* Thumbnail fallback styles                                                  */
/* -------------------------------------------------------------------------- */

const thumbnailStyles: Record<string, string> = {
  react: "from-slate-950 via-indigo-950 to-cyan-500",

  node: "from-slate-950 via-emerald-950 to-green-500",

  html: "from-orange-500 via-red-500 to-blue-500",

  typescript: "from-blue-700 via-blue-600 to-cyan-400",

  nextjs: "from-black via-slate-900 to-slate-700",

  design: "from-pink-500 via-purple-500 to-orange-400",

  javascript: "from-yellow-400 via-yellow-500 to-orange-500",

  git: "from-orange-500 via-red-600 to-slate-900",

  default: "from-indigo-500 to-violet-500",
};

/* -------------------------------------------------------------------------- */
/* Thumbnail fallback content                                                 */
/* -------------------------------------------------------------------------- */

const thumbnailText: Record<string, ReactNode> = {
  react: <span className="text-5xl text-cyan-300">⚛</span>,

  node: (
    <span className="text-3xl font-extrabold tracking-wide text-white">
      node
      <span className="ml-1 text-sm text-green-300">JS</span>
    </span>
  ),

  html: (
    <div className="flex items-center gap-3">
      <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">5</span>

      <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">3</span>
    </div>
  ),

  typescript: (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
      <span className="text-3xl font-black text-white">TS</span>
    </div>
  ),

  nextjs: (
    <span className="text-3xl font-light tracking-[0.15em] text-white">
      NEXT
      <span className="text-sm tracking-normal">.js</span>
    </span>
  ),

  design: (
    <div className="relative h-16 w-16">
      <span className="absolute left-0 top-0 h-8 w-8 rounded-full bg-orange-500" />

      <span className="absolute right-0 top-0 h-8 w-8 rounded-full bg-pink-400" />

      <span className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-sky-400" />

      <span className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-400" />

      <span className="absolute left-4 top-4 h-8 w-8 rounded-full bg-violet-500" />
    </div>
  ),

  javascript: (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-yellow-400 shadow-inner">
      <span className="text-2xl font-black text-slate-900">JS</span>
    </div>
  ),

  git: <span className="text-3xl font-black text-white">git</span>,

  default: <span className="text-3xl font-black tracking-wide text-white">COURSE</span>,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getThumbnailKey(title: string) {
  const value = title.toLowerCase();

  if (value.includes("typescript") || value.includes("type script")) {
    return "typescript";
  }

  if (value.includes("javascript") || value.includes("java script")) {
    return "javascript";
  }

  if (value.includes("react")) {
    return "react";
  }

  if (value.includes("node")) {
    return "node";
  }

  if (value.includes("html") || value.includes("css")) {
    return "html";
  }

  if (value.includes("next")) {
    return "nextjs";
  }

  if (value.includes("design") || value.includes("ui") || value.includes("ux")) {
    return "design";
  }

  if (value.includes("git") || value.includes("github")) {
    return "git";
  }

  return "default";
}

function formatLevel(level: ExploreCourse["level"]) {
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

function getLevelClasses(level: ExploreCourse["level"]) {
  switch (level) {
    case "beginner":
      return "bg-emerald-50 text-emerald-600";

    case "intermediate":
      return "bg-violet-50 text-violet-600";

    case "advanced":
      return "bg-red-50 text-red-500";

    case "all_levels":
      return "bg-blue-50 text-blue-600";

    default:
      return "bg-slate-100 text-slate-500";
  }
}

function isImageUrl(value: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/");
}

function formatPrice(price: number) {
  if (price === 0) {
    return "Free";
  }

  return `$${price.toFixed(2)}`;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  const thumbnailKey = getThumbnailKey(course.title);
  const gradient = thumbnailStyles[thumbnailKey] ?? thumbnailStyles.default;
  const fallbackContent = thumbnailText[thumbnailKey] ?? thumbnailText.default;
  const hasImage = isImageUrl(course.thumbnail);
  const creatorName = course.instructor?.trim() || "Course Creator";
  const categoryName = course.categoryName?.trim() || "Uncategorized";
  const language = course.courseLanguage?.trim() || "Not specified";
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* ================================================================== */}
      {/* CLICKABLE COURSE AREA                                              */}
      {/* ================================================================== */}

      <Link
        to={`/dashboard/explore-courses/${course.id}`}
        className="block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
        aria-label={`View course ${course.title}`}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Thumbnail                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className={`relative h-[170px] overflow-hidden bg-gradient-to-br ${gradient}`}>
          {/* ============================================================ */}
          {/* Real Thumbnail                                                */}
          {/* ============================================================ */}

          {hasImage ? (
            <img
              src={course.thumbnail!}
              alt={`${course.title} thumbnail`}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <>
              {/* Decorative circles */}

              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10" />

              <div className="absolute -bottom-12 left-8 h-28 w-28 rounded-full border border-white/10" />

              {/* Fallback */}

              <div className="relative flex h-full items-center justify-center">{fallbackContent}</div>
            </>
          )}

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

          {/* ============================================================ */}
          {/* Published Badge                                                */}
          {/* ============================================================ */}

          {course.status === "published" && <span className="absolute left-3 top-3 z-10 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm">Published</span>}

          {/* Custom badge */}

          {course.badge && (
            <span
              className={`
                absolute left-3 top-11 z-10 rounded-lg px-2.5 py-1.5
                text-[10px] font-bold shadow-sm
                ${
                  course.badge === "Best Seller"
                    ? "bg-amber-400 text-white"
                    : course.badge === "Most Popular"
                      ? "bg-white text-emerald-600"
                      : course.badge === "Trending"
                        ? "bg-white text-blue-600"
                        : "bg-white text-indigo-600"
                }
              `}
            >
              {course.badge}
            </span>
          )}

          {/* ============================================================ */}
          {/* Bottom Thumbnail CTA                                         */}
          {/* ============================================================ */}

          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur transition group-hover:bg-indigo-600 group-hover:text-white">
            View Course
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Content                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="p-4">
          {/* ============================================================ */}
          {/* Title                                                          */}
          {/* ============================================================ */}

          <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-slate-950 transition-colors group-hover:text-indigo-600">{course.title}</h3>

          {/* ============================================================ */}
          {/* Description                                                   */}
          {/* ============================================================ */}

          <p className="mt-1.5 line-clamp-2 min-h-[32px] text-[11px] leading-4 text-slate-500">{course.description || "No description available."}</p>

          {/* ============================================================ */}
          {/* Creator                                                        */}
          {/* ============================================================ */}

          <div className="mt-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">
              {creatorName
                .split(/\s+/)
                .filter(Boolean)
                .map((name) => name.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">Instructor</p>

              <p className="truncate text-[11px] font-semibold text-slate-700">{creatorName}</p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Course Information                                            */}
          {/* ============================================================ */}

          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* Category */}

            <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2">
              <Tag size={12} className="shrink-0 text-slate-400" />

              <span className="truncate text-[10px] font-medium text-slate-600">{categoryName}</span>
            </div>

            {/* Language */}

            <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2">
              <Languages size={12} className="shrink-0 text-slate-400" />

              <span className="truncate text-[10px] font-medium text-slate-600">{language}</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Level + Price                                                  */}
          {/* ============================================================ */}

          <div className="mt-3 flex items-center justify-between gap-2">
            {/* Level */}

            <span className={`rounded-lg px-2.5 py-1.5 text-[9px] font-semibold ${getLevelClasses(course.level)}`}>{formatLevel(course.level)}</span>

            {/* Price */}

            <span className="text-sm font-extrabold text-slate-900">{formatPrice(course.price)}</span>
          </div>

          {/* ============================================================ */}
          {/* Bottom CTA                                                     */}
          {/* ============================================================ */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[10px] font-medium text-slate-400">Click anywhere on the card</span>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 transition group-hover:text-indigo-700">
              Explore
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* ================================================================== */}
      {/* WISHLIST                                                          */}
      {/* ================================================================== */}

      <button
        type="button"
        aria-label={`Add ${course.title} to wishlist`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md transition hover:bg-white hover:text-red-500"
      >
        <Heart size={16} />
      </button>
    </article>
  );
}
