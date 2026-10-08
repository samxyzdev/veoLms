import { Check } from "lucide-react";

type Props = {
  outcomes: string[];
};

export function WhatYouWillLearn({ outcomes }: Props) {
  return (
    <section id="what-you-will-learn" className="scroll-mt-16 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-6">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-950">What You’ll Learn</h2>

      {outcomes.length > 0 ? (
        <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {outcomes.map((outcome, index) => (
            <div key={`${index}-${outcome}`} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check size={11} strokeWidth={3} className="text-emerald-700" />
              </div>

              <p className="text-xs leading-5 text-slate-700">{outcome}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">Learning outcomes haven’t been added to this course yet.</p>
      )}
    </section>
  );
}
