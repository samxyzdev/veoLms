import { useState } from "react";

type LessonTab = {
  id: string;
  label: string;
  count?: number;
};

type LessonTabsProps = {
  tabs: LessonTab[];
  children: React.ReactNode;
};

export function LessonTabs({ tabs, children }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  return (
    <div className="mt-5">
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 pb-3 text-sm font-medium transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}

                {tab.count !== undefined && (
                  <span className="ml-1 text-xs text-slate-400">
                    ({tab.count})
                  </span>
                )}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-5">
        {activeTab === "overview" && children}

        {activeTab === "resources" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Lesson Resources</h3>
            <p className="mt-1 text-sm text-slate-500">
              Download the resources attached to this lesson.
            </p>
          </div>
        )}

        {activeTab === "discussion" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Discussion</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ask questions and discuss this lesson with other students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
