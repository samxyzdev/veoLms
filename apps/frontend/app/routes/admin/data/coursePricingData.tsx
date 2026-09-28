// app/routes/admin/data/coursePricingData.ts

import type { Coupon } from "../components/courses/pricing/types";

export const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME50",
    discountType: "percentage",
    value: 50,
    usageLimit: 100,
    used: 24,
    validFrom: "2026-04-15",
    validUntil: "2026-04-30",
    status: "active",
  },
  {
    id: 2,
    code: "FLAT200",
    discountType: "fixed",
    value: 200,
    usageLimit: 500,
    used: 86,
    validFrom: "2026-04-15",
    validUntil: "2026-05-15",
    status: "active",
  },
  {
    id: 3,
    code: "EARLYBIRD",
    discountType: "percentage",
    value: 30,
    usageLimit: 50,
    used: 50,
    validFrom: "2026-04-15",
    validUntil: "2026-04-22",
    status: "expired",
  },
];
