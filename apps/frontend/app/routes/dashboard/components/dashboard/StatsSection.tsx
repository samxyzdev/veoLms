import { Clock3, Target, Trophy } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Clock3,
    title: "Learning time",
    value: "14h 32m",
    description: "this month",
    style: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    icon: Target,
    title: "Goal progress",
    value: "75%",
    description: "6 of 8 lessons",
    style: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Achievements",
    value: "12",
    description: "badges earned",
    style: "bg-amber-50 text-amber-600",
  },
];

export function StatsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
            >
              <Icon size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">{stat.title}</p>

              <p className="mt-1 text-xl font-extrabold text-slate-950">
                {stat.value}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
