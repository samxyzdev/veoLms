import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { redirect } from "react-router";

import type { Route } from "./+types/route";

import { CoursePlayerHeader } from "../../components/course-player/CoursePlayerHeader";
import { VideoPlayer } from "../../components/course-player/VideoPlayer";
import { LessonDetails } from "../../components/course-player/LessonDetails";
import { LessonOverview } from "../../components/course-player/LessonOverview";
import { LessonResources } from "../../components/course-player/LessonResources";
import { LessonDiscussion } from "../../components/course-player/LessonDiscussion";
import { LessonNavigation } from "../../components/course-player/LessonNavigation";
import { CourseContent } from "../../components/course-player/CourseContent";
import type { CoursePlayerData, PlayerLesson } from "../../components/course-player/types";
import { api } from "~/lib/axios";

type CourseLessonResponse = {
  id: string;
  title: string | null;
  description?: string | null;
  contentType: string;
  contentUrl?: string | null;
  duration?: number | null;
  sequenceOrder: number;
};

type CourseDetailResponse = {
  course: {
    id: string;
    title: string | null;
    description: string | null;
    thumbnailUrl: string | null;
    creatorName: string | null;
    categoryName: string | null;
    level: string | null;
  };
  learningOutcomes?: Array<string | { text: string; sequenceOrder?: number }>;
  sections: Array<{
    id: string;
    title: string | null;
    sequenceOrder: number;
    contents: CourseLessonResponse[];
  }>;
  access?: { isPurchased: boolean };
};

type PurchasedCourseResponse = {
  courseId: string;
  nextLesson?: string | null;
  progress?: number | null;
  completedLessons?: number | null;
  totalLessons?: number | null;
};

function getLevelLabel(level: string | null) {
  return level?.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Course lesson";
}

function normalizeLesson(lesson: CourseLessonResponse, section: CourseDetailResponse["sections"][number], sectionNumber: number, lessonNumber: number, completedCount: number): PlayerLesson {
  return {
    id: lesson.id,
    title: lesson.title?.trim() || "Untitled lesson",
    description: lesson.description?.trim() || "",
    contentType: lesson.contentType?.toLowerCase() || "video",
    contentUrl: lesson.contentUrl ?? null,
    durationSeconds: typeof lesson.duration === "number" ? lesson.duration : null,
    sectionId: section.id,
    sectionTitle: section.title?.trim() || `Section ${sectionNumber}`,
    sectionNumber,
    lessonNumber,
    isCompleted: lessonNumber <= completedCount,
  };
}

export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<CoursePlayerData> {
  const courseId = params.courseId;

  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  try {
    const [courseResult, purchasedResult] = await Promise.all([api.get(`/student/courses/${courseId}`), api.get("/student/courses/purchased-courses").catch(() => null)]);

    const detail = courseResult.data?.data as CourseDetailResponse | undefined;

    if (!detail?.course) {
      throw new Response("Course not found", { status: 404 });
    }

    if (!detail.access?.isPurchased) {
      throw redirect(`/dashboard/explore-courses/${courseId}`);
    }

    const playerResult = await api.get(`/student/courses/${courseId}/player`);
    const playerCourse = playerResult.data?.data?.course as { sections?: CourseDetailResponse["sections"] } | undefined;

    const purchasedCourses = (purchasedResult?.data?.data ?? []) as PurchasedCourseResponse[];
    const enrollment = purchasedCourses.find((item) => item.courseId === courseId);
    const orderedSections = [...(playerCourse?.sections ?? detail.sections ?? [])].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    const totalLessons = orderedSections.reduce((total, section) => total + (section.contents?.length ?? 0), 0);
    const completedLessons = Math.min(totalLessons, Math.max(0, enrollment?.completedLessons ?? Math.round(((Number(enrollment?.progress) || 0) * totalLessons) / 100)));

    let lessonNumber = 0;
    const sections = orderedSections.map((section, sectionIndex) => ({
      id: section.id,
      number: sectionIndex + 1,
      title: section.title?.trim() || `Section ${sectionIndex + 1}`,
      lessons: [...(section.contents ?? [])]
        .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
        .map((lesson) => {
          lessonNumber += 1;
          return normalizeLesson(lesson, section, sectionIndex + 1, lessonNumber, completedLessons);
        }),
    }));

    const lessons = sections.flatMap((section) => section.lessons);
    const nextLesson = enrollment?.nextLesson?.trim();
    const suggestedLesson = nextLesson ? lessons.find((lesson) => lesson.title.toLowerCase() === nextLesson.toLowerCase()) : undefined;
    const currentLesson = suggestedLesson ?? lessons[completedLessons] ?? lessons.at(-1) ?? null;
    const rawOutcomes = detail.learningOutcomes ?? [];
    const learningOutcomes = rawOutcomes.map((outcome) => (typeof outcome === "string" ? outcome : outcome.text)).filter(Boolean);
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      course: {
        id: detail.course.id,
        title: detail.course.title?.trim() || "Untitled course",
        description: detail.course.description?.trim() || "",
        thumbnail: detail.course.thumbnailUrl,
        categoryName: detail.course.categoryName?.trim() || "My Learning",
        instructorName: detail.course.creatorName?.trim() || "Course Instructor",
        level: getLevelLabel(detail.course.level),
      },
      sections,
      lessons,
      progress: {
        completedLessons,
        totalLessons,
        percentage,
      },
      currentLessonId: currentLesson?.id ?? null,
      learningOutcomes,
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }
    throw error;
  }
}

clientLoader.hydrate = true as const;

export function meta() {
  return [{ title: "Course Player | Learnly" }];
}

export function HydrateFallback() {
  return (
    <div className="grid animate-pulse gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(360px,0.92fr)]">
      <div className="space-y-4">
        <div className="h-4 w-72 rounded bg-slate-200" />
        <div className="aspect-[16/7] rounded-2xl bg-slate-200" />
        <div className="h-16 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
      </div>
      <div className="h-[680px] rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function CoursePlayerPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  const [selectedLessonId, setSelectedLessonId] = useState(data.currentLessonId);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const selectedIndex = data.lessons.findIndex((lesson) => lesson.id === selectedLessonId);
  const currentIndex = Math.max(0, selectedIndex);
  const currentLesson = data.lessons[currentIndex] ?? null;

  const activeResources = useMemo(() => {
    if (!currentLesson) return [];
    return currentLesson.contentType === "resource" && currentLesson.contentUrl ? [{ id: currentLesson.id, title: currentLesson.title, url: currentLesson.contentUrl, type: "Resource" }] : [];
  }, [currentLesson]);

  function selectLesson(lessonId: string) {
    setSelectedLessonId(lessonId);
  }

  return (
    <div className="min-w-0">
      <div className={`grid min-w-0 gap-5 ${isTheaterMode ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.8fr)_minmax(360px,0.92fr)]"}`}>
        <main className="min-w-0">
          <CoursePlayerHeader categoryName={data.course.categoryName} courseTitle={data.course.title} lessonTitle={currentLesson?.title ?? "Course content"} />

          <VideoPlayer
            title={currentLesson?.title ?? data.course.title}
            video={currentLesson?.contentType === "video" ? currentLesson.contentUrl : null}
            poster={data.course.thumbnail}
            contentType={currentLesson?.contentType ?? "video"}
            theaterMode={isTheaterMode}
            onTheaterModeChange={setIsTheaterMode}
          />

          {currentLesson ? (
            <>
              <LessonDetails lesson={currentLesson} lessonCount={data.lessons.length} instructorName={data.course.instructorName} level={data.course.level} />

              <LessonOverview lesson={currentLesson} outcomes={data.learningOutcomes} />
              <LessonResources resources={activeResources} />
              <LessonDiscussion />

              <LessonNavigation
                previousLesson={data.lessons[currentIndex - 1]}
                nextLesson={data.lessons[currentIndex + 1]}
                onPrevious={() => data.lessons[currentIndex - 1] && selectLesson(data.lessons[currentIndex - 1].id)}
                onNext={() => data.lessons[currentIndex + 1] && selectLesson(data.lessons[currentIndex + 1].id)}
              />
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h1 className="text-lg font-bold text-slate-900">Course content is not available yet</h1>
              <p className="mt-2 text-sm text-slate-500">Lessons will appear here after the instructor adds course content.</p>
            </div>
          )}
        </main>

        <CourseContent
          courseTitle={data.course.title}
          sections={data.sections}
          activeLessonId={currentLesson?.id ?? null}
          progress={data.progress}
          thumbnail={data.course.thumbnail}
          onLessonSelect={selectLesson}
        />
      </div>
    </div>
  );
}
