import { Bookmark, CheckCircle2, FileText, Play } from "lucide-react";
import { Link } from "react-router";

type RecentActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: "Bookmark" | "CircleCheck" | "FileText" | "Play";
  style: "purple" | "blue" | "green" | "orange";
};

type RecentActivityProps = {
  activities: RecentActivityItem[];
};

const iconMap = {
  Bookmark,
  CircleCheck: CheckCircle2,
  FileText,
  Play,
};

const styles = {
  purple: "bg-indigo-50 text-indigo-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-500",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  console.log(activities);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Your timeline</p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">Recent Activity</h2>
        </div>

        <Link to="/dashboard/notifications" className="text-xs font-bold text-indigo-600">
          View all
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-500">No recent activity</p>

          <p className="mt-1 text-xs text-slate-400">Your learning activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon];
            const iconStyle = styles[activity.style];

            return (
              <div key={activity.id} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconStyle}`}>
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900">{activity.title}</p>

                  <p className="mt-1 truncate text-[11px] text-slate-400">{activity.description}</p>
                </div>

                <span className="whitespace-nowrap text-[10px] text-slate-400">{activity.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
