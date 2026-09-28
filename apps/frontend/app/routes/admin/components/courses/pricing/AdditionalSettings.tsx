// app/routes/admin/components/courses/pricing/AdditionalSettings.tsx

import { SectionCard, SettingRow } from "./PricingUI";

export default function AdditionalSettings({
  allowCertificate,
  allowDiscussions,
  showInMarketplace,
  featuredCourse,
  onCertificateChange,
  onDiscussionsChange,
  onMarketplaceChange,
  onFeaturedChange,
}: {
  allowCertificate: boolean;
  allowDiscussions: boolean;
  showInMarketplace: boolean;
  featuredCourse: boolean;
  onCertificateChange: (value: boolean) => void;
  onDiscussionsChange: (value: boolean) => void;
  onMarketplaceChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
}) {
  return (
    <SectionCard
      title="Additional Settings"
      description="Configure extra access and visibility options."
    >
      <div className="space-y-4">
        <SettingRow
          title="Allow Certificate"
          description="Issue certificate on course completion."
          checked={allowCertificate}
          onChange={onCertificateChange}
        />

        <SettingRow
          title="Allow Discussions"
          description="Enable Q&A and discussions."
          checked={allowDiscussions}
          onChange={onDiscussionsChange}
        />

        <SettingRow
          title="Show in Marketplace"
          description="Make this course visible in marketplace."
          checked={showInMarketplace}
          onChange={onMarketplaceChange}
        />

        <SettingRow
          title="Featured Course"
          description="Show as a featured course."
          checked={featuredCourse}
          onChange={onFeaturedChange}
        />
      </div>
    </SectionCard>
  );
}
