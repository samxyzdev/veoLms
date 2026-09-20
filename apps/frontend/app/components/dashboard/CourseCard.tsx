import type { ReactNode } from "react";

import { GraduationCapIcon } from "../landing/icons";

/**
 * Shared course card used on Explore (with a buy button) and My Courses
 * (with a "Purchased" badge). Pass the price already formatted via `price`.
 */
export function CourseCard({
  title,
  description,
  language,
  price,
  children,
}: {
  title: string;
  description?: string | null;
  language: string;
  price: string;
  /** Action slot, e.g. a buy button or status badge. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface p-5 transition hover:border-brand/40">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-ink">
          <GraduationCapIcon className="size-5 text-brand-light" />
        </span>
        <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-light">
          {language}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-gray-500">
        {description || "No description yet."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-white">{price}</span>
        {children}
      </div>
    </div>
  );
}