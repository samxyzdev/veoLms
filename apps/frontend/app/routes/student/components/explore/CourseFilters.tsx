import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

interface CourseFiltersProps {
  search: string;
  level: string;
  duration: string;
  rating: string;
  sortBy: string;

  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function CourseFilters({
  search,
  level,
  duration,
  rating,
  sortBy,
  onSearchChange,
  onLevelChange,
  onDurationChange,
  onRatingChange,
  onSortChange,
}: CourseFiltersProps) {
  const filters = dashboardData.explore.filters;

  return (
    <section className="mb-5">
      <div className="flex flex-col gap-2 lg:flex-row">
        {/* Search */}
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
          <Search size={17} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search courses by title, category, or instructor..."
            className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Level */}
        <div className="relative">
          <select
            value={level}
            onChange={(event) => onLevelChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-semibold text-slate-700 outline-none shadow-sm sm:w-[130px]"
          >
            {filters.levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Duration */}
        <div className="relative">
          <select
            value={duration}
            onChange={(event) => onDurationChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-semibold text-slate-700 outline-none shadow-sm sm:w-[130px]"
          >
            {filters.durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Rating */}
        <div className="relative">
          <select
            value={rating}
            onChange={(event) => onRatingChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-semibold text-slate-700 outline-none shadow-sm sm:w-[120px]"
          >
            {filters.ratings.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-semibold text-slate-700 outline-none shadow-sm sm:w-[145px]"
          >
            {filters.sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                Sort by: {item.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Mobile/desktop filter indication */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Find the right course for your goals.
        </p>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 lg:hidden"
        >
          <SlidersHorizontal size={14} />
          More Filters
        </button>
      </div>
    </section>
  );
}
