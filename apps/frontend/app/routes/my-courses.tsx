import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/my-courses";
import { CourseCard } from "../components/dashboard/CourseCard";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { ArrowRightIcon } from "../components/landing/icons";
import { getPurchasedCourses, type PurchasedCourse } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useMe } from "../lib/useMe";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Courses — Learnova" },
    {
      name: "description",
      content: "Courses you've purchased on Learnova.",
    },
  ];
}

export default function MyCourses() {
  const { user, isLoading } = useMe();
  const [courses, setCourses] = useState<PurchasedCourse[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPurchasedCourses()
      .then((list) => {
        if (!cancelled) setCourses(list);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for the session check — useMe redirects to /login when there's no
  // valid session, so don't render the page before that.
  if (isLoading) return null;

  return (
    <DashboardLayout user={user}>
      {/* Heading row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Courses you&apos;ve purchased — open one to start watching.
          </p>
        </div>
      </div>

      {/* Courses */}
      <div className="mt-6">
        {courses === null ? (
          <p className="text-sm text-gray-500">Loading your courses…</p>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-white">
              You haven&apos;t purchased any courses yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Explore the catalog and grab your first course.
            </p>
            <Link
              to="/dashboard/explore"
              className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Explore courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              // Each card opens the course player, where the video and the
              // section-wise lecture list live.
              <Link
                key={course.purchaseId}
                to={`/dashboard/my-courses/${course.courseId}`}
                className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={`Open ${course.title}`}
              >
                <CourseCard
                  title={course.title}
                  description={course.description}
                  language={course.courseLanguage}
                  price={formatPrice(course.price)}
                >
                  <span className="flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-light transition group-hover:bg-brand group-hover:text-white">
                    Start learning
                    <ArrowRightIcon className="size-3.5" />
                  </span>
                </CourseCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}