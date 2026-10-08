import { ArrowDown, Play } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";
import { CourseThumbnail, getCourseArtKey } from "../CourseThumbnail";

type Props = {
  course: CourseDetail;
};

export function CourseMediaPreview({ course }: Props) {
  function goToCurriculum() {
    document.getElementById("course-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="group relative aspect-video min-h-[230px] overflow-hidden rounded-xl border border-white bg-slate-950 shadow-[0_12px_32px_rgba(22,30,65,0.16)] sm:min-h-[280px] xl:min-h-0">
      <CourseThumbnail
        artKey={getCourseArtKey(course.title)}
        title={course.title}
        imageUrl={course.thumbnailUrl}
        className="absolute inset-0 h-full w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-slate-950/10" />
        <span className="absolute left-4 top-4 rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">Course overview</span>
        <button
          type="button"
          onClick={goToCurriculum}
          aria-label="Explore course lessons"
          className="absolute left-1/2 top-[47%] flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-slate-950/25 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white hover:text-indigo-600"
        >
          <Play size={24} fill="currentColor" className="ml-1" />
        </button>
        <div className="absolute inset-x-0 bottom-10 flex items-end justify-between gap-4 p-5 sm:p-7">
          <div className="max-w-[75%] text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">Learn at your own pace</p>
            <p className="mt-1 line-clamp-2 text-xl font-extrabold leading-tight sm:text-2xl">{course.title}</p>
          </div>
        </div>
        <button type="button" onClick={goToCurriculum} className="absolute bottom-0 left-0 right-0 flex h-10 items-center justify-between border-t border-white/15 bg-slate-950/50 px-4 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
          <span className="flex items-center gap-2"><ArrowDown size={14} /> Browse course content</span>
          <span className="hidden text-white/70 sm:inline">Browse lessons and sections below</span>
        </button>
      </CourseThumbnail>
    </div>
  );
}
