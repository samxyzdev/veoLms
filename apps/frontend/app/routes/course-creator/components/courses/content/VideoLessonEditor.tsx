import { useEffect, useState, type ChangeEvent } from "react";
import { CheckCircle2, Play, Upload, Video } from "lucide-react";

import type { Lesson } from "./types";

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-violet-600" : "bg-slate-300"}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function isUploadedVideo(value?: string) {
  return Boolean(value?.startsWith("courses/") && value.includes("/videos/"));
}

export function VideoLessonEditor({ lesson, onChange, onUploadVideo, disabled = false }: { lesson: Lesson; onChange: <K extends keyof Lesson>(key: K, value: Lesson[K]) => void; onUploadVideo: (file: File, onProgress: (progress: number) => void) => Promise<string>; disabled?: boolean }) {
  const [source, setSource] = useState<"upload" | "url">(lesson.videoUrl && !isUploadedVideo(lesson.videoUrl) ? "url" : "upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    const previewUrl = lesson.videoFile;
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [lesson.videoFile]);

  async function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.currentTarget.value = "";
    if (file.size > 2 * 1024 * 1024 * 1024) {
      window.alert("Maximum video size is 2GB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("video/")) {
      window.alert("Choose a video file.");
      event.target.value = "";
      return;
    }

    if (lesson.videoFile?.startsWith("blob:")) URL.revokeObjectURL(lesson.videoFile);
    const previewUrl = URL.createObjectURL(file);
    onChange("videoFile", previewUrl);
    setSelectedFileName(file.name);
    setUploadProgress(0);
    setUploadError(null);
    setIsUploading(true);
    try {
      const key = await onUploadVideo(file, setUploadProgress);
      onChange("videoUrl", key);
      setUploadProgress(100);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not upload video.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Upload Video Content</h3>
        <p className="mt-1 text-xs text-slate-500">Upload a video directly to secure storage or add an external video URL.</p>
      </div>

      <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
        <button type="button" onClick={() => setSource("upload")} disabled={disabled} className={`rounded-md py-2 text-sm font-medium disabled:opacity-50 ${source === "upload" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}>
          <span className="inline-flex items-center gap-2"><Upload className="h-4 w-4" />Upload Video</span>
        </button>
        <button type="button" onClick={() => setSource("url")} disabled={disabled} className={`rounded-md py-2 text-sm font-medium disabled:opacity-50 ${source === "url" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}>
          <span className="inline-flex items-center gap-2"><Video className="h-4 w-4" />Video URL</span>
        </button>
      </div>

      {source === "upload" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <label className={`flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 text-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-violet-400"}`}>
            <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo" onChange={(event) => void handleVideoUpload(event)} disabled={disabled} className="hidden" />
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600"><Upload className="h-5 w-5" /></div>
            <p className="text-sm font-semibold text-slate-700">Click to upload a video</p>
            <p className="mt-1 text-xs text-slate-400">MP4, MOV, AVI, WebM (Max 2GB)</p>
            <p className="mt-1 text-xs text-slate-400">Recommended: 1080p</p>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-900">Video Preview</p>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
              {lesson.videoFile ? (
                <video src={lesson.videoFile} controls className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20"><Play className="ml-1 h-6 w-6 fill-white text-white" /></div></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 text-xs text-white">00:00 / {lesson.duration || "0:00"}</div>
                </>
              )}
            </div>
            {selectedFileName && <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3" role="status" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-xs font-medium text-slate-700">{isUploading ? `Uploading ${selectedFileName}` : uploadError ? selectedFileName : `Uploaded ${selectedFileName}`}</p>
                {!isUploading && !uploadError && uploadProgress === 100 && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Video upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}>
                <div className="h-full rounded-full bg-violet-600 transition-[width]" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-right text-[11px] text-slate-500">{uploadProgress}%</p>
              {uploadError && <p role="alert" className="mt-1 text-xs text-red-600">{uploadError}</p>}
            </div>}
            {!selectedFileName && isUploadedVideo(lesson.videoUrl) && <p className="mt-2 text-xs font-medium text-emerald-700">A video is uploaded for this lesson. Choose another file to replace it.</p>}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">Video URL</label>
          <input type="url" value={isUploadedVideo(lesson.videoUrl) ? "" : lesson.videoUrl ?? ""} onChange={(event) => onChange("videoUrl", event.target.value)} disabled={disabled} placeholder="https://youtube.com/watch?v=..." className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 disabled:bg-slate-50" />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700">Duration</label>
          <input type="text" value={lesson.duration} onChange={(event) => onChange("duration", event.target.value)} disabled={disabled} placeholder="e.g. 12:30" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 disabled:bg-slate-50" />
        </div>
        <div className="rounded-xl border border-slate-200 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-slate-800">Free Preview</p><p className="text-[11px] text-slate-400">Allow preview</p></div>
            <Toggle checked={lesson.freePreview} onChange={(value) => onChange("freePreview", value)} disabled={disabled} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-slate-800">Downloadable</p><p className="text-[11px] text-slate-400">Allow download</p></div>
            <Toggle checked={lesson.downloadable} onChange={(value) => onChange("downloadable", value)} disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
}
