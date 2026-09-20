import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CodeIcon,
  MegaphoneIcon,
  PaletteIcon,
  UsersIcon,
} from "./icons";

type Category = {
  name: string;
  count: string;
  icon: ReactNode;
};

const categories: Category[] = [
  { name: "Development", count: "1,245", icon: <CodeIcon className="size-6" /> },
  { name: "Design", count: "832", icon: <PaletteIcon className="size-6" /> },
  { name: "Marketing", count: "723", icon: <MegaphoneIcon className="size-6" /> },
  { name: "Business", count: "645", icon: <BriefcaseIcon className="size-6" /> },
  { name: "Data Science", count: "514", icon: <ChartBarIcon className="size-6" /> },
  { name: "Personal Growth", count: "432", icon: <UsersIcon className="size-6" /> },
];

export function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-white lg:text-3xl">Categories</h2>
        <a
          href="#featured-courses"
          className="flex items-center gap-1.5 text-sm font-medium text-brand-light transition hover:text-white"
        >
          View all categories
          <ArrowRightIcon className="size-4" />
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <a
            key={category.name}
            href="#featured-courses"
            className="rounded-xl border border-line bg-surface p-5 text-center transition hover:border-brand/50"
          >
            <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-brand-ink text-brand-light">
              {category.icon}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-white">
              {category.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{category.count} Courses</p>
          </a>
        ))}
      </div>
    </section>
  );
}