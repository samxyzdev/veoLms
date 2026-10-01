import { Outlet, redirect } from "react-router";
import { isAxiosError } from "axios";

import { Header } from "~/components/header/Header";
import { Sidebar } from "~/components/sidebar/Sidebar";

import { api } from "~/lib/axios";

import { courseCreatorSidebarData } from "./data/sidebarData";

import type { Route } from "./+types/route";

export async function clientLoader() {
  try {
    const [userResponse, statsResponse] = await Promise.all([
      api.get("/course-creator/me"),
      api.get("/course-creator/stats"),
    ]);

    return {
      user: userResponse.data.data,
      stats: statsResponse.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    throw error;
  }
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function CourseCreatorLayout({
  loaderData,
}: Route.ComponentProps) {
  const { user, stats } = loaderData;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Sidebar
        logoHref="/course-creator"
        navigation={courseCreatorSidebarData.navigation}
        footerCard={courseCreatorSidebarData.footerCard}
      />

      <main className="min-h-screen lg:ml-[250px]">
        <Header
          user={user}
          mode="course_creator"
          searchPlaceholder="Search students, courses, or anything..."
        />

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet
            context={{
              user,
              stats,
            }}
          />
        </div>
      </main>
    </div>
  );
}
