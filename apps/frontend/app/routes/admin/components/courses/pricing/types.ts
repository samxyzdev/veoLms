// app/routes/admin/components/courses/pricing/types.ts

export type AccessType = "public" | "unlisted" | "private";

export type DiscountType = "percentage" | "fixed";

export type CouponStatus = "active" | "expired";

export type Coupon = {
  id: number;
  code: string;
  discountType: DiscountType;
  value: number;
  usageLimit: number;
  used: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
};
