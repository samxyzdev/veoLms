import { Bookmark, Check, MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { getInitials } from "~/lib/format";
import type { PlayerLesson } from "./types";
import { formatLessonDuration } from "./types";

type LessonDetailsProps = {
  lesson: PlayerLesson;
  lessonCount: number;
  instructorName: string;
  level: string;
};

export function LessonDetails({ lesson, lessonCount, instructorName, level }: LessonDetailsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  async function shareLesson() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  }

  return (
    <section className="mt-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">{lesson.title}</h1>
          <div className="mt-2 flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{getInitials(instructorName)}</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{instructorName}</p>
              <p className="text-[10px] text-slate-500">Course Instructor</p>
            </div>
            <span className="ml-1 hidden h-7 items-center rounded-lg bg-slate-100 px-2 text-[10px] font-semibold text-slate-600 sm:inline-flex">{level}</span>
            <span className="hidden text-[10px] text-slate-400 sm:inline">Lesson {lesson.lessonNumber} of {lessonCount}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button type="button" onClick={() => { setLiked((value) => !value); setDisliked(false); }} aria-pressed={liked} aria-label="Like lesson" className={`flex h-full items-center gap-1.5 px-3 transition ${liked ? "text-indigo-600" : "text-slate-700 hover:bg-slate-50"}`}><ThumbsUp size={15} /><span className="text-[11px] font-semibold">{liked ? 1 : 0}</span></button>
            <span className="h-5 w-px bg-slate-200" />
            <button type="button" onClick={() => { setDisliked((value) => !value); setLiked(false); }} aria-pressed={disliked} aria-label="Dislike lesson" className={`flex h-full items-center px-3 transition ${disliked ? "text-indigo-600" : "text-slate-700 hover:bg-slate-50"}`}><ThumbsDown size={15} /></button>
          </div>
          <button type="button" onClick={() => void shareLesson()} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50" aria-label="Share lesson"><Share2 size={15} />{shared ? "Copied" : "Share"}</button>
          <button type="button" onClick={() => setSaved((value) => !value)} aria-pressed={saved} className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-semibold shadow-sm transition ${saved ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><Bookmark size={15} className={saved ? "fill-current" : ""} />Save</button>
          <button type="button" aria-label="More lesson actions" className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"><MoreHorizontal size={17} /></button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 sm:hidden">
        <span>Lesson {lesson.lessonNumber} of {lessonCount}</span>
        <span>•</span>
        <span>{formatLessonDuration(lesson.durationSeconds)}</span>
        {lesson.isCompleted && <><span>•</span><span className="inline-flex items-center gap-1 font-semibold text-emerald-600"><Check size={12} />Completed</span></>}
      </div>
    </section>
  );
}
