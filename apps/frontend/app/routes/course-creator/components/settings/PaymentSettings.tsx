// app/routes/admin/components/settings/PaymentSettings.tsx

import { CreditCard, DollarSign, Save } from "lucide-react";
import { useState } from "react";

import {
  SelectField,
  SettingToggle,
  SettingsCard,
  SettingsPage,
} from "./SettingsPrimitives";
import { adminData } from "../../data/adminData";

export function PaymentSettings() {
  const data = adminData.settings.payments;

  const [currency, setCurrency] = useState(data.currency);

  const [provider, setProvider] = useState(data.paymentProvider);

  const [taxEnabled, setTaxEnabled] = useState(data.taxEnabled);

  const [couponEnabled, setCouponEnabled] = useState(data.couponEnabled);

  const [refundWindow, setRefundWindow] = useState(data.refundWindow);

  return (
    <SettingsPage
      title="Payment Settings"
      description="Manage payment providers, currency, taxes, and refund rules."
    >
      <SettingsCard
        title="Payment Configuration"
        description="Choose how students pay for courses."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={["USD", "INR", "EUR", "GBP"]}
          />

          <SelectField
            label="Payment Provider"
            value={provider}
            onChange={setProvider}
            options={["Stripe", "Razorpay", "PayPal"]}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Payment Features"
        description="Configure additional payment options."
      >
        <div className="space-y-1">
          <SettingToggle
            title="Tax Calculation"
            description="Automatically apply taxes to paid courses."
            enabled={taxEnabled}
            onChange={() => setTaxEnabled(!taxEnabled)}
          />

          <SettingToggle
            title="Coupons"
            description="Allow discount coupons during checkout."
            enabled={couponEnabled}
            onChange={() => setCouponEnabled(!couponEnabled)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Refund Policy"
        description="Define the default refund period for purchases."
      >
        <div className="max-w-sm">
          <SelectField
            label="Refund Window"
            value={refundWindow}
            onChange={setRefundWindow}
            options={["7 days", "14 days", "30 days", "No refunds"]}
          />
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
