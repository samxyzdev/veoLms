import { useState } from "react";

const tabs = [
  {
    label: "Overview",
    href: "#overview",
  },
  {
    label: "Course Content",
    href: "#course-content",
  },
  {
    label: "What You’ll Learn",
    href: "#what-you-will-learn",
  },
  {
    label: "Instructor",
    href: "#instructor",
  },
  {
    label: "Reviews",
    href: "#reviews",
  },
  {
    label: "FAQs",
    href: "#faqs",
  },
];

export function CourseDetailTabs() {
  const [activeTab, setActiveTab] = useState("#overview");

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-1 sm:px-7 lg:px-10">
      <nav aria-label="Course details" className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-12 items-center gap-7 overflow-x-auto px-4 sm:px-7">
          {tabs.map((tab) => {
            const active = activeTab === tab.href;
            return (
              <a
                key={tab.href}
                href={tab.href}
                onClick={() => setActiveTab(tab.href)}
                aria-current={active ? "location" : undefined}
                className={`relative flex h-full shrink-0 items-center text-xs font-semibold transition-colors ${active ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
              >
                {tab.label}
                {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
