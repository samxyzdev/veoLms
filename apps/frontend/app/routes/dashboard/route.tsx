import { Outlet, redirect } from "react-router";
import { isAxiosError } from "axios";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { api } from "~/lib/axios";
import type { Route } from "./+types/route";

// ye email name bhi chek kar rha hai or use direct dashbaord pe jaa sakta hai ki nahi wo bhi chek kar rha hai.
export async function clientLoader() {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    // cookie nahi hai ya expire ho gayi -> login pe bhejo
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }
    // koi aur error (server down, 500, etc.) -> error page pe jane do
    throw error;
  }
}

// SSR app hai toh ye dono zaruri hain (direct URL pe aane par bhi guard chale)
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const user = loaderData.userDetails[0];

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Sidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <Header user={user} />
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
