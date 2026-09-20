/**
 * Student dashboard endpoints — everything under `/course/dashboard`.
 *
 * All of these require a valid session: the backend derives the numbers from
 * the logged-in user's own purchases, activity and goal rows.
 */
import { apiClient } from "./client";

/** Weekly study goal, measured against the current Mon → Sun week. */
export interface DashboardWeeklyGoal {
  /** Hours studied this week (one decimal). */
  hoursDone: number;
  /** Target hours for this week. */
  hoursTarget: number;
  minutesDone: number;
  minutesTarget: number;
  /** 0–100, already clamped by the backend. */
  percent: number;
  /** e.g. "Sep 14 – Sep 20". */
  dateRange: string;
}

export interface DashboardCourses {
  enrolled: number;
  active: number;
  addedThisMonth: number;
}

export interface DashboardStudy {
  /** Hours studied this week. */
  hours: number;
  /** e.g. "1.1h". */
  avgPerDay: string;
  /** One number per weekday, Monday → Sunday, in minutes. */
  dailyMinutes: number[];
  /** Today's index in `dailyMinutes` / the weekday labels (Monday = 0). */
  highlightIndex: number;
}

export interface DashboardStreak {
  days: number;
  personalBest: number;
  /** Today's weekday index, Monday = 0. */
  todayIndex: number;
}

/** A course row shown in the dashboard "My Courses" list. */
export interface DashboardCourse {
  id: string;
  title: string;
  category: string;
  /** Progress percentage 0–100. */
  progress: number;
  status: "green" | "purple" | "yellow";
  statusLabel: string;
}

export interface DashboardStats {
  weeklyGoal: DashboardWeeklyGoal;
  courses: DashboardCourses;
  study: DashboardStudy;
  streak: DashboardStreak;
  /** Average progress across all enrolled courses, 0–100. */
  overallProgress: number;
  /** Hours studied per week for the last 6 weeks, oldest first. */
  studyTrend: number[];
  /** The three most recently touched enrolled courses. */
  recentCourses: DashboardCourse[];
}

/**
 * Empty shape used while the request is in flight, so the cards can render
 * with sane zeros instead of `undefined`.
 */
export const emptyDashboardStats: DashboardStats = {
  weeklyGoal: {
    hoursDone: 0,
    hoursTarget: 10,
    minutesDone: 0,
    minutesTarget: 600,
    percent: 0,
    dateRange: "",
  },
  courses: { enrolled: 0, active: 0, addedThisMonth: 0 },
  study: {
    hours: 0,
    avgPerDay: "0h",
    dailyMinutes: [0, 0, 0, 0, 0, 0, 0],
    highlightIndex: 0,
  },
  streak: { days: 0, personalBest: 0, todayIndex: 0 },
  overallProgress: 0,
  studyTrend: [0, 0, 0, 0, 0, 0],
  recentCourses: [],
};

/** Every number the student dashboard needs, in one request. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<{ stats: DashboardStats }>(
    "/course/dashboard/stats",
  );
  return data.stats;
}

/**
 * Log study time (today by default). Repeated calls for the same day add up,
 * and this is what feeds the study hours + day streak numbers.
 */
export async function logStudyActivity(
  minutes: number,
  activityDate?: string,
): Promise<void> {
  await apiClient.post("/course/dashboard/activity", { minutes, activityDate });
}

/** Set the study-time target for the current week. */
export async function setWeeklyGoal(targetMinutes: number): Promise<void> {
  await apiClient.put("/course/dashboard/goal", { targetMinutes });
}
