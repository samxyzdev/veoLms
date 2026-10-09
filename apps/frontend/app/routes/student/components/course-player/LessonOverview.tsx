import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { WhatYouWillLearn } from "./WhatYouWillLearn";
import type { PlayerLesson } from "./types";

type LessonOverviewProps = {
  lesson: PlayerLesson;
  outcomes: string[];
};

export function LessonOverview({ lesson, outcomes }: LessonOverviewProps) {
  const [expanded, setExpanded] = useState(false);
  const description = lesson.description || "Follow along with this lesson and continue through the course content at your own pace.";

  return (
    <section className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:px-4.5">
      <p className={`text-xs leading-5 text-slate-600 sm:text-[13px] ${expanded ? "" : "line-clamp-2"}`}>{description}</p>
      {expanded && outcomes.length > 0 && <div className="mt-4 border-t border-slate-100 pt-4"><WhatYouWillLearn outcomes={outcomes} /></div>}
      {(description.length > 150 || outcomes.length > 0) && (
        <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
          {expanded ? "Show less" : "Show more"}{expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}
    </section>
  );
}
