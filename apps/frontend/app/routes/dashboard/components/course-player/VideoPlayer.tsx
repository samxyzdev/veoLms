import { Maximize, Settings } from "lucide-react";

type VideoPlayerProps = {
  video: {
    src: string;
    poster?: string;
    quality?: string;
  };
};

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
      <div className="relative aspect-video">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          poster={video.poster}
          preload="metadata"
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video element.
        </video>

        {video.quality && (
          <div className="pointer-events-none absolute right-3 top-3">
            <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {video.quality}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
