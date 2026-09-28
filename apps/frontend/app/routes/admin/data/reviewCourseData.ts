// app/routes/admin/data/reviewCourseData.ts

import type { CourseReviewData } from "../components/courses/review/types";

export const reviewCourseData: CourseReviewData = {
  title: "Complete UI/UX Design Masterclass",

  description:
    "Learn UI/UX design from scratch with real-world projects, design systems, and industry best practices. Build a portfolio and get job ready.",

  category: "Design",
  level: "Beginner",
  language: "English",

  thumbnail:
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",

  sections: 5,
  lessons: 28,
  duration: "4h 30m",

  price: 999,
  comparePrice: 1499,
  accessType: "Public",
  maxEnrollments: 500,
  enrollmentPeriod: "Apr 15, 2025 – May 15, 2025",

  coupons: 3,

  certificate: true,
  discussions: true,
  marketplace: true,
  featured: false,

  rating: 4.8,
  reviews: 320,
  students: 1250,

  learningOutcomes: [
    "Master UI/UX design fundamentals",
    "Create real-world design projects",
    "Build a complete portfolio",
    "Learn industry best practices",
    "Use modern design tools like Figma",
  ],
};
