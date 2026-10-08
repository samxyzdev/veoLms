import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Globe, Heart, Play, Star, Users } from "lucide-react";

import { Link } from "react-router";

export type CourseCardVariant = "explore" | "enrolled";

export type CourseCardProps = {
  variant: CourseCardVariant;

  id: string;
  title: string;
  description?: string | null;

  thumbnail: string;

  instructorName?: string | null;
  instructorAvatar?: string | null;

  category?: string | null;
  language?: string | null;
  level?: string | null;

  /**
   * Price is expected in the smallest currency unit.
   * Example:
   * ₹999 = 99900 paise
   */
  price?: number | null;
  isFree?: boolean;

  rating?: number | null;
  reviewCount?: number | null;
  studentsCount?: number | null;

  isPublished?: boolean;
  isWishlisted?: boolean;

  // Enrolled course data
  progress?: number | null;
  completedLessons?: number | null;
  totalLessons?: number | null;
  lastWatchedLesson?: string | null;
  lastWatchedAt?: string | null;

  href: string;

  onWishlistToggle?: (courseId: string) => void;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPrice(price?: number | null, isFree?: boolean) {
  if (isFree || price === 0) {
    return "Free";
  }

  if (price == null) {
    return null;
  }

  // Backend stores price in paise.
  return `₹${(price / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function clampProgress(progress?: number | null) {
  return Math.min(100, Math.max(0, Number(progress) || 0));
}

function formatLevel(level?: string | null) {
  if (!level) {
    return null;
  }

  return level.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CourseCard({
  variant,

  id,
  title,
  description,

  thumbnail,

  instructorName,
  instructorAvatar,

  category,
  language,
  level,

  price,
  isFree,

  rating,
  reviewCount,
  studentsCount,

  isPublished,
  isWishlisted,

  progress,
  completedLessons,
  totalLessons,
  lastWatchedLesson,
  lastWatchedAt,

  href,

  onWishlistToggle,
}: CourseCardProps) {
  const isExplore = variant === "explore";

  const courseProgress = clampProgress(progress);

  const isCompleted = courseProgress >= 100;

  const priceLabel = formatPrice(price, isFree);

  const formattedLevel = formatLevel(level);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* ================================================================== */}
      {/* THUMBNAIL                                                           */}
      {/* ================================================================== */}

      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            <BookOpen size={32} />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Status Badge                                                      */}
        {/* ---------------------------------------------------------------- */}

        {isExplore && isPublished && <div className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">Published</div>}

        {!isExplore && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
            <BookOpen size={11} />
            Enrolled
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Wishlist                                                          */}
        {/* ---------------------------------------------------------------- */}

        {isExplore && (
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              onWishlistToggle?.(id);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/50"
          >
            <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          </button>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Thumbnail CTA                                                     */}
        {/* ---------------------------------------------------------------- */}

        <Link
          to={href}
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-900 shadow-md transition hover:bg-slate-50"
        >
          {isExplore ? (
            <>
              View Course
              <ArrowRight size={14} />
            </>
          ) : (
            <>
              <Play size={13} fill="currentColor" />

              {isCompleted ? "Review Course" : "Continue Learning"}

              <ArrowRight size={14} />
            </>
          )}
        </Link>
      </div>

      {/* ================================================================== */}
      {/* CARD CONTENT                                                        */}
      {/* ================================================================== */}

      <div className="flex flex-1 flex-col p-4">
        {/* ---------------------------------------------------------------- */}
        {/* Title + Description                                               */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <h3 className="truncate text-[15px] font-extrabold leading-5 text-slate-950">{title}</h3>

          {description && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{description}</p>}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Instructor                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
            {instructorAvatar ? <img src={instructorAvatar} alt={instructorName ?? "Instructor"} className="h-full w-full object-cover" /> : (instructorName?.[0] ?? "Y").toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">Instructor</p>

            <p className="truncate text-xs font-semibold text-slate-800">{instructorName ?? "Instructor"}</p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Category + Language                                               */}
        {/* ---------------------------------------------------------------- */}

        {isExplore && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {category && (
              <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] font-medium text-slate-600">
                <BookOpen size={12} className="shrink-0" />

                <span className="truncate">{category}</span>
              </div>
            )}

            {language && (
              <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] font-medium text-slate-600">
                <Globe size={12} className="shrink-0" />

                <span className="truncate">{language}</span>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* EXPLORE VARIANT                                                    */}
        {/* ================================================================== */}

        {isExplore && (
          <div className="mt-3">
            {/* ------------------------------------------------------------ */}
            {/* Level + Price                                                 */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {formattedLevel && (
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-slate-500" />

                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold capitalize text-emerald-600">{formattedLevel}</span>
                  </div>
                )}
              </div>

              {priceLabel && <p className="text-sm font-extrabold text-slate-900">{priceLabel}</p>}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Divider                                                        */}
            {/* ------------------------------------------------------------ */}

            <div className="my-3 border-t border-slate-100" />

            {/* ------------------------------------------------------------ */}
            {/* Rating + Students                                              */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center justify-between gap-3">
              {/* Rating */}
              <div className="flex min-w-0 items-center gap-1.5">
                <Star size={13} className="shrink-0 fill-amber-400 text-amber-400" />

                {rating != null ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-700">{rating.toFixed(1)}</span>

                    {reviewCount != null && <span className="text-[10px] text-slate-400">({formatNumber(reviewCount)})</span>}
                  </>
                ) : (
                  <span className="text-[10px] text-slate-400">No ratings yet</span>
                )}
              </div>

              {/* Students */}
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <Users size={13} />

                <span>{formatNumber(studentsCount ?? 0)} students</span>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Divider                                                        */}
            {/* ------------------------------------------------------------ */}

            <div className="my-3 border-t border-slate-100" />
          </div>
        )}

        {/* ================================================================== */}
        {/* ENROLLED VARIANT                                                   */}
        {/* ================================================================== */}

        {!isExplore && (
          <div className="mt-4">
            {/* ------------------------------------------------------------ */}
            {/* Progress heading                                               */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500">{completedLessons != null && totalLessons != null ? `${completedLessons} / ${totalLessons} lessons` : "Course progress"}</span>

              <span className="text-[11px] font-extrabold text-slate-700">{courseProgress}%</span>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Progress bar                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
                style={{
                  width: `${courseProgress}%`,
                }}
              />
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Last watched lesson                                            */}
            {/* ------------------------------------------------------------ */}

            {lastWatchedLesson && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <Play size={13} fill="currentColor" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Last watched</p>

                    <p className="mt-0.5 truncate text-[11px] font-bold text-slate-800">{lastWatchedLesson}</p>

                    {lastWatchedAt && <p className="mt-0.5 text-[10px] text-slate-400">{lastWatchedAt}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* BOTTOM FULL-WIDTH CTA                                              */}
        {/* ================================================================== */}

        <div className="mt-auto pt-4">
          <Link to={href} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700">
            {isExplore ? (
              <>
                View Course
                <ArrowRight size={15} />
              </>
            ) : (
              <>
                {isCompleted ? "Review Course" : "Continue Learning"}

                <ArrowRight size={15} />
              </>
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
