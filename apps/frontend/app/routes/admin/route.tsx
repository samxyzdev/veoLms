// app/routes/admin/route.tsx

import { Outlet } from "react-router";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <AdminSidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <AdminHeader />

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
