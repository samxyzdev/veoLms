import { isAxiosError } from "axios";
import { redirect } from "react-router";

import type { Route } from "./+types/route";
import CourseContentOverview, {
  type CourseContentViewCourse,
  type CourseContentViewSection,
} from "../../../components/courses/content/CourseContentOverview";
import { api } from "~/lib/axios";

type Category = {
  id: string;
  name: string;
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const courseId = params.courseId;

  if (!courseId) {
    throw new Response("Course ID is required.", { status: 400 });
  }

  try {
    const [courseResponse, categoriesResponse] = await Promise.all([
      api.get(`/course-creator/courses/${courseId}`),
      api.get("/course-creator/courses/categories"),
    ]);
    const responseData = courseResponse.data?.data;
    const course = responseData?.course as CourseContentViewCourse | undefined;

    if (!course) {
      throw new Response("Course not found.", { status: 404 });
    }

    const categories = (categoriesResponse.data?.data ?? []) as Category[];
    const sections = [...((responseData.sections ?? []) as CourseContentViewSection[])].sort(
      (first, second) => first.sequenceOrder - second.sequenceOrder,
    );

    for (const section of sections) {
      section.contents.sort((first, second) => first.sequenceOrder - second.sequenceOrder);
    }

    return {
      course,
      categoryName:
        categories.find((category) => category.id === course.categoryId)?.name ??
        "Uncategorized",
      sections,
    };
  } catch (error) {
    if (error instanceof Response) throw error;

    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Response("Course not found.", { status: 404 });
    }

    throw error;
  }
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] animate-pulse px-5 py-6 md:px-8 lg:px-10">
        <div className="mb-5 h-4 w-64 rounded bg-slate-200" />
        <div className="mb-5 h-10 w-72 rounded bg-slate-200" />
        <div className="mb-4 h-28 rounded-2xl bg-slate-200" />
        <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-16 rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-14 rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CourseContentRoute({ loaderData }: Route.ComponentProps) {
  return (
    <CourseContentOverview
      course={loaderData.course}
      categoryName={loaderData.categoryName}
      sections={loaderData.sections}
    />
  );
}
