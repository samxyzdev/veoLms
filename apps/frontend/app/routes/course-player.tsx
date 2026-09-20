import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/course-player";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { LectureList } from "../components/player/LectureList";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { CheckIcon, ClockIcon, GraduationCapIcon } from "../components/landing/icons";
import { SpinnerIcon } from "../components/player/icons";
import {
  flattenLectures,
  getCoursePlayer,
  logStudyActivity,
  saveContentProgress,
  type PlayerCourse,
  type PlayerLecture,
} from "../lib/api";
import { formatTimecode } from "../lib/format";
import { useMe } from "../lib/useMe";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course player — Learnova" },
    {
      name: "description",
      content: "Watch your lectures and track your course progress.",
    },
  ];
}

/** How often (in seconds of playback) the position is pushed to the backend. */
const SAVE_EVERY_SECONDS = 15;

/**
 * Returns a copy of `course` with one lecture patched, keeping the section and
 * course rollups (completed counts + percentage) in sync locally so the UI
 * updates immediately instead of waiting for a refetch.
 */
function withLecture(
  course: PlayerCourse,
  lectureId: string,
  patch: Partial<PlayerLecture>,
): PlayerCourse {
  const sections = course.sections.map((section) => {
    const contents = section.contents.map((lecture) =>
      lecture.id === lectureId ? { ...lecture, ...patch } : lecture,
    );
    return {
      ...section,
      contents,
      completedCount: contents.filter((lecture) => lecture.isCompleted).length,
    };
  });

  const allLectures = sections.flatMap((section) => section.contents);
  const completedCount = allLectures.filter(
    (lecture) => lecture.isCompleted,
  ).length;

  return {
    ...course,
    sections,
    totalCount: allLectures.length,
    completedCount,
    progressPercentage:
      allLectures.length > 0
        ? Math.round((completedCount / allLectures.length) * 100)
        : 0,
  };
}

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isLoading: isSessionLoading } = useMe();
  const navigate = useNavigate();

  const [course, setCourse] = useState<PlayerCourse | null>(null);
  const [loadError, setLoadError] = useState<{ message: string; status?: number } | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  /**
   * Only auto-play when the user actively moved to another lecture (or the
   * previous one ended). The first lecture of a page load waits for a click, so
   * opening a course never blasts audio unexpectedly.
   */
  const [autoPlay, setAutoPlay] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Bookkeeping for progress saves + study minutes. Refs (not state) so the
  // 5-second progress callback never triggers an extra render by itself.
  const lastReportedPosition = useRef(0);
  const lastSavedPosition = useRef(0);
  const durationRef = useRef(0);
  const pendingStudySeconds = useRef(0);
  const activeLectureRef = useRef<PlayerLecture | null>(null);

  /* ------------------------------- loading ------------------------------- */

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    getCoursePlayer(courseId)
      .then((data) => {
        if (cancelled) return;
        setCourse(data);
        const lectures = flattenLectures(data.sections);
        // Resume where the user left off, otherwise start at the top.
        const resume =
          lectures.find((lecture) => lecture.id === data.lastContentId) ??
          lectures[0] ??
          null;
        setActiveId(resume?.id ?? null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const status = (error as Error & { status?: number }).status;
        setLoadError({
          message: (error as Error).message || "Could not load this course.",
          status,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const lectures = useMemo(
    () => (course ? flattenLectures(course.sections) : []),
    [course],
  );

  const activeLecture = useMemo(
    () => lectures.find((lecture) => lecture.id === activeId) ?? null,
    [activeId, lectures],
  );

  useEffect(() => {
    activeLectureRef.current = activeLecture;
  }, [activeLecture]);

  const activeIndex = useMemo(
    () => lectures.findIndex((lecture) => lecture.id === activeId),
    [activeId, lectures],
  );

  const activeSectionTitle = useMemo(() => {
    if (!course || !activeId) return "";
    return (
      course.sections.find((section) =>
        section.contents.some((lecture) => lecture.id === activeId),
      )?.title ?? ""
    );
  }, [activeId, course]);

  // Reset the per-lecture trackers whenever a different lecture is opened.
  // Deliberately keyed on the id only — watchedSeconds grows during playback
  // and must not re-baseline the save/study-time counters.
  useEffect(() => {
    const resumeAt = activeLecture?.watchedSeconds ?? 0;
    lastReportedPosition.current = resumeAt;
    lastSavedPosition.current = resumeAt;
    durationRef.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  /* ------------------------------- actions ------------------------------- */

  const selectLecture = useCallback((lecture: PlayerLecture) => {
    setAutoPlay(true);
    setActiveId(lecture.id);
  }, []);

  const goToOffset = useCallback(
    (offset: number) => {
      const next = lectures[activeIndex + offset];
      if (!next) return;
      setAutoPlay(true);
      setActiveId(next.id);
    },
    [activeIndex, lectures],
  );

  /** Persist position (and optionally completion) for one lecture. */
  const persist = useCallback(
    async (
      lecture: PlayerLecture,
      seconds: number,
      isCompleted?: boolean,
    ) => {
      try {
        await saveContentProgress(lecture.id, {
          watchedSeconds: Math.max(0, Math.round(seconds)),
          ...(isCompleted === undefined ? {} : { isCompleted }),
        });
      } catch {
        // Offline / session expired: keep the optimistic local state. The next
        // progress tick or the completion toggle retries.
      }
    },
    [],
  );

  /**
   * Called by the player every ~5 seconds and on pause. Watches playback time
   * for two things: saving the position at most every 15s, and logging study
   * minutes (1 minute at a time) so the dashboard's study stats fill up.
   */
  const handleProgress = useCallback(
    (position: number, duration: number) => {
      if (duration > 0) durationRef.current = duration;

      const lecture = activeLectureRef.current;
      if (!lecture) return;

      // Study time — only forward, small jumps count (seeks are ignored).
      const delta = position - lastReportedPosition.current;
      if (delta > 0 && delta < 30) {
        pendingStudySeconds.current += delta;
        while (pendingStudySeconds.current >= 60) {
          pendingStudySeconds.current -= 60;
          void logStudyActivity(1).catch(() => {});
        }
      }
      lastReportedPosition.current = position;

      const whole = Math.round(position);
      if (whole > (activeLectureRef.current?.watchedSeconds ?? 0)) {
        activeLectureRef.current = { ...lecture, watchedSeconds: whole };
        setCourse((previous) =>
          previous ? withLecture(previous, lecture.id, { watchedSeconds: whole }) : previous,
        );
      }

      if (Math.abs(position - lastSavedPosition.current) >= SAVE_EVERY_SECONDS) {
        lastSavedPosition.current = position;
        void persist(lecture, position);
      }
    },
    [persist],
  );

  const handleEnded = useCallback(() => {
    const lecture = activeLectureRef.current;
    if (!lecture) return;

    void persist(lecture, durationRef.current || lecture.watchedSeconds, true);
    setCourse((previous) =>
      previous ? withLecture(previous, lecture.id, { isCompleted: true }) : previous,
    );

    // Auto-advance, exactly like the "next up" behaviour people expect.
    const index = lectures.findIndex((item) => item.id === lecture.id);
    const next = lectures[index + 1];
    if (next) {
      setAutoPlay(true);
      setActiveId(next.id);
    }
  }, [lectures, persist]);

  /** Toggle "completed" from the lecture list (optimistic, reverts on error). */
  const toggleComplete = useCallback(
    (lecture: PlayerLecture, isCompleted: boolean) => {
      setSavingId(lecture.id);
      setCourse((previous) =>
        previous ? withLecture(previous, lecture.id, { isCompleted }) : previous,
      );

      saveContentProgress(lecture.id, {
        watchedSeconds: lecture.watchedSeconds,
        isCompleted,
      })
        .catch(() => {
          setCourse((previous) =>
            previous
              ? withLecture(previous, lecture.id, {
                  isCompleted: lecture.isCompleted,
                })
              : previous,
          );
        })
        .finally(() => setSavingId(null));
    },
    [],
  );

  /* -------------------------------- render ------------------------------- */

  if (isSessionLoading) return null;

  if (loadError) {
    const notEnrolled = loadError.status === 403;
    return (
      <DashboardLayout user={user}>
        <div className="rounded-xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
          <p className="text-sm font-medium text-white">
            {notEnrolled
              ? "You are not enrolled in this course"
              : "Could not open the course player"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {notEnrolled
              ? "Buy the course first and it will show up in My Courses."
              : loadError.message}
          </p>
          <Link
            to="/dashboard/my-courses"
            className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Back to My Courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center gap-3 py-20 text-sm text-gray-500">
          <SpinnerIcon className="size-5 animate-spin" />
          Loading the player…
        </div>
      </DashboardLayout>
    );
  }

  const totalLectures = course.totalCount;

  return (
    <DashboardLayout user={user}>
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-courses")}
          className="transition hover:text-white"
        >
          My Courses
        </button>
        <span>/</span>
        <span className="truncate text-gray-300">{course.title}</span>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ----------------------------- player ----------------------------- */}
        <div className="min-w-0">
          {activeLecture ? (
            <VideoPlayer
              src={activeLecture.contentUrl}
              title={activeLecture.title}
              startAt={activeLecture.watchedSeconds}
              autoPlay={autoPlay}
              isCompleted={activeLecture.isCompleted}
              hasNext={activeIndex >= 0 && activeIndex < lectures.length - 1}
              onNext={() => goToOffset(1)}
              onProgress={handleProgress}
              onEnded={handleEnded}
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/50 text-center">
              <GraduationCapIcon className="size-8 text-gray-600" />
              <p className="text-sm font-medium text-white">
                No lectures in this course yet
              </p>
              <p className="max-w-sm text-xs text-gray-500">
                The creator hasn&apos;t published any sections for this course.
              </p>
            </div>
          )}

          {/* Lecture heading + actions */}
          {activeLecture && (
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                {activeSectionTitle && (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-light">
                    {activeSectionTitle}
                  </p>
                )}
                <h1 className="mt-1 text-lg font-bold text-white lg:text-xl">
                  {activeLecture.title}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span>
                    Lecture {activeIndex + 1} of {totalLectures}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="size-3.5" />
                    {activeLecture.watchedSeconds > 5
                      ? `Watched ${formatTimecode(activeLecture.watchedSeconds)}`
                      : "Not started"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                disabled={savingId === activeLecture.id}
                onClick={() => toggleComplete(activeLecture, !activeLecture.isCompleted)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                  activeLecture.isCompleted
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-brand text-white hover:bg-brand-hover"
                }`}
              >
                <CheckIcon className="size-4" />
                {activeLecture.isCompleted ? "Completed" : "Mark as complete"}
              </button>
            </div>
          )}

          {/* Course summary card */}
          <div className="mt-5 rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">{course.title}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {course.categoryName ?? "General"} · {course.courseLanguage}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {course.progressPercentage}%
                </p>
                <p className="text-xs text-gray-500">
                  {course.completedCount}/{totalLectures} lectures
                </p>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${course.progressPercentage}%` }}
              />
            </div>

            {course.description && (
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {course.description}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Watch time from the player is added to your dashboard study stats
              and day streak.
            </p>
          </div>
        </div>

        {/* -------------------------- lectures panel ------------------------- */}
        <LectureList
          course={course}
          activeId={activeId}
          savingId={savingId}
          onSelect={selectLecture}
          onToggleComplete={toggleComplete}
        />
      </div>
    </DashboardLayout>
  );
}
