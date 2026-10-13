import { FileText, Maximize2, Minimize2, Play, RotateCcw, RotateCw } from "lucide-react";
import { MediaPlayer, MediaProvider, SeekButton } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "./VideoPlayer.css";

type VideoPlayerProps = {
  title: string;
  video: string | null;
  poster: string | null;
  contentType: string;
  theaterMode: boolean;
  onTheaterModeChange: (enabled: boolean) => void;
};

export function VideoPlayer({ title, video, poster, contentType, theaterMode, onTheaterModeChange }: VideoPlayerProps) {
  const hasVideo = contentType === "video" && Boolean(video);

  return (
    <div className="course-video-player-shell relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-sm">
      {hasVideo ? (
        <MediaPlayer title={title} src={video!} poster={poster ?? undefined} className="course-video-player absolute inset-0 h-full w-full" playsInline>
          <MediaProvider />
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            colorScheme="dark"
            menuGroup="bottom"
            seekStep={10}
            playbackRates={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}
            slots={{
              beforePlayButton: (
                <SeekButton seconds={-10} className="vds-button" aria-label="Seek back 10 seconds">
                  <RotateCcw className="vds-icon h-5 w-5" />
                </SeekButton>
              ),
              afterPlayButton: (
                <SeekButton seconds={10} className="vds-button" aria-label="Seek forward 10 seconds">
                  <RotateCw className="vds-icon h-5 w-5" />
                </SeekButton>
              ),
              beforeFullscreenButton: (
                <button
                  type="button"
                  className="vds-button"
                  aria-label={theaterMode ? "Exit theater mode" : "Enter theater mode"}
                  aria-pressed={theaterMode}
                  onClick={() => onTheaterModeChange(!theaterMode)}
                >
                  {theaterMode ? <Minimize2 className="vds-icon" /> : <Maximize2 className="vds-icon" />}
                </button>
              ),
              downloadButton: null,
            }}
          />
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
  );
}
