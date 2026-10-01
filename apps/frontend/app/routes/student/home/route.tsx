import { ContinueLearning } from "../components/dashboard/ContinueLearning";
import { CourseProgress } from "../components/dashboard/CourseProgress";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { RecommendedCourses } from "../components/dashboard/RecommendedCourses";
import { StatCards } from "../components/dashboard/StatCards";
import { StatsSection } from "../components/dashboard/StatsSection";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { WeeklyGoal } from "../components/dashboard/WeeklyGoal";

import { api } from "~/lib/axios";
import { isAxiosError } from "axios";
import { redirect } from "react-router";

import type { Route } from "../+types/route";

export async function clientLoader() {
  try {
    const [statsResponse, courseProgressResponse] = await Promise.all([
      api.get("/dashboard/stats"),
      api.get("/dashboard/course-progress"),
    ]);

    return {
      stats: statsResponse.data.data,
      courseProgress: courseProgressResponse.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    throw error;
  }
}

export default function DashboardHome({ loaderData }: Route.ComponentProps) {
  console.log("loaderData:", loaderData);

  return (
    <div className="space-y-5">
      <DashboardHeader />

      <StatCards stats={loaderData.stats} />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* <ContinueLearning /> */}
        {/* <UpcomingDeadlines /> */}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <CourseProgress courses={loaderData.courseProgress} />

        <RecentActivity />
      </div>

      {/* <RecommendedCourses /> */}

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* <CourseEnrollment /> */}
        {/* <WeeklyGoal /> */}
      </div>

      {/* <StatsSection /> */}
    </div>
  );
}
