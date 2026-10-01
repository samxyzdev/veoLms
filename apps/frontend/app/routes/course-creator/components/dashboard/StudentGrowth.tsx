import { ChevronDown, TrendingUp, UserPlus, Users } from "lucide-react";

import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";

type StudentGrowthItem = {
  month: string;
  value: number;
};

type CourseCreatorStats = {
  totalCourses: number;
  totalStudents: number;
  totalPurchases: number;
  totalRevenue: number;

  enrollmentOverview: {
    month: string;
    value: number;
  }[];

  popularCourses: {
    id: string;
    title: string;
    enrollments: number;
    rank: number;
  }[];

  recentEnrollments: {
    id: string;
    student: string;
    email: string;
    course: string;
    date: string;
    status: string;
  }[];

  studentGrowth: StudentGrowthItem[];
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStats;
};

const RANGE_OPTIONS = [
  {
    label: "Last 1 Month",
    months: 1,
  },
  {
    label: "Last 3 Months",
    months: 3,
  },
  {
    label: "Last 6 Months",
    months: 6,
  },
  {
    label: "Last 12 Months",
    months: 12,
  },
] as const;

function getLastMonths(months: number) {
  const result: string[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();

    date.setMonth(date.getMonth() - i);

    result.push(
      new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(date),
    );
  }

  return result;
}

function getChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }

  const change = ((current - previous) / previous) * 100;

  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function StudentGrowth() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  const [selectedMonths, setSelectedMonths] = useState(6);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedOption =
    RANGE_OPTIONS.find((option) => option.months === selectedMonths) ??
    RANGE_OPTIONS[2];

  /*
   * Backend data ko selected range ke according
   * prepare kar rahe hain.
   */
  const data = useMemo(() => {
    const months = getLastMonths(selectedMonths);

    const growthMap = new Map(
      stats.studentGrowth.map((item) => [item.month, item.value]),
    );

    return months.map((month) => ({
      month,
      value: growthMap.get(month) ?? 0,
    }));
  }, [stats.studentGrowth, selectedMonths]);

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  /*
   * Chart dimensions
   */
  const chartWidth = 600;
  const chartHeight = 180;

  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 18;
  const paddingBottom = 20;

  const usableWidth = chartWidth - paddingLeft - paddingRight;

  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const getPoint = (value: number, index: number) => {
    const x =
      data.length === 1
        ? chartWidth / 2
        : paddingLeft + (index / (data.length - 1)) * usableWidth;

    const y = paddingTop + (1 - value / maxValue) * usableHeight;

    return {
      x,
      y,
    };
  };

  const points = data.map((item, index) => getPoint(item.value, index));

  /*
   * Smooth curve
   */
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];

    const controlX = (previous.x + point.x) / 2;

    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const areaPath =
    points.length > 0
      ? `${linePath}
         L ${points[points.length - 1].x} ${chartHeight - paddingBottom}
         L ${points[0].x} ${chartHeight - paddingBottom}
         Z`
      : "";

  /*
   * Summary
   */
  const currentMonth = data[data.length - 1]?.value ?? 0;

  const previousMonth = data[data.length - 2]?.value ?? 0;

  const growthChange = getChange(currentMonth, previousMonth);

  const summary = [
    {
      id: "new-students",
      title: "New Students",
      value: currentMonth,
      change: growthChange,
      icon: UserPlus,
    },
    {
      id: "total-students",
      title: "Total Students",
      value: stats.totalStudents,
      change: "",
      icon: Users,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Student Growth
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            New students joining your courses over time.
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {selectedOption.label}

            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {RANGE_OPTIONS.map((option) => {
                const isSelected = option.months === selectedMonths;

                return (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => {
                      setSelectedMonths(option.months);

                      setDropdownOpen(false);
                    }}
                    className={[
                      "flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition",
                      isSelected
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-7">
        <div className="relative h-[190px]">
          {/* Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio, index) => {
              const value = Math.round(maxValue * ratio);

              return (
                <div
                  key={`${ratio}-${index}`}
                  className="flex items-center gap-3"
                >
                  <span className="w-8 text-right text-[8px] font-medium text-slate-400">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  </span>

                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              );
            })}
          </div>

          {/* SVG */}
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="absolute left-11 top-0 h-[170px] w-[calc(100%-44px)] overflow-visible"
          >
            <defs>
              <linearGradient
                id="studentGrowthFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.16" />

                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path d={areaPath} fill="url(#studentGrowthFill)" />

            {/* Glow */}
            <path
              d={linePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="6"
              strokeOpacity="0.08"
              vectorEffect="non-scaling-stroke"
            />

            {/* Main line */}
            <path
              d={linePath}
              fill="none"
              stroke="#5b55e8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Points */}
            {points.map((point, index) => (
              <g key={data[index].month}>
                <circle cx={point.x} cy={point.y} r="5" fill="white" />

                <circle cx={point.x} cy={point.y} r="3.5" fill="#5b55e8" />
              </g>
            ))}
          </svg>

          {/* Month Labels */}
          <div className="absolute bottom-0 left-11 right-0 flex justify-between px-1">
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
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={14} />
                </div>

                {item.change && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                    <TrendingUp size={10} />
                    {item.change}
                  </span>
                )}
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
