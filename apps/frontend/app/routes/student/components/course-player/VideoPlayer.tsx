import { FileText, Play } from "lucide-react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

type VideoPlayerProps = {
  title: string;
  video: string | null;
  poster: string | null;
  contentType: string;
};

export function VideoPlayer({ title, video, poster, contentType }: VideoPlayerProps) {
  const hasVideo = contentType === "video" && Boolean(video);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
      <div className="relative aspect-[16/7] overflow-hidden sm:aspect-[16/6] xl:aspect-[16/5.5]">
        {hasVideo ? (
          <MediaPlayer title={title} src={video!} poster={poster ?? undefined} className="h-full w-full" playsInline>
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
          </MediaPlayer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950">
            {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-indigo-950/20 to-blue-950/60" />
            <div className="relative flex flex-col items-center px-5 text-center text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/90 shadow-lg shadow-blue-950/40 sm:h-20 sm:w-20">
                {contentType === "video" ? <Play size={34} fill="currentColor" className="ml-1" /> : <FileText size={32} />}
              </div>
              <p className="mt-3 text-sm font-bold sm:text-base">{contentType === "video" ? "Video is not available yet" : `${contentType[0]?.toUpperCase()}${contentType.slice(1)} lesson`}</p>
              <p className="mt-1 max-w-sm text-xs text-white/70">{title}</p>
            </div>
            <div className="absolute inset-x-5 bottom-4 flex items-center gap-3 sm:inset-x-7 sm:bottom-5">
              <span className="h-1 flex-1 rounded-full bg-white/30"><span className="block h-full w-[12%] rounded-full bg-indigo-400" /></span>
              <span className="text-[10px] font-medium text-white/80">{contentType === "video" ? "Video pending" : "Lesson content"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
