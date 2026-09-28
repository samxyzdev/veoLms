import { Archive, BookOpen, ChevronDown, FileEdit, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import { useEffect, useState } from "react";

export function CourseSidebar() {
  const location = useLocation();

  const isCourseRoute =
    location.pathname === "/admin/courses" ||
    location.pathname === "/admin/courses/new" ||
    location.pathname === "/admin/courses/drafts" ||
    location.pathname === "/admin/courses/archived";

  const [isOpen, setIsOpen] = useState(isCourseRoute);

  // Route change hone par Courses open rahe
  useEffect(() => {
    if (isCourseRoute) {
      setIsOpen(true);
    }
  }, [isCourseRoute]);

  return (
    <div>
      {/* Courses Parent */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          group flex w-full items-center gap-3 rounded-xl px-3 py-3
          text-sm font-semibold transition-all
          ${
            isCourseRoute
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }
        `}
      >
        <BookOpen size={19} strokeWidth={isCourseRoute ? 2.4 : 1.9} />

        <span className="flex-1 text-left">Courses</span>

        <ChevronDown
          size={16}
          className={`
            transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Submenu */}
      <div
        className={`
          grid transition-all duration-200
          ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="relative ml-[22px] mt-1 space-y-1 border-l border-slate-200 pl-4">
            {/* All Courses */}
            <NavLink
              to="/admin/courses"
              end
              className={({ isActive }) =>
                `
                relative flex items-center gap-2 rounded-lg px-3 py-2.5
                text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      absolute -left-[21px] h-2 w-2 rounded-full
                      ${isActive ? "bg-indigo-600" : "bg-slate-300"}
                    `}
                  />

                  <BookOpen size={15} />

                  <span>All Courses</span>
                </>
              )}
            </NavLink>

            {/* Create Course */}
            <NavLink
              to="/admin/courses/new"
              className={({ isActive }) =>
                `
                relative flex items-center gap-2 rounded-lg px-3 py-2.5
                text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      absolute -left-[21px] h-2 w-2 rounded-full
                      ${isActive ? "bg-indigo-600" : "bg-slate-300"}
                    `}
                  />

                  <Plus size={15} />

                  <span>Create Course</span>
                </>
              )}
            </NavLink>

            {/* Drafts */}
            <NavLink
              to="/admin/courses/drafts"
              className={({ isActive }) =>
                `
                relative flex items-center gap-2 rounded-lg px-3 py-2.5
                text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      absolute -left-[21px] h-2 w-2 rounded-full
                      ${isActive ? "bg-indigo-600" : "bg-slate-300"}
                    `}
                  />

                  <FileEdit size={15} />

                  <span>Drafts</span>

                  <span className="ml-auto rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">
                    4
                  </span>
                </>
              )}
            </NavLink>

            {/* Archived */}
            <NavLink
              to="/admin/courses/archived"
              className={({ isActive }) =>
                `
                relative flex items-center gap-2 rounded-lg px-3 py-2.5
                text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      absolute -left-[21px] h-2 w-2 rounded-full
                      ${isActive ? "bg-indigo-600" : "bg-slate-300"}
                    `}
                  />

                  <Archive size={15} />

                  <span>Archived</span>

                  <span className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                    2
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
