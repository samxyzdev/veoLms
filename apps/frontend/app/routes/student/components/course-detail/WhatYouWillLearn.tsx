import { Check } from "lucide-react";

type Props = {
  outcomes: string[];
};

export function WhatYouWillLearn({ outcomes }: Props) {
  const hasOutcomes = outcomes.length > 0;

  return (
    <section id="what-you-will-learn" className="scroll-mt-16 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-950">What You’ll Learn</h2>

      {hasOutcomes ? (
        <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {outcomes.map((outcome, index) => (
            <div key={`${index}-${outcome}`} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check size={11} strokeWidth={3} className="text-emerald-700" />
              </div>

              <p className="text-xs leading-5 text-slate-700">{outcome || "Learning outcome unavailable."}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-5 text-center">
          <p className="text-xs font-semibold text-slate-600">No learning outcomes yet.</p>

          <p className="mt-1 text-[11px] text-slate-400">Learning outcomes will appear here when the instructor adds them.</p>
        </div>
      )}
    </section>
  );
}
