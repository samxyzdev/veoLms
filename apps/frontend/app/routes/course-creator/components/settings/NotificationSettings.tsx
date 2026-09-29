// app/routes/admin/components/settings/NotificationSettings.tsx

import { Bell } from "lucide-react";
import { useState } from "react";

import { adminData } from "../../data/adminData";
import { SettingsCard, SettingsPage } from "./SettingsPrimitives";

export function NotificationSettings() {
  const [notifications, setNotifications] = useState(
    adminData.settings.notifications,
  );

  const toggle = (id: number) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  };

  return (
    <SettingsPage
      title="Notification Settings"
      description="Control which platform events administrators should be notified about."
    >
      <SettingsCard
        title="Admin Notifications"
        description="Choose which events should trigger notifications."
      >
        <div className="space-y-1">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Bell size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900">
                  {notification.title}
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  {notification.description}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notification.enabled}
                onClick={() => toggle(notification.id)}
                className={`relative h-6 w-11 rounded-full transition ${
                  notification.enabled ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    notification.enabled ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
