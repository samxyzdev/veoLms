import { Award, Bell, Mail } from "lucide-react";
import { useState } from "react";

import { dashboardData } from "../../data/dashboardData";

const iconMap = {
  Bell,
  Mail,
  Award,
};

export function NotificationSettings() {
  const [notifications, setNotifications] = useState(
    dashboardData.settings.notifications,
  );

  const toggleNotification = (id: number) => {
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold text-slate-950">
          Email Notifications
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Choose which updates you want to receive.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.icon as keyof typeof iconMap];

          return (
            <div
              key={notification.id}
              className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={17} />
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
                onClick={() => toggleNotification(notification.id)}
                className={`
                  relative h-6 w-11 shrink-0 rounded-full
                  transition
                  ${notification.enabled ? "bg-indigo-600" : "bg-slate-200"}
                `}
              >
                <span
                  className={`
                    absolute top-1 h-4 w-4 rounded-full
                    bg-white shadow-sm transition
                    ${notification.enabled ? "left-6" : "left-1"}
                  `}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
