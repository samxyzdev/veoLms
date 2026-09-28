// app/routes/admin/components/settings/EnrollmentSettings.tsx

import { useState } from "react";

import { adminData } from "../../data/adminData";
import {
  SettingToggle,
  SettingsCard,
  SettingsPage,
} from "./SettingsPrimitives";

export function EnrollmentSettings() {
  const data = adminData.settings.enrollments;

  const [allowEnrollment, setAllowEnrollment] = useState(data.allowEnrollment);

  const [autoApprove, setAutoApprove] = useState(data.autoApprove);

  const [guestEnrollment, setGuestEnrollment] = useState(
    data.allowGuestEnrollment,
  );

  const [maxStudents, setMaxStudents] = useState(
    String(data.maxStudentsPerCourse),
  );

  const [selfUnenroll, setSelfUnenroll] = useState(data.allowSelfUnenroll);

  return (
    <SettingsPage
      title="Enrollment Settings"
      description="Control how students enroll, access, and leave your courses."
    >
      <SettingsCard
        title="Enrollment Rules"
        description="Configure the default enrollment behavior."
      >
        <div className="space-y-1">
          <SettingToggle
            title="Allow Enrollment"
            description="Allow students to enroll in available courses."
            enabled={allowEnrollment}
            onChange={() => setAllowEnrollment(!allowEnrollment)}
          />

          <SettingToggle
            title="Auto Approve Enrollment"
            description="Automatically approve new enrollment requests."
            enabled={autoApprove}
            onChange={() => setAutoApprove(!autoApprove)}
          />

          <SettingToggle
            title="Guest Enrollment"
            description="Allow users to enroll without creating an account."
            enabled={guestEnrollment}
            onChange={() => setGuestEnrollment(!guestEnrollment)}
          />

          <SettingToggle
            title="Allow Self Unenroll"
            description="Allow students to leave a course themselves."
            enabled={selfUnenroll}
            onChange={() => setSelfUnenroll(!selfUnenroll)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Course Capacity"
        description="Set a maximum number of students for a course."
      >
        <div className="max-w-sm">
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Maximum Students Per Course
          </label>

          <input
            type="number"
            value={maxStudents}
            onChange={(event) => setMaxStudents(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
