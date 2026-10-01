import { Heart, Star } from "lucide-react";

export interface ExploreCourse {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  categoryId: string;
  level: string;
  duration: string;
  rating: number;
  students: string;
  badge: string | null;
  thumbnail: string;
}

interface ExploreCourseCardProps {
  course: ExploreCourse;
}

const thumbnailStyles: Record<string, string> = {
  react: "from-slate-950 via-indigo-950 to-cyan-500",

  node: "from-slate-950 via-emerald-950 to-green-500",

  html: "from-orange-500 via-red-500 to-blue-500",

  typescript: "from-blue-700 via-blue-600 to-cyan-400",

  nextjs: "from-black via-slate-900 to-slate-700",

  design: "from-pink-500 via-purple-500 to-orange-400",

  javascript: "from-yellow-400 via-yellow-500 to-orange-500",

  git: "from-orange-500 via-red-600 to-slate-900",
};

const thumbnailText: Record<string, React.ReactNode> = {
  react: <span className="text-5xl text-cyan-300">⚛</span>,

  node: (
    <span className="text-3xl font-extrabold tracking-wide text-white">
      node
      <span className="ml-1 text-sm text-green-300">JS</span>
    </span>
  ),

  html: (
    <div className="flex items-center gap-3">
      <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">
        5
      </span>

      <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">
        3
      </span>
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
};

export function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  const gradient =
    thumbnailStyles[course.thumbnail] ?? "from-indigo-500 to-violet-500";

  const content = thumbnailText[course.thumbnail] ?? thumbnailText.react;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Thumbnail */}
      <div
        className={`relative h-[138px] overflow-hidden bg-gradient-to-br ${gradient}`}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10" />

        <div className="absolute -bottom-12 left-8 h-28 w-28 rounded-full border border-white/10" />

        <div className="relative flex h-full items-center justify-center">
          {content}
        </div>

        {/* Badge */}
        {course.badge && (
          <span
            className={`
              absolute left-3 top-3 rounded-lg px-2.5 py-1.5
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

        {/* Duration */}
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
          {course.duration}
        </span>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${course.title} to wishlist`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-red-500"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Course title */}
        <h3 className="line-clamp-1 text-sm font-extrabold text-slate-950">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 min-h-[32px] text-[11px] leading-4 text-slate-500">
          {course.description}
        </p>

        {/* Instructor + rating */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[7px] font-bold text-slate-600">
              {course.instructor
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <span className="truncate text-[10px] font-medium text-slate-600">
              {course.instructor}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />

            <span className="text-[10px] font-bold text-slate-700">
              {course.rating}
            </span>

            <span className="text-[9px] text-slate-400">
              ({course.students})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[9px] font-semibold text-indigo-600">
            {course.category}
          </span>

          <span
            className={`
              rounded-lg px-2 py-1 text-[9px] font-semibold
              ${
                course.level === "Advanced"
                  ? "bg-red-50 text-red-500"
                  : course.level === "Intermediate"
                    ? "bg-violet-50 text-violet-600"
                    : "bg-emerald-50 text-emerald-600"
              }
            `}
          >
            {course.level}
          </span>
        </div>
      </div>
    </article>
  );
}
