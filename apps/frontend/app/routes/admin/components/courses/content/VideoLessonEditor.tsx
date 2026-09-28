// app/routes/admin/components/courses/content/VideoLessonEditor.tsx

import { useState, type ChangeEvent } from "react";
import { Play, Upload, Video } from "lucide-react";

import type { Lesson } from "./types";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export function VideoLessonEditor({
  lesson,
  onChange,
}: {
  lesson: Lesson;
  onChange: <K extends keyof Lesson>(key: K, value: Lesson[K]) => void;
}) {
  const [source, setSource] = useState<"upload" | "url">("upload");

  function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024 * 1024) {
      alert("Maximum video size is 2GB.");
      return;
    }

    const url = URL.createObjectURL(file);

    onChange("videoFile", url);
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Upload Video Content
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Upload a video file or provide a video URL.
        </p>
      </div>

      {/* Source */}
      <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setSource("upload")}
          className={`rounded-md py-2 text-sm font-medium ${
            source === "upload"
              ? "bg-white text-violet-700 shadow-sm"
              : "text-slate-500"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSource("url")}
          className={`rounded-md py-2 text-sm font-medium ${
            source === "url"
              ? "bg-white text-violet-700 shadow-sm"
              : "text-slate-500"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video URL
          </span>
        </button>
      </div>

      {source === "upload" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Upload box */}
          <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 text-center hover:border-violet-400">
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleVideoUpload}
              className="hidden"
            />

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Upload className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Click to upload or drag and drop
            </p>

            <p className="mt-1 text-xs text-slate-400">
              MP4, MOV, AVI, WebM (Max 2GB)
            </p>

            <p className="mt-1 text-xs text-slate-400">Recommended: 1080p</p>
          </label>

          {/* Preview */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900">
              Video Preview
            </p>

            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
              {lesson.videoFile ? (
                <video
                  src={lesson.videoFile}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                      <Play className="ml-1 h-6 w-6 fill-white text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 text-xs text-white">
                    00:00 / {lesson.duration}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Video URL
          </label>

          <input
            type="url"
            value={lesson.videoUrl ?? ""}
            onChange={(e) => onChange("videoUrl", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
          />
        </div>
      )}

      {/* Settings */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700">
            Duration
          </label>

          <input
            type="text"
            value={lesson.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
          />
        </div>

        <div className="rounded-xl border border-slate-200 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-800">Free Preview</p>
              <p className="text-[11px] text-slate-400">Allow preview</p>
            </div>

            <Toggle
              checked={lesson.freePreview ?? false}
              onChange={(value) => onChange("freePreview", value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-800">Downloadable</p>
              <p className="text-[11px] text-slate-400">Allow download</p>
            </div>

            <Toggle
              checked={lesson.downloadable ?? false}
              onChange={(value) => onChange("downloadable", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
