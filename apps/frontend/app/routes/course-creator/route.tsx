import { Outlet, redirect } from "react-router";
import { CourseCreatorSidebar } from "./components/AdminSidebar";
import { CourseCreatorHeader } from "./components/AdminHeader";
import { isAxiosError } from "axios";
import { api } from "~/lib/axios";
import type { Route } from "./+types/route";

export async function clientLoader() {
  try {
    const response = await api.get("/admin/me");

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      // user login nahi hai to signin
      if (status === 401) {
        throw redirect("/admin/signin");
      }
      // login to hai admin nahi hai to dashboard

      if (status === 403) {
        throw redirect("/dashboard");
      }
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
  console.log("Admin Layout ");
  const admin = loaderData.user;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <CourseCreatorSidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <CourseCreatorHeader admin={admin} />

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
