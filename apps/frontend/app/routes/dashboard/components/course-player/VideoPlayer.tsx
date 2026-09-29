import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

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
        <MediaPlayer
          title="Course Video"
          src={video.src}
          poster={video.poster}
          className="h-full w-full"
          playsInline
        >
          <MediaProvider />

          <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
        </MediaPlayer>

        {video.quality && (
          <div className="pointer-events-none absolute right-3 top-3 z-10">
            <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {video.quality}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
