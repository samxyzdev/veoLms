import { useState } from "react";
import { Link } from "react-router";

import {
  ArrowRightIcon,
  ChevronDownIcon,
  GraduationCapIcon,
  MenuIcon,
  XIcon,
} from "./icons";

const navLinks = [
  { label: "Explore", href: "#featured-courses" },
  { label: "Categories", href: "#categories", chevron: true },
  { label: "Instructors", href: "#instructors" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#pricing" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-ink">
            <GraduationCapIcon className="size-5 text-brand-light" />
          </span>
          <span className="text-lg font-bold text-white">Learnova</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition hover:text-white"
            >
              {link.label}
              {link.chevron && <ChevronDownIcon className="size-3.5" />}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Get Started
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md p-2 text-gray-300 transition hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-base px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-300"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-5 border-t border-line pt-4">
              <Link to="/login" className="text-sm font-medium text-gray-300">
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}