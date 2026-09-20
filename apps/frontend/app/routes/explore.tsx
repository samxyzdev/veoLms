import { useEffect, useState } from "react";
import type { Route } from "./+types/explore";
import { CourseCard } from "../components/dashboard/CourseCard";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { getCourses, purchaseCourse, type Course } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useMe } from "../lib/useMe";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Explore Courses — Learnova" },
    {
      name: "description",
      content: "Browse and purchase courses on Learnova.",
    },
  ];
}

export default function Explore() {
  const { user, isLoading } = useMe();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCourses()
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

  async function handlePurchase(courseId: string) {
    if (buyingId) return;
    setBuyingId(courseId);
    setNotice(null);
    try {
      await purchaseCourse(courseId);
      setPurchasedIds((prev) => new Set(prev).add(courseId));
      setNotice({ type: "success", text: "Course purchased successfully!" });
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Could not purchase the course.";
      // Already purchased → reflect it on the button too.
      if (text.toLowerCase().includes("already purchased")) {
        setPurchasedIds((prev) => new Set(prev).add(courseId));
      }
      setNotice({ type: "error", text });
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <DashboardLayout user={user}>
      {/* Heading row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Explore Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find a course, buy it, and start learning today.
          </p>
        </div>
      </div>

      {/* Notice banner */}
      {notice && (
        <p
          className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {notice.text}
        </p>
      )}

      {/* Courses */}
      <div className="mt-6">
        {courses === null ? (
          <p className="text-sm text-gray-500">Loading courses…</p>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-white">No courses available yet</p>
            <p className="mt-1 text-sm text-gray-500">Check back soon — new courses are on the way.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const isPurchased = purchasedIds.has(course.id);
              return (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  language={course.courseLanguage}
                  price={formatPrice(course.price)}
                >
                  {isPurchased ? (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                      Purchased
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePurchase(course.id)}
                      disabled={buyingId !== null}
                      className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
                    >
                      {buyingId === course.id ? "Buying…" : "Buy now"}
                    </button>
                  )}
                </CourseCard>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}