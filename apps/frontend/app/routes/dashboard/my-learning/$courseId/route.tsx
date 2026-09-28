import type { Route } from "./+types/route";

import { CoursePlayerHeader } from "../../components/course-player/CoursePlayerHeader";
import { VideoPlayer } from "../../components/course-player/VideoPlayer";
import { LessonDetails } from "../../components/course-player/LessonDetails";
import { LessonTabs } from "../../components/course-player/LessonTabs";
import { WhatYouWillLearn } from "../../components/course-player/WhatYouWillLearn";
import { LessonNavigation } from "../../components/course-player/LessonNavigation";
import { CourseContent } from "../../components/course-player/CourseContent";
import { coursePlayerData } from "../../data/coursePlayerData";

export function meta() {
  return [
    {
      title: `${coursePlayerData.currentLesson.title} | ${coursePlayerData.course.title}`,
    },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { courseId } = params;

  if (courseId !== coursePlayerData.course.id) {
    throw new Response("Course not found", {
      status: 404,
    });
  }

  return coursePlayerData;
}

export default function CoursePlayerPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData;

  return (
    <div className="min-w-0">
      <CoursePlayerHeader
        courseTitle={data.course.title}
        lessonTitle={data.currentLesson.title}
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0">
          <VideoPlayer video={data.currentLesson.video} />

          <LessonDetails lesson={data.currentLesson} />

          <LessonTabs tabs={data.tabs}>
            <div className="space-y-5">
              <p className="text-sm leading-6 text-slate-600">
                {data.overview.description}
              </p>

              <WhatYouWillLearn items={data.overview.whatYouWillLearn} />
            </div>
          </LessonTabs>

          <LessonNavigation
            previousLesson={data.navigation.previousLesson}
            nextLesson={data.navigation.nextLesson}
          />
        </main>

        <CourseContent courseData={data} />
      </div>
    </div>
  );
}
