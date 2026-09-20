import type { DashboardStats } from "../../lib/api";
import { BarChart, DonutChart, LineChart } from "./mini-charts";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Charts fed by `/course/dashboard/stats`:
 *  - weekly activity  → minutes studied per day (Mon → Sun)
 *  - course progress  → average progress across enrolled courses
 *  - study trend      → hours studied in each of the last 6 weeks
 */
export function ActivityCharts({ stats }: { stats: DashboardStats }) {
  const weeklyMinutes = stats.study.dailyMinutes;
  const overallProgress = stats.overallProgress;
  const weeklyHours = stats.studyTrend;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Bar chart */}
      <ChartCard title="Weekly Activity" subtitle="Minutes studied per day">
        <div className="flex h-40 flex-col justify-between">
          <BarChart
            values={weeklyMinutes}
            height={140}
            highlightIndex={stats.study.highlightIndex}
          />
          <div className="mt-3 flex justify-between text-[11px] text-gray-500">
            {weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Donut chart */}
      <ChartCard title="Course Progress" subtitle="Across all enrolled courses">
        <div className="relative mx-auto mt-2 w-fit">
          <DonutChart value={overallProgress} size={150} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{overallProgress}%</span>
            <span className="text-xs text-gray-500">complete</span>
          </div>
        </div>
      </ChartCard>

      {/* Line chart */}
      <ChartCard title="Study Trend" subtitle="Hours per week">
        <LineChart values={weeklyHours} height={170} />
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}