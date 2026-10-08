import { useState } from "react";

const tabs = [
  { label: "Overview", href: "#overview" },
  { label: "Course Content", href: "#course-content" },
  { label: "What You’ll Learn", href: "#what-you-will-learn" },
  { label: "Instructor", href: "#instructor" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQs", href: "#faqs" },
];

export function CourseDetailTabs() {
  const [activeTab, setActiveTab] = useState("#overview");

  return (
    <nav aria-label="Course details" className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] gap-7 overflow-x-auto px-4 sm:px-7 lg:px-10">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            onClick={() => setActiveTab(tab.href)}
            aria-current={activeTab === tab.href ? "location" : undefined}
            className={`relative flex h-12 shrink-0 items-center text-xs font-semibold transition-colors hover:text-indigo-600 ${activeTab === tab.href ? "text-indigo-600" : "text-slate-600"}`}
          >
            {tab.label}
            {activeTab === tab.href && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />}
          </a>
        ))}
      </div>
    </nav>
  );
}
