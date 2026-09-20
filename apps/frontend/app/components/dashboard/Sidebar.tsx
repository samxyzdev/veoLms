import { useEffect, useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

import type { MeResponse } from "../../lib/api";
import { getInitials } from "../../lib/format";
import {
  BookOpenIcon,
  CompassIcon,
  GraduationCapIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  XIcon,
} from "../landing/icons";

export type NavItem = {
  label: string;
  icon: ReactNode;
  /** Internal route (e.g. /dashboard/my-courses). */
  to: string;
};

/* ------------------------------------------------------------------ */
/* 👈 Edit the sidebar links here                                      */
/* ------------------------------------------------------------------ */

const UPGRADE_DISMISSED_KEY = "learnova.upgradePromoDismissed";

/**
 * Layout effect on the client (runs before paint, so the dismissed upgrade
 * card never flashes back in during navigation), plain effect on the server
 * where layout effects can't run.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <HomeIcon className="size-4.5" />, to: "/dashboard" },
  { label: "My Courses", icon: <BookOpenIcon className="size-4.5" />, to: "/dashboard/my-courses" },
  { label: "Explore", icon: <CompassIcon className="size-4.5" />, to: "/dashboard/explore" },
  { label: "Settings", icon: <SettingsIcon className="size-4.5" />, to: "/dashboard/settings" },
];

export function Sidebar({
  user,
  onNavigate,
  nav,
}: {
  /** Logged-in user from /user/me, shown in the footer card. */
  user?: MeResponse | null;
  onNavigate?: () => void;
  /** Override the nav items (e.g. admin panel). Defaults to the user nav. */
  nav?: NavItem[];
}) {
  const initials = user ? getInitials(user.name) : "";
  // The upgrade card can be dismissed with its close button. The choice is
  // remembered, so it stays hidden on other pages and after a reload.
  const [showUpgrade, setShowUpgrade] = useState(true);

  useIsomorphicLayoutEffect(() => {
    try {
      if (window.localStorage.getItem(UPGRADE_DISMISSED_KEY) === "1") {
        setShowUpgrade(false);
      }
    } catch {
      // Storage may be unavailable (e.g. private mode) — keep it visible.
    }
  }, []);

  function dismissUpgrade() {
    setShowUpgrade(false);
    try {
      window.localStorage.setItem(UPGRADE_DISMISSED_KEY, "1");
    } catch {
      // Storage may be unavailable — still dismissed for this session.
    }
  }
  // Admins get an extra link to the admin panel.
  const items =
    nav ??
    (user?.role === "admin"
      ? [...mainNav, { label: "Admin Panel", icon: <ShieldIcon className="size-4.5" />, to: "/admin" }]
      : mainNav);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-4 pt-6">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-ink">
          <GraduationCapIcon className="size-5 text-brand-light" />
        </span>
        <span className="text-lg font-bold text-white">Learnova</span>
      </Link>

      {/* Upgrade card */}
      {showUpgrade && (
        <div className="relative mx-3 mt-6 rounded-xl bg-brand p-4">
          <button
            type="button"
            onClick={dismissUpgrade}
            aria-label="Close upgrade banner"
            className="absolute right-2.5 top-2.5 rounded-md p-1 text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            <XIcon className="size-4" />
          </button>
          <SparklesIcon className="size-5 text-white/90" />
          <p className="mt-3 text-sm font-semibold text-white">Upgrade to Pro</p>
          <p className="mt-1 text-xs leading-relaxed text-white/80">
            Unlock all courses, certificates &amp; 1-on-1 mentoring.
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
          >
            Learn more
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        <SidebarSection title="Main Menu" items={items} onNavigate={onNavigate} />
      </nav>

      {/* User card + logout */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {initials || "…"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "Loading…"}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email ?? ""}</p>
          </div>
          <Link
            to="/"
            onClick={onNavigate}
            aria-label="Log out"
            className="rounded-md p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOutIcon className="size-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  // Highlight only the best match: the deepest item whose path the current
  // URL sits under, so /dashboard doesn't stay active on /dashboard/settings.
  const activeTo = items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .reduce<string | undefined>(
      (best, item) => (!best || item.to.length > best.length ? item.to : best),
      undefined,
    );

  return (
    <div className="mt-5">
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</p>
      <div className="mt-2 space-y-1">
        {items.map((item) => {
          const isActive = item.to === activeTo;
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand/15 text-white"
                  : "text-gray-400 hover:bg-surface hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}