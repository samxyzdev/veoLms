import {
  BarChart3,
  Bell,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";

import { CourseSidebar } from "./CourseSidebar";

const adminNavigation = [
  {
    id: 1,
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: 3,
    label: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    id: 4,
    label: "Instructors",
    href: "/admin/instructors",
    icon: UserRound,
  },
  {
    id: 5,
    label: "Enrollments",
    href: "/admin/enrollments",
    icon: GraduationCap,
  },
  {
    id: 6,
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    id: 7,
    label: "Assignments",
    href: "/admin/assignments",
    icon: ClipboardList,
  },
  {
    id: 8,
    label: "Certificates",
    href: "/admin/certificates",
    icon: ShieldCheck,
  },
  {
    id: 9,
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    id: 10,
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    id: 11,
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-[76px] items-center border-b border-slate-100 px-5">
        <NavLink to="/admin" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <GraduationCap size={21} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            Learnly
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Administration
        </p>

        <div className="space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={19} strokeWidth={isActive ? 2.4 : 1.9} />

                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          {/* Courses - Collapsible */}
          <CourseSidebar />

          {/* Other navigation */}
          {adminNavigation
            .filter((item) => item.id !== 1)
            .map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />

                      <span>{item.label}</span>

                      {item.label === "Notifications" && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
                          3
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
        </div>
      </nav>

      {/* Upgrade Card */}
      <div className="m-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-blue-50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
          <span className="text-base">♛</span>
        </div>

        <h3 className="mt-3 text-sm font-extrabold text-slate-900">
          Upgrade to Pro
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Get advanced analytics and more features.
        </p>

        <button
          type="button"
          className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white transition hover:bg-indigo-700"
        >
          Go Pro →
        </button>
      </div>
    </aside>
  );
}
