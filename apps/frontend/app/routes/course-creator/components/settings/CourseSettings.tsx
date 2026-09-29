// app/routes/admin/components/settings/CourseSettings.tsx

import { BookOpen, Check, ChevronDown, Save } from "lucide-react";
import { useState } from "react";
import {
  SelectField,
  SettingToggle,
  SettingsCard,
  SettingsPage,
} from "./SettingsPrimitives";

import { adminData } from "../../data/adminData";

export function CourseSettings() {
  const data = adminData.settings.courses;

  const [visibility, setVisibility] = useState(data.defaultVisibility);

  const [level, setLevel] = useState(data.defaultLevel);

  const [allowPreview, setAllowPreview] = useState(data.allowPreview);

  const [allowReviews, setAllowReviews] = useState(data.allowReviews);

  const [requireApproval, setRequireApproval] = useState(data.requireApproval);

  const [comments, setComments] = useState(data.enableComments);

  return (
    <SettingsPage
      title="Course Settings"
      description="Configure default course behavior, visibility, and content rules."
    >
      <SettingsCard
        title="Course Defaults"
        description="Set the default values used when creating a new course."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Default Visibility"
            value={visibility}
            onChange={setVisibility}
            options={["Draft", "Published", "Private"]}
          />

          <SelectField
            label="Default Level"
            value={level}
            onChange={setLevel}
            options={["Beginner", "Intermediate", "Advanced"]}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Course Features"
        description="Control the features available on courses."
      >
        <div className="space-y-1">
          <SettingToggle
            title="Course Preview"
            description="Allow students to preview selected lessons before enrollment."
            enabled={allowPreview}
            onChange={() => setAllowPreview(!allowPreview)}
          />

          <SettingToggle
            title="Course Reviews"
            description="Allow students to submit ratings and reviews."
            enabled={allowReviews}
            onChange={() => setAllowReviews(!allowReviews)}
          />

          <SettingToggle
            title="Instructor Approval"
            description="Require admin approval before a course can be published."
            enabled={requireApproval}
            onChange={() => setRequireApproval(!requireApproval)}
          />

          <SettingToggle
            title="Discussion Comments"
            description="Enable comments and discussions inside courses."
            enabled={comments}
            onChange={() => setComments(!comments)}
          />
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
