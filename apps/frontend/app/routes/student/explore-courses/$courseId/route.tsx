import type { Route } from "../../+types/route";

import { api } from "~/lib/axios";

import { CourseHero } from "../../components/course-detail/CourseHero";
import { WhatYouWillLearn } from "../../components/course-player/WhatYouWillLearn";
import { CourseCurriculum } from "../../components/course-detail/CourseCurriculum";
import { CoursePurchaseCard } from "../../components/course-detail/CoursePurchaseCard";
import { InstructorCard } from "../../components/course-detail/InstructorCard";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type CourseLesson = {
  id: string;
  title: string;
  contentType: "video" | "article" | "resource";
  sequenceOrder: number;
  isPreview: boolean;
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

  level: "beginner" | "intermediate" | "advanced" | "all_levels" | null;

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

/* -------------------------------------------------------------------------- */
/* Client Loader                                                              */
/* -------------------------------------------------------------------------- */

/**
 * This request runs in the browser.
 *
 * Browser
 *   ↓
 * clientLoader
 *   ↓
 * Axios
 *   ↓
 * GET /student/courses/:courseId
 *   ↓
 * Backend
 */
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

/* -------------------------------------------------------------------------- */
/* Hydrate Fallback                                                           */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function CourseDetailPage({ loaderData }: Route.ComponentProps) {
  const { course, learningOutcomes, sections, access } = loaderData;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ------------------------------------------------------------------ */}
      {/* Course Hero                                                         */}
      {/* ------------------------------------------------------------------ */}

      <CourseHero course={course} />

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        {/* LEFT */}

        <div className="min-w-0 space-y-6">
          <WhatYouWillLearn outcomes={learningOutcomes} />

          <CourseCurriculum sections={sections} courseId={course.id} isPurchased={access.isPurchased} />
        </div>

        {/* RIGHT */}

        <div className="space-y-5">
          <CoursePurchaseCard course={course} isPurchased={access.isPurchased} />

          <InstructorCard creatorName={course.creatorName} />
        </div>
      </div>
    </main>
  );
}
