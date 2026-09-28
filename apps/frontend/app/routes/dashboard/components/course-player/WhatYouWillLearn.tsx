import { CheckCircle2, Target } from "lucide-react";

type WhatYouWillLearnProps = {
  items: string[];
};

export function WhatYouWillLearn({ items }: WhatYouWillLearnProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Target className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">
            What you'll learn
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
