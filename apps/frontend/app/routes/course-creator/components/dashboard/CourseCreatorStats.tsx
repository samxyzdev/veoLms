// app/routes/admin/components/dashboard/AdminStats.tsx

import {
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import { adminData } from "../../data/adminData";

const iconMap = {
  Users,
  BookOpen,
  GraduationCap,
  CircleDollarSign,
};

const iconStyles = {
  purple: "bg-indigo-50 text-indigo-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-500",
};

export function CourseCreatorStats() {
  return (
    <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminData.stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];

        const iconStyle = iconStyles[stat.color as keyof typeof iconStyles];

        return (
          <article
            key={stat.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
              >
                <Icon size={22} />
              </div>

              {/* Mini sparkline */}
              <div className="hidden h-12 w-24 items-end gap-1 sm:flex">
                {[25, 38, 31, 55, 43, 70, 58].map((height, index) => (
                  <span
                    key={index}
                    className="w-2 rounded-t-full bg-indigo-200"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              {stat.title}
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-950">
                {stat.value}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
              <TrendingUp size={13} className="text-emerald-500" />

              <span className="font-bold text-emerald-500">{stat.change}</span>

              <span className="text-slate-400">{stat.description}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
