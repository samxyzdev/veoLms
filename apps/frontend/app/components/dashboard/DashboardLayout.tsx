import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import type { MeResponse } from "../../lib/api";
import { GraduationCapIcon, MenuIcon, XIcon } from "../landing/icons";
import { Sidebar } from "./Sidebar";

export type { NavItem } from "./Sidebar";

/**
 * Dashboard shell: a fixed sidebar on desktop, and a slide-in
 * sidebar (opened from the hamburger) on mobile.
 */
export function DashboardLayout({
  children,
  user,
  nav,
}: {
  children: ReactNode;
  /** Logged-in user from /user/me — shown in the sidebar user card. */
  user?: MeResponse | null;
  /** Override sidebar nav items (e.g. the admin panel). */
  nav?: React.ComponentProps<typeof Sidebar>["nav"];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base text-gray-300">
      {/* Mobile top bar */}
      <div className="flex h-16 items-center justify-between border-b border-line px-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-ink">
            <GraduationCapIcon className="size-4.5 text-brand-light" />
          </span>
          <span className="font-bold text-white">Learnova</span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-gray-300 transition hover:text-white"
        >
          {sidebarOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {/* Sidebar (desktop: always visible; mobile: overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-base transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar user={user} nav={nav} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Click-away backdrop on mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}