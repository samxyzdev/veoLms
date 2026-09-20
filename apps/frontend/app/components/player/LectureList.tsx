import { useMemo, useState } from "react";

import type { PlayerCourse, PlayerLecture } from "../../lib/api";
import { formatTimecode } from "../../lib/format";
import { CheckIcon, ChevronDownIcon } from "../landing/icons";
import { PlaySolidIcon, SpinnerIcon } from "./icons";

/**
 * Right-hand panel of the player page: every section with its lectures, the
 * user's completion state, and which lecture is currently playing. Rows are
 * clickable — the page swaps the video when a lecture is selected.
 */
export function LectureList({
  course,
  activeId,
  onSelect,
  onToggleComplete,
  savingId = null,
}: {
  course: PlayerCourse;
  activeId: string | null;
  onSelect: (lecture: PlayerLecture) => void;
  onToggleComplete: (lecture: PlayerLecture, isCompleted: boolean) => void;
  /** Lecture id whose completion update is in flight (shows a spinner). */
  savingId?: string | null;
}) {
  // Sections start open; the first section is always expanded.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const sections = useMemo(() => {
    if (!search) return course.sections;
    return course.sections
      .map((section) => ({
        ...section,
        contents: section.contents.filter((lecture) =>
          lecture.title.toLowerCase().includes(search),
        ),
      }))
      .filter((section) => section.contents.length > 0);
  }, [course.sections, search]);

  const flatCount = useMemo(
    () => course.sections.reduce((total, section) => total + section.totalCount, 0),
    [course.sections],
  );

  return (
    <aside className="flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-line bg-surface lg:max-h-[calc(100vh-8rem)]">
      {/* Header: course progress */}
      <div className="border-b border-line px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Course content</h2>
          <span className="text-xs font-medium text-gray-500">
            {course.completedCount}/{flatCount} completed
          </span>
        </div>

        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${course.progressPercentage}%` }}
          />
        </div>

        {/* Filter — handy on long courses */}
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lectures…"
          className="mt-3 w-full rounded-lg border border-line bg-base px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:border-brand/60 focus:outline-none"
        />
      </div>

      {/* Sections + lectures */}
      <div className="flex-1 overflow-y-auto">
        {flatCount === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-gray-500">
            This course has no lectures yet.
          </p>
        ) : sections.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-gray-500">
            No lecture matches “{query.trim()}”.
          </p>
        ) : (
          sections.map((section) => {
            const isOpen = search.length > 0 || !collapsed[section.id];

            return (
              <div key={section.id} className="border-b border-line last:border-0">
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((state) => ({
                      ...state,
                      [section.id]: !state[section.id],
                    }))
                  }
                  className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-surface-hover"
                >
                  <ChevronDownIcon
                    className={`size-4 shrink-0 text-gray-500 transition-transform ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide text-gray-300">
                    {section.title}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-gray-500">
                    {section.completedCount}/{section.totalCount}
                  </span>
                </button>

                {isOpen && (
                  <ul className="pb-2">
                    {section.contents.map((lecture, index) => {
                      const isActive = lecture.id === activeId;

                      return (
                        <li key={lecture.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(lecture)}
                            className={`group flex w-full items-start gap-3 border-l-2 px-4 py-2.5 text-left transition ${
                              isActive
                                ? "border-brand bg-brand/15"
                                : "border-transparent hover:bg-surface-hover"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                lecture.isCompleted
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : isActive
                                    ? "bg-brand text-white"
                                    : "bg-line text-gray-400"
                              }`}
                            >
                              {lecture.isCompleted ? (
                                <CheckIcon className="size-3.5" />
                              ) : isActive ? (
                                <PlaySolidIcon className="size-2.5" />
                              ) : (
                                index + 1
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block text-sm leading-snug ${
                                  isActive
                                    ? "font-semibold text-white"
                                    : "font-medium text-gray-300"
                                }`}
                              >
                                {lecture.title}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-gray-500">
                                {lecture.isCompleted
                                  ? "Completed"
                                  : lecture.watchedSeconds > 5
                                    ? `Resume at ${formatTimecode(lecture.watchedSeconds)}`
                                    : lecture.contentType}
                              </span>
                            </span>
                          </button>

                          {/* Completion toggle for the lecture being watched */}
                          {isActive && (
                            <div className="border-l-2 border-brand bg-brand/5 px-4 pb-2.5">
                              <button
                                type="button"
                                disabled={savingId === lecture.id}
                                onClick={() =>
                                  onToggleComplete(lecture, !lecture.isCompleted)
                                }
                                className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-light transition hover:text-white disabled:opacity-60"
                              >
                                {savingId === lecture.id ? (
                                  <SpinnerIcon className="size-3 animate-spin" />
                                ) : (
                                  <CheckIcon className="size-3" />
                                )}
                                {lecture.isCompleted
                                  ? "Mark as incomplete"
                                  : "Mark as complete"}
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
