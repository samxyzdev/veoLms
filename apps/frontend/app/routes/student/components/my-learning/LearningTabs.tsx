import { SlidersHorizontal } from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

export type LearningTab = "all" | "in-progress" | "completed" | "not-started";

interface LearningTabsProps {
  activeTab: LearningTab;
  sortBy: string;
  onTabChange: (tab: LearningTab) => void;
  onSortChange: (value: string) => void;
}

export function LearningTabs({
  activeTab,
  sortBy,
  onTabChange,
  onSortChange,
}: LearningTabsProps) {
  return (
    <section className="mb-5 flex flex-col gap-3 border-b border-slate-200 lg:flex-row lg:items-end lg:justify-between">
      {/* Tabs */}
      <div className="flex min-w-0 ">
        {dashboardData.myLearning.tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as LearningTab)}
              className={`
                relative shrink-0 px-4 pb-3 pt-2
                text-sm font-semibold transition
                ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              {tab.label}

              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 pb-2">
        {/* <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button> */}

        <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
          <span className="mr-1 text-xs text-slate-500">Sort by:</span>

          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="progress-high">Progress: High</option>
            <option value="progress-low">Progress: Low</option>
          </select>
        </div>
      </div>
    </section>
  );
}
