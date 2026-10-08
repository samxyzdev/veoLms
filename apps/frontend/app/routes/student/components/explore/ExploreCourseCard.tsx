import { Link } from "react-router";
import { ArrowRight, Heart, Languages, Tag } from "lucide-react";
import { CourseThumbnail, getCourseArtKey } from "../CourseThumbnail";
import { formatCourseLevel, type CourseLevel } from "~/lib/course";
import { getInitials } from "~/lib/format";

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

  category: string;

  courseLanguage: string | null;

  level: CourseLevel;

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
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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
  const thumbnailKey = getCourseArtKey(course.title);
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

        <CourseThumbnail artKey={thumbnailKey} title={course.title} imageUrl={course.thumbnail} zoomOnHover className="h-[170px]">
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
        </CourseThumbnail>

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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">{getInitials(creatorName)}</div>

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

            <span className={`rounded-lg px-2.5 py-1.5 text-[9px] font-semibold ${getLevelClasses(course.level)}`}>{formatCourseLevel(course.level)}</span>

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
