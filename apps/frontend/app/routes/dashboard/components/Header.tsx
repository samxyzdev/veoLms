// app/routes/dashboard/components/Header.tsx

import {
  Bell,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  LogOut,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

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

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function getRoleLabel(role: User["role"]) {
  switch (role) {
    case "admin":
      return "Admin";

    case "course_creator":
      return "Course Creator";

    default:
      return "Student";
  }
}

export function Header({ user }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = getInitials(user.name);
  const roleLabel = getRoleLabel(user.role);

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
            <Search size={17} className="shrink-0 text-slate-400" />

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
            aria-label="Notifications"
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
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                {initials}
              </div>

              {/* Name + role */}
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>

                <p className="text-[10px] text-slate-400">{roleLabel}</p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50"
              >
                {/* Profile summary */}
                <div className="mb-1 rounded-xl px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>

                      <span className="mt-1 inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  {/* My Profile */}
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <UserRound
                      size={17}
                      className="text-slate-400 transition-colors group-hover:text-indigo-500"
                    />

                    <span>My Profile</span>
                  </Link>

                  {/* Settings */}
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Settings
                      size={17}
                      className="text-slate-400 transition-colors group-hover:text-indigo-500"
                    />

                    <span>Settings</span>
                  </Link>

                  {/* Become a Course Creator */}
                  {user.role === "user" && (
                    <Link
                      to="/dashboard/become-course-creator"
                      onClick={() => setProfileOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <GraduationCap
                        size={17}
                        className="transition-colors group-hover:text-indigo-600"
                      />

                      <span>Become a Course Creator</span>
                    </Link>
                  )}

                  {/* Help & Support */}
                  <Link
                    to="/dashboard/help"
                    onClick={() => setProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <CircleHelp
                      size={17}
                      className="text-slate-400 transition-colors group-hover:text-indigo-500"
                    />

                    <span>Help & Support</span>
                  </Link>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-100" />

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);

                      // Logout API
                      console.log("Logout");
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut
                      size={17}
                      className="text-red-500 transition-colors group-hover:text-red-600"
                    />

                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
