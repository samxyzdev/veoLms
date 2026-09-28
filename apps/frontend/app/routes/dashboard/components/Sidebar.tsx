import {
  Award,
  Bell,
  BookOpen,
  Compass,
  Heart,
  LayoutDashboard,
  Settings,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router";

import { dashboardData } from "../data/dashboardData";

const iconMap = {
  LayoutDashboard,
  BookOpen,
  Compass,
  Heart,
  Award,
  Trophy,
  Bell,
  Settings,
};

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-[76px] items-center border-b border-slate-100 px-5">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <BookOpen size={20} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            Learnly
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {dashboardData.navigation.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];

            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.href === "/dashboard"}
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
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
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

      {/* Upgrade card */}
      <div className="m-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <Trophy size={18} />
        </div>

        <h3 className="text-sm font-bold">Unlock more learning</h3>

        <p className="mt-1 text-xs leading-5 text-indigo-100">
          Get access to premium courses and advanced learning tools.
        </p>

        <button className="mt-4 h-9 w-full rounded-lg bg-white text-xs font-bold text-indigo-600 transition hover:bg-indigo-50">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}
