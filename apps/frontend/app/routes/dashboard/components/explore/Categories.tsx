import {
  BriefcaseBusiness,
  Code2,
  Database,
  LayoutGrid,
  Megaphone,
  Palette,
  UserRound,
  Wrench,
} from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

const iconMap = {
  LayoutGrid,
  Code2,
  Palette,
  BriefcaseBusiness,
  Megaphone,
  Database,
  UserRound,
  Wrench,
};

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Categories({
  activeCategory,
  onCategoryChange,
}: CategoriesProps) {
  return (
    <section className="mb-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dashboardData.explore.categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];

          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`
                  flex shrink-0 items-center gap-2 rounded-xl
                  border px-4 py-2.5 text-xs font-semibold
                  transition
                  ${
                    isActive
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  }
                `}
            >
              <Icon size={15} />

              {category.label}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
        >
          →
        </button>
      </div>
    </section>
  );
}
