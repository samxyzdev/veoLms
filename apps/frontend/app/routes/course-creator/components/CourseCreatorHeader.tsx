import { Bell, CalendarDays, ChevronDown, Search } from "lucide-react";

type CourseCreatorUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type CourseCreatorHeaderProps = {
  courseCreator: CourseCreatorUser;
};

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A"
  );
}

export function CourseCreatorHeader({
  courseCreator,
}: CourseCreatorHeaderProps) {
  const initials = getInitials(courseCreator.name);

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-extrabold">L</span>
          </div>

          <span className="text-sm font-extrabold text-slate-900">Learnly</span>
        </div>

        {/* Search */}
        <div className="hidden flex-1 md:flex">
          <div className="flex h-11 w-full max-w-[390px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Search size={17} className="shrink-0 text-slate-400" />

            <input
              type="text"
              placeholder="Search students, courses, or anything..."
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />

            <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-400 xl:block">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Date */}
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
          >
            <CalendarDays size={16} className="text-slate-500" />

            <span>Sep 2026</span>

            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-600">
              {initials}
            </div>

            {/* User info */}
            <div className="hidden text-left sm:block">
              <p className="text-xs font-extrabold text-slate-900">
                {courseCreator.name}
              </p>

              <p className="text-[10px] text-slate-400">Course Creator</p>
            </div>

            <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
