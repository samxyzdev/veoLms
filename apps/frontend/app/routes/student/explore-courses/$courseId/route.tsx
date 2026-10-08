import type { Route } from "../../+types/route";

import { api } from "~/lib/axios";
import type { CourseLevel } from "~/lib/course";

import { CourseHero } from "../../components/course-detail/CourseHero";
import { WhatYouWillLearn } from "../../components/course-detail/WhatYouWillLearn";
import { CourseCurriculum } from "../../components/course-detail/CourseCurriculum";
import { InstructorCard } from "../../components/course-detail/InstructorCard";
import { CourseDetailTabs } from "../../components/course-detail/CourseDetailTabs";
import { AboutThisCourse } from "../../components/course-detail/AboutThisCourse";
import { CourseReviewsCard } from "../../components/course-detail/CourseReviewsCard";
import { CourseFAQs } from "../../components/course-detail/CourseFAQs";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type CourseLesson = {
  id: string;
  title: string;
  contentType: "video" | "article" | "resource";
  sequenceOrder: number;

  // Currently optional because your current backend does not send them.
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
  level: CourseLevel | null;

  thumbnailUrl: string | null;

  creatorName: string | null;

  status: "published";
  publishedAt: string | null;
  archivedAt: string | null;

  /* Course statistics */
  rating: number | null;
  reviewCount: number;
  studentsCount: number;

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
/* Loader                                                                     */
/* -------------------------------------------------------------------------- */

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const courseId = params.courseId;

  if (!courseId) {
    throw new Response("Course ID is required", {
      status: 400,
    });
  }

  try {
    const response = await api.get(`/student/courses/${courseId}`);

    const data = response.data.data as CourseDetailResponse;

    return {
      ...data,

      learningOutcomes: [...(data.learningOutcomes ?? [])].sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((outcome) => outcome.text),
    };
  } catch (error) {
    throw error;
  }
}

clientLoader.hydrate = true as const;

/* -------------------------------------------------------------------------- */
/* Hydrate Fallback                                                           */
/* -------------------------------------------------------------------------- */

export function HydrateFallback() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 lg:px-10">
        <div className="animate-pulse">
          <div className="mb-5 h-4 w-64 rounded bg-slate-200" />

          <div className="grid gap-6 xl:grid-cols-[1.32fr_0.92fr_312px]">
            <div className="aspect-video rounded-2xl bg-slate-200" />

            <div className="space-y-4">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="h-12 w-3/4 rounded bg-slate-200" />
              <div className="h-20 rounded bg-slate-200" />
            </div>

            <div className="h-80 rounded-2xl bg-slate-200" />
          </div>
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

  const totalLessons = sections.reduce((total, section) => total + section.contents.length, 0);

  return (
    <div id="overview" className="-mx-4 -mt-6 min-h-[calc(100vh-76px)] bg-[#f7f8fc] sm:-mx-6 lg:-mx-8">
      {/* Hero */}
      <CourseHero course={course} sections={sections} isPurchased={access.isPurchased} />

      {/* Tabs */}
      <CourseDetailTabs />

      {/* Main content */}
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-7 sm:py-6 lg:px-10">
        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.94fr)_312px] xl:gap-5">
          {/* ============================================================ */}
          {/* LEFT COLUMN                                                  */}
          {/* ============================================================ */}

          <div className="min-w-0 space-y-4">
            <WhatYouWillLearn outcomes={learningOutcomes} />

            <AboutThisCourse course={course} lessonCount={totalLessons} />
          </div>

          {/* ============================================================ */}
          {/* CENTER COLUMN                                                */}
          {/* ============================================================ */}

          <div className="min-w-0">
            <CourseCurriculum sections={sections} courseId={course.id} isPurchased={access.isPurchased} />
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN                                                 */}
          {/* ============================================================ */}

          <div className="flex min-w-0 flex-col gap-4">
            <InstructorCard creatorName={course.creatorName} />

            <CourseReviewsCard rating={course.rating} reviewCount={course.reviewCount} studentsCount={course.studentsCount} />
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-5">
          <CourseFAQs />
        </div>
      </div>
    </div>
  );
}
