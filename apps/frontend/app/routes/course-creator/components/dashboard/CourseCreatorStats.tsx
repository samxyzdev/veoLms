import { BookOpen, CircleDollarSign, GraduationCap, Users } from "lucide-react";

import { useOutletContext } from "react-router";

type CourseCreatorStatsData = {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStatsData;
};

const statConfig = [
  {
    id: "total-courses",
    title: "Total Courses",
    key: "totalCourses",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "published-courses",
    title: "Published Courses",
    key: "publishedCourses",
    icon: GraduationCap,
    color: "blue",
  },
  {
    id: "students",
    title: "Total Students",
    key: "totalStudents",
    icon: Users,
    color: "green",
  },
  {
    id: "revenue",
    title: "Total Revenue",
    key: "totalRevenue",
    icon: CircleDollarSign,
    color: "orange",
  },
] as const;

const iconStyles = {
  purple: "bg-indigo-50 text-indigo-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-500",
};

export function CourseCreatorStats() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  console.log(stats);

  return (
    <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;

        const iconStyle = iconStyles[stat.color];

        const value = stats[stat.key];

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
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              {stat.title}
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-950">
                {value}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

// published course ko pupulate karna hai. backned se main published course return nahi kar rha hun.
// I thing backned mian shcema main thoda changes karne honge
// punlic pirvate ke baare mian sikhan hoga.
