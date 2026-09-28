import {
  BookOpen,
  CircleCheck,
  Flame,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

type DashboardStats = {
  enrolledCourses: number;
  completedCourses: number;
  lessonsCompleted: number;
  learningStreak: number;
};

type StatCardsProps = {
  stats: DashboardStats;
};

const iconMap = {
  BookOpen,
  CircleCheck,
  PlayCircle,
  Flame,
};

const iconStyles = {
  purple: "bg-indigo-50 text-indigo-600",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-500",
};

export function StatCards({ stats }: StatCardsProps) {
  const dashboardStats = [
    {
      id: "enrolled-courses",
      title: "Enrolled Courses",
      value: stats.enrolledCourses,
      description: "Courses you are learning",
      icon: "BookOpen",
      iconStyle: "purple",
    },
    {
      id: "completed-courses",
      title: "Completed Courses",
      value: stats.completedCourses,
      description: "Courses you have completed",
      icon: "CircleCheck",
      iconStyle: "green",
    },
    {
      id: "lessons-completed",
      title: "Lessons Completed",
      value: stats.lessonsCompleted,
      description: "Lessons completed so far",
      icon: "PlayCircle",
      iconStyle: "blue",
    },
    {
      id: "learning-streak",
      title: "Learning Streak",
      value: `${stats.learningStreak} days`,
      description: "Keep your streak going",
      icon: "Flame",
      iconStyle: "orange",
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const iconStyle = iconStyles[stat.iconStyle];

        return (
          <article
            key={stat.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle}`}
              >
                <Icon size={18} />
              </div>

              {stat.id === "learning-streak" && stats.learningStreak > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  <TrendingUp size={10} />
                  Active
                </div>
              )}
            </div>

            <p className="mt-3 text-[11px] font-medium text-slate-500">
              {stat.title}
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {stat.value}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {stat.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
