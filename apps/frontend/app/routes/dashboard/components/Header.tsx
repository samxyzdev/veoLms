import { Bell, ChevronDown, LogOut, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { dashboardData } from "../data/dashboardData";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "course_creator" | "admin";
  createdAt: Date;
  updatedAt: Date;
};

type HeaderProps = {
  user: User;
};

export function Header({ user }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-bold">L</span>
          </div>

          <span className="font-bold text-slate-900">Learnly</span>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:flex">
          <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Search size={17} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search courses, lessons..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400 xl:block">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                {user.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>

                <p className="text-[10px] text-slate-400">Student</p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50">
                {/* User info */}
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

                {/* Settings */}
                <Link
                  to="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings size={17} className="text-slate-400" />

                  <span>Settings</span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);

                    // Logout API yahan call karna
                    console.log("Logout");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
