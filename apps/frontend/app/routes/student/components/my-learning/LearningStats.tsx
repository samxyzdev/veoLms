import { BookOpen, CircleCheck, Clock3, PlayCircle } from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

const iconMap = {
  BookOpen,
  PlayCircle,
  CircleCheck,
  Clock3,
};

const iconStyles = {
  purple: "bg-indigo-50 text-indigo-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-500",
};

export function LearningStats() {
  return (
    <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardData.myLearning.stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];

        const style = iconStyles[stat.iconStyle as keyof typeof iconStyles];

        return (
          <article
            key={stat.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${style}`}
            >
              <Icon size={20} />
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              {stat.title}
            </p>

            <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              {stat.value}
            </p>
          </article>
        );
      })}
    </section>
  );
}
