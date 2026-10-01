import { Outlet, redirect } from "react-router";
import { isAxiosError } from "axios";

import { Header } from "~/components/header/Header";
import { Sidebar } from "~/components/sidebar/Sidebar";

import { api } from "~/lib/axios";

import { studentSidebarData } from "./data/sidebarData";

import type { Route } from "./+types/route";

export async function clientLoader() {
  try {
    const response = await api.get("/student/me");

    return response.data.data;
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

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const user = loaderData;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Sidebar
        navigation={studentSidebarData.navigation}
        footerCard={studentSidebarData.footerCard}
      />
      <main className="min-h-screen lg:ml-[250px]">
        <Header
          user={user}
          mode="student"
          searchPlaceholder="Search courses, lessons..."
        />

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
