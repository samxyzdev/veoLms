import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";

import type { SidebarItem } from "./types";

type SidebarNavigationProps = {
  navigation: SidebarItem[];
};

function SidebarNavItem({ item }: { item: SidebarItem }) {
  const location = useLocation();

  const hasChildren = Boolean(item.children?.length);

  const isParentActive =
    location.pathname === item.href ||
    location.pathname.startsWith(`${item.href}/`);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isParentActive && hasChildren) {
      setOpen(true);
    }
  }, [isParentActive, hasChildren]);

  /*
   * Parent item with subsections
   */
  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={[
            "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all",
            isParentActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          <item.icon size={19} strokeWidth={isParentActive ? 2.4 : 1.9} />

          <span>{item.label}</span>

          {/* Arrow = visual hint only */}
          <ChevronDown
            size={16}
            className={[
              "pointer-events-none ml-auto shrink-0 text-slate-400 transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* Subsections */}
        {open && (
          <div className="relative ml-6 mt-1 space-y-1 pl-4">
            {/* Vertical line */}
            <div className="absolute bottom-2 left-0 top-2 w-px bg-slate-200" />

            {item.children!.map((child) => (
              <NavLink
                key={child.id}
                to={child.href}
                end
                className={({ isActive }) =>
                  [
                    "group relative flex items-center rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Dot */}
                    <span
                      className={[
                        "absolute -left-[18px] h-1.5 w-1.5 rounded-full",
                        isActive
                          ? "bg-indigo-600"
                          : "bg-slate-300 group-hover:bg-slate-500",
                      ].join(" ")}
                    />

                    <span>{child.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  /*
   * Normal item
   */
  return (
    <NavLink
      to={item.href}
      end={item.href === "/dashboard" || item.href === "/course-creator"}
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
          <item.icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />

          <span>{item.label}</span>

          {item.badge !== undefined && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function SidebarNavigation({ navigation }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        Workspace
      </p>

      <div className="space-y-1">
        {navigation.map((item) => (
          <SidebarNavItem key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
}
