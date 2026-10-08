import type { Route } from "../../+types/route";

import { api } from "~/lib/axios";

import { CourseHero } from "../../components/course-detail/CourseHero";
import { WhatYouWillLearn } from "../../components/course-detail/WhatYouWillLearn";
import { CourseCurriculum } from "../../components/course-detail/CourseCurriculum";
import { InstructorCard } from "../../components/course-detail/InstructorCard";
import { CourseDetailTabs } from "../../components/course-detail/CourseDetailTabs";
import { AboutThisCourse } from "../../components/course-detail/AboutThisCourse";
import { CourseReviewsCard } from "../../components/course-detail/CourseReviewsCard";
import { CourseFAQs } from "../../components/course-detail/CourseFAQs";
import type { CourseLevel } from "~/lib/course";

// Types
export type CourseLesson = {
  id: string;
  title: string;
  contentType: "video" | "article" | "resource";
  sequenceOrder: number;
  isPreview?: boolean;
  duration?: number | null;
};

export type CourseSection = {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  contents: CourseLesson[];
};

export type CourseDetail = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  createdBy: string;
  categoryId: string | null;
  categoryName: string | null;
  courseLanguage: string | null;
  level: CourseLevel;
  thumbnailUrl: string | null;
  creatorName: string;
  status: "published";
  createdAt: string;
  updatedAt: string;
};

export type CourseDetailResponse = {
  course: CourseDetail;
  learningOutcomes: {
    id: string;
    courseId?: string;
    text: string;
    sequenceOrder: number;
    createdAt?: string;
    updatedAt?: string;
  }[];
  sections: CourseSection[];
  access: {
    isPurchased: boolean;
  };
};
// Client Loader
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID is required", {
      status: 400,
    });
  }
  const response = await api.get(`/student/courses/${courseId}`);
  const data = response.data.data as CourseDetailResponse;
  return {
    ...data,
    learningOutcomes: [...data.learningOutcomes].sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((outcome) => outcome.text),
  };
}

/**
 * Since this route is using clientLoader without a server loader,
 * React Router will wait for the client loader during hydration.
 */
clientLoader.hydrate = true as const;

// Hydrate Fallback
export function HydrateFallback() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero skeleton */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
        </div>
        {/* Content skeleton */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

// Page
export default function CourseDetailPage({ loaderData }: Route.ComponentProps) {
  const { course, learningOutcomes, sections, access } = loaderData;
  const totalLessons = sections.reduce((total, section) => total + section.contents.length, 0);

  return (
    <div className="-mx-4 -mt-6 min-h-[calc(100vh-76px)] bg-[#f7f8fc] sm:-mx-6 lg:-mx-8">
      <CourseHero course={course} sections={sections} isPurchased={access.isPurchased} />
      <CourseDetailTabs />

      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-7 sm:py-6 lg:px-10">
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.94fr)_312px] xl:gap-5">
          <div className="min-w-0 space-y-4">
            <WhatYouWillLearn outcomes={learningOutcomes} />
            <AboutThisCourse course={course} lessonCount={totalLessons} />
          </div>

          <div className="min-w-0">
            <CourseCurriculum sections={sections} courseId={course.id} isPurchased={access.isPurchased} />
          </div>

          <aside className="space-y-4">
            <InstructorCard creatorName={course.creatorName} />
            <CourseReviewsCard />
          </aside>
        </div>
        <div className="mt-4">
          <CourseFAQs />
        </div>
      </div>
    </div>
  );
}
