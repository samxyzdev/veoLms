// app/routes/admin/components/settings/RolesPermissions.tsx

import { MoreHorizontal, ShieldCheck } from "lucide-react";

import { adminData } from "../../data/adminData";
import { SettingsCard, SettingsPage } from "./SettingsPrimitives";
export function RolesPermissions() {
  return (
    <SettingsPage
      title="Roles & Permissions"
      description="Manage platform roles and control what each role can access."
    >
      <SettingsCard
        title="Platform Roles"
        description="Configure permissions for each user role."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Description
                </th>

                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Users
                </th>

                <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Access
                </th>

                <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {adminData.settings.roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ShieldCheck size={16} />
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {role.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="text-[10px] text-slate-500">
                      {role.description}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="text-xs font-bold text-slate-700">
                      {role.users}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[9px] font-bold text-indigo-600">
                      {role.permissions}
                    </span>
                  </td>

                  <td className="py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
