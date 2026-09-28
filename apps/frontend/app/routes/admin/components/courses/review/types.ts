// app/routes/admin/components/courses/review/types.ts

export type CourseReviewData = {
  title: string;
  description: string;
  category: string;
  level: string;
  language: string;
  thumbnail: string;

  sections: number;
  lessons: number;
  duration: string;

  price: number;
  comparePrice: number;
  accessType: "Public" | "Unlisted" | "Private";
  maxEnrollments: number | "Unlimited";
  enrollmentPeriod: string;

  coupons: number;

  certificate: boolean;
  discussions: boolean;
  marketplace: boolean;
  featured: boolean;

  rating: number;
  reviews: number;
  students: number;

  learningOutcomes: string[];
};
