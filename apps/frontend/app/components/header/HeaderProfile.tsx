import {
  ChevronDown,
  GraduationCap,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";

import type { HeaderMode, HeaderUser } from "./types";

type HeaderProfileProps = {
  user: HeaderUser;
  mode: HeaderMode;
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

function getRoleLabel(mode: HeaderMode) {
  switch (mode) {
    case "course_creator":
      return "Course Creator";

    case "admin":
      return "Admin";

    default:
      return "Student";
  }
}

export function HeaderProfile({ user, mode }: HeaderProfileProps) {
  console.log(user);

  const [profileOpen, setProfileOpen] = useState(false);

  const initials = getInitials(user.name);
  const roleLabel = getRoleLabel(mode);

  const isStudent = user.roles.includes("student");
  const isCourseCreator = user.roles.includes("course_creator");
  const isAdmin = user.roles.includes("admin");

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setProfileOpen((prev) => !prev)}
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
          {initials}
        </div>

        {/* Name + Role */}
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

      {/* Dropdown */}
      {profileOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50"
        >
          {/* Profile Summary */}
          <div className="mb-1 rounded-xl px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.name}
                </p>

                <p className="truncate text-xs text-slate-400">{user.email}</p>

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

            {/* Student -> Become Course Creator */}
            {isStudent && !isCourseCreator && !isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                <GraduationCap
                  size={17}
                  className="transition-colors group-hover:text-indigo-600"
                />

                <span>Become a Course Creator</span>
              </button>
            )}

            {/* Course Creator Dashboard */}
            {isCourseCreator && mode === "student" && (
              <Link
                to="/course-creator"
                onClick={() => setProfileOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                <GraduationCap
                  size={17}
                  className="transition-colors group-hover:text-indigo-600"
                />

                <span>Course Creator Dashboard</span>
              </Link>
            )}

            <div className="my-1 border-t border-slate-100" />

            {/* Sign Out */}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);

                // logout api here
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
  );
}
