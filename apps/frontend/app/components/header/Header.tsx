import { CalendarDays, ChevronDown } from "lucide-react";

import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderProfile } from "./HeaderProfile";
import { HeaderSearch } from "./HeaderSearch";

import type { HeaderProps } from "./types";

export function Header({ user, mode, searchPlaceholder }: HeaderProps) {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-extrabold">L</span>
          </div>

          <span className="text-sm font-extrabold text-slate-900">Learnly</span>
        </div>

        {/* Search */}
        <HeaderSearch placeholder={searchPlaceholder} />

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Date */}
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
          >
            <CalendarDays size={16} className="text-slate-500" />

            <span>Oct 2026</span>

            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Notifications */}
          <HeaderNotifications />

          {/* Profile */}
          <HeaderProfile user={user} mode={mode} />
        </div>
      </div>
    </header>
  );
}
