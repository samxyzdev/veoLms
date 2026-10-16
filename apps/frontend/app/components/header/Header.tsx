import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderCart } from "./HeaderCart";
import { HeaderProfile } from "./HeaderProfile";
import { HeaderSearch } from "./HeaderSearch";

import type { HeaderProps } from "./types";

export function Header({
  user,
  mode,
  searchPlaceholder,
  sidebarCollapsed = false,
  mobileSidebarOpen = false,
  onSidebarToggle,
  onMobileSidebarToggle,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-100 bg-white  ">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          {onMobileSidebarToggle && (
            <button
              type="button"
              aria-label={mobileSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-controls="dashboard-sidebar"
              aria-expanded={mobileSidebarOpen}
              onClick={onMobileSidebarToggle}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-extrabold">L</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900">Learnly</span>
        </div>
        {onSidebarToggle && (
          <button
            type="button"
            aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            aria-controls="dashboard-sidebar"
            aria-expanded={!sidebarCollapsed}
            onClick={onSidebarToggle}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:flex"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        )}
        {/* Search */}
        <HeaderSearch placeholder={searchPlaceholder} />
        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 ">
          {/* Date */}
          {/* <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
          >
            <CalendarDays size={16} className="text-slate-500" />
            <span>Oct 2026</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button> */}
          {/* Notifications */}
          {mode === "student" && <HeaderCart />}
          <HeaderNotifications />
          {/* Profile */}
          <HeaderProfile user={user} mode={mode} />
        </div>
      </div>
    </header>
  );
}
