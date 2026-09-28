// app/routes/admin/components/dashboard/StudentGrowth.tsx

import { TrendingUp, UserPlus, Users } from "lucide-react";

import { adminData } from "../../data/adminData";

export function StudentGrowth() {
  const data = adminData.studentGrowth;

  const maxValue = Math.max(...data.map((item) => item.value));

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;

      const y = 92 - (item.value / maxValue) * 75;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Student Growth
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Student growth over the last 6 months.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-500"
        >
          Last 6 Months
        </button>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <div className="relative h-[170px]">
          {/* Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[1500, 1200, 900, 600, 300, 0].map((value) => (
              <div key={value} className="flex items-center gap-2">
                <span className="w-8 text-right text-[8px] text-slate-400">
                  {value >= 1000 ? `${value / 1000}k` : value}
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>
            ))}
          </div>

          {/* SVG line */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute bottom-7 left-10 right-0 h-[135px] w-[calc(100%-40px)] overflow-visible"
          >
            {/* Gradient fill */}
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />

                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>

            <polygon
              points={`0,100 ${points} 100,100`}
              fill="url(#growthFill)"
            />

            <polyline
              points={points}
              fill="none"
              stroke="#5b55e8"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;

              const y = 92 - (item.value / maxValue) * 75;

              return (
                <circle key={item.month} cx={x} cy={y} r="1.8" fill="#5b55e8" />
              );
            })}
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-10 right-0 flex justify-between">
            {data.map((item) => (
              <span
                key={item.month}
                className="text-[9px] font-medium text-slate-400"
              >
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {adminData.studentGrowthSummary.map((item) => {
          const Icon = item.icon === "UserPlus" ? UserPlus : Users;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={14} />
                </div>

                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                  <TrendingUp size={10} />
                  {item.change}
                </span>
              </div>

              <p className="mt-3 text-[10px] text-slate-400">{item.title}</p>

              <p className="mt-0.5 text-lg font-extrabold text-slate-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
