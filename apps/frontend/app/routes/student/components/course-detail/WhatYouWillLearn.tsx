import { Check } from "lucide-react";

type LearningOutcome = {
  id: string;
  text: string;
  sequenceOrder: number;
};

type Props = {
  outcomes: LearningOutcome[];
};

export function WhatYouWillLearn({ outcomes }: Props) {
  if (!outcomes.length) {
    return null;
  }

  const sortedOutcomes = [...outcomes].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">What you'll learn</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sortedOutcomes.map((outcome) => (
          <div key={outcome.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Check size={12} className="text-emerald-600" />
            </div>

            <p className="text-sm leading-5 text-slate-600">{outcome.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
