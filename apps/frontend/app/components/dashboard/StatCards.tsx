import type { ReactNode } from "react";

import type {
  DashboardCourses,
  DashboardStats,
  DashboardStreak,
  DashboardStudy,
  DashboardWeeklyGoal,
} from "../../lib/api";
import {
  BookOpenIcon,
  ClockIcon,
  CrownIcon,
  FlameIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
} from "../landing/icons";
import { BarChart, DonutChart } from "./mini-charts";

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

/** Monday → Sunday, one character each (matches `dailyMinutes` indexes). */
const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    /* All four cards sit in one line on wide screens; they fold to a
       2-up grid on tablets and a single column on phones. */
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <WeeklyGoalCard goal={stats.weeklyGoal} />
      <CoursesEnrolledCard courses={stats.courses} />
      <StudyHoursCard study={stats.study} />
      <DayStreakCard streak={stats.streak} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Weekly goal                                                         */
/* ------------------------------------------------------------------ */

function WeeklyGoalCard({ goal }: { goal: DashboardWeeklyGoal }) {
  const hoursLeft = Math.max(
    0,
    Math.round((goal.hoursTarget - goal.hoursDone) * 10) / 10,
  );

  return (
    /* Compact so it can share one row with the other three cards. */
    <div className="flex flex-col rounded-xl border border-line bg-surface p-5">
      {/* Header — same rhythm as the stat cards */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-300">Weekly Goal</p>
          <p className="mt-1 text-xs text-gray-500">{goal.dateRange || "This week"}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-ink">
          <TargetIcon className="size-5 text-brand-light" />
        </span>
      </div>

      {/* Ring */}
      <div className="mt-4 flex justify-center">
        <div className="relative w-fit">
          <DonutChart value={goal.percent} size={124} strokeWidth={12} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{goal.percent}%</span>
            <span className="mt-0.5 text-[11px] text-gray-400">
              {goal.hoursDone} / {goal.hoursTarget} hours
            </span>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-auto pt-5">
        <div className="rounded-lg border border-line bg-base/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <ZapIcon className="size-3.5 text-brand-light" />
            {hoursLeft > 0 ? "Great progress!" : "Goal reached — well done!"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {hoursLeft > 0
              ? `Just ${hoursLeft} more ${hoursLeft === 1 ? "hour" : "hours"} to hit your goal.`
              : "You hit your weekly target. Keep the streak going!"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

function StatCardShell({
  label,
  value,
  hint,
  icon,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  /** Extra content pinned to the bottom of the card. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-ink">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
        <TrendingUpIcon className="size-3.5 text-brand-light" />
        {hint}
      </p>

      {children ? <div className="mt-auto pt-5">{children}</div> : null}
    </div>
  );
}

function CoursesEnrolledCard({ courses }: { courses: DashboardCourses }) {
  const activeShare =
    courses.enrolled > 0
      ? Math.round((courses.active / courses.enrolled) * 100)
      : 0;

  return (
    <StatCardShell
      label="Courses Enrolled"
      value={String(courses.enrolled)}
      hint={`+${courses.addedThisMonth} this month`}
      icon={<BookOpenIcon className="size-5 text-brand-light" />}
    >
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand" style={{ width: `${activeShare}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-400">{courses.active} active</span>
      </div>
      <p className="mt-2 text-xs text-gray-500">{courses.enrolled} total courses</p>
    </StatCardShell>
  );
}

function StudyHoursCard({ study }: { study: DashboardStudy }) {
  return (
    <StatCardShell
      label="Study Hours"
      value={String(study.hours)}
      hint="this week"
      icon={<ClockIcon className="size-5 text-brand-light" />}
    >
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <BarChart
            values={study.dailyMinutes}
            height={56}
            highlightIndex={study.highlightIndex}
          />
          <div className="mt-2 flex justify-between text-[11px] text-gray-500">
            {weekdayLabels.map((day, index) => (
              <span
                key={index}
                className={index === study.highlightIndex ? "font-semibold text-brand-light" : ""}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="border-l border-line pl-3 text-center">
          <p className="text-lg font-bold text-white">{study.avgPerDay}</p>
          <p className="text-[11px] text-gray-500">avg/day</p>
        </div>
      </div>
    </StatCardShell>
  );
}

function DayStreakCard({ streak }: { streak: DashboardStreak }) {
  return (
    <StatCardShell
      label="Day Streak"
      value={String(streak.days)}
      hint="days in a row"
      icon={<FlameIcon className="size-5 text-brand-light" />}
    >
      <div className="flex justify-between">
        {weekdayLabels.map((day, index) => {
          const isToday = index === streak.todayIndex;
          const isDone = index < streak.todayIndex;
          const dotClass = isToday
            ? "size-5 border-2 border-brand-light bg-brand/30"
            : isDone
              ? "size-3.5 bg-brand"
              : "size-3.5 bg-line";

          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <span className="flex h-5 items-center justify-center">
                <span className={`rounded-full ${dotClass}`} />
              </span>
              <span
                className={`text-[11px] ${isToday ? "font-semibold text-brand-light" : "text-gray-500"}`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
        <CrownIcon className="size-3.5 text-brand-light" />
        Personal best: {streak.personalBest} days
      </p>
    </StatCardShell>
  );
}
