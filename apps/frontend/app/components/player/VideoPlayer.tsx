import { useCallback, useEffect, useRef, useState } from "react";

import { formatTimecode } from "../../lib/format";
import { CheckIcon, XIcon } from "../landing/icons";
import {
  ExitFullscreenIcon,
  Forward10Icon,
  FullscreenIcon,
  KeyboardIcon,
  MuteIcon,
  NextLectureIcon,
  PauseSolidIcon,
  PipIcon,
  PlaySolidIcon,
  Rewind10Icon,
  SpinnerIcon,
  VolumeIcon,
} from "./icons";

/** Playback speeds offered in the settings menu, slow → fast. */
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/** Controls fade out this long after the last mouse move while playing. */
const CONTROLS_HIDE_DELAY = 2800;

/** Seconds of playback between two progress saves (plus one on pause/end). */
const REPORT_EVERY_SECONDS = 5;

const VOLUME_STORAGE_KEY = "learnova:player-volume";

/** Shortcuts shown in the `?` overlay and handled by the window listener. */
const SHORTCUTS: [string, string][] = [
  ["k / Space", "Play or pause"],
  ["← / →", "Back or forward 5 seconds"],
  ["j / l", "Back or forward 10 seconds"],
  ["↑ / ↓", "Volume up or down"],
  ["0 – 9", "Jump to 0% – 90% of the video"],
  ["m", "Mute or unmute"],
  ["n", "Next lecture"],
  [", / .", "Slower or faster playback"],
  ["i", "Picture-in-picture"],
  ["f", "Fullscreen"],
  ["Home / End", "Jump to start or end"],
  ["? / /", "Show this list"],
];

/**
 * YouTube/Vimeo links can't be driven by the browser's video APIs, so they are
 * embedded in an iframe and keep their own controls. Everything else plays in
 * our own `<video>` with the custom control bar.
 */
function toEmbedUrl(url: string): string | null {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (youtube) {
    return `https://www.youtube.com/embed/${youtube[1]}?rel=0&modestbranding=1`;
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Small icon button used across the control bar. */
function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md p-1.5 text-white/90 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export function VideoPlayer({
  src,
  title,
  /** Where to resume from, in seconds (`watchedSeconds` from the backend). */
  startAt = 0,
  /** Play as soon as the lecture loads — used when picking a new lecture. */
  autoPlay = false,
  isCompleted = false,
  hasNext = false,
  onNext,
  onProgress,
  onEnded,
}: {
  src: string;
  title: string;
  startAt?: number;
  autoPlay?: boolean;
  isCompleted?: boolean;
  hasNext?: boolean;
  onNext?: () => void;
  /** Called at most every 5s of playback, and on pause / end. */
  onProgress?: (positionSeconds: number, durationSeconds: number) => void;
  /** Fired when the video reaches the end (used to auto-play the next one). */
  onEnded?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const clickTimerRef = useRef<number | null>(null);
  const lastReportRef = useRef(0);

  // Keep the latest callbacks in refs so the listeners/effects below never need
  // to be rebuilt when the parent re-renders.
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
  });

  const embedUrl = toEmbedUrl(src);

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  const displayTime = dragging ? dragTime : currentTime;

  /* --------------------------- playback helpers -------------------------- */

  const reportProgress = useCallback((force = false) => {
    const video = videoRef.current;
    if (!video) return;

    const position = video.currentTime;
    if (
      force ||
      Math.abs(position - lastReportRef.current) >= REPORT_EVERY_SECONDS
    ) {
      lastReportRef.current = position;
      onProgressRef.current?.(position, video.duration || 0);
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const max = video.duration || 0;
    video.currentTime = clamp(seconds, 0, max > 0 ? max - 0.05 : 0);
    setCurrentTime(video.currentTime);
  }, []);

  const by = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video) return;
      seekTo(video.currentTime + delta);
    },
    [seekTo],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const changeVolume = useCallback((next: number) => {
    const video = videoRef.current;
    if (!video) return;
    const value = clamp(next, 0, 1);
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(value));
    }
  }, []);

  const changeRate = useCallback((next: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = next;
    setRate(next);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void container.requestFullscreen?.();
    }
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video?.requestPictureInPicture) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // Browser refused (unsupported format / not allowed) — nothing to do.
    }
  }, []);

  /* ------------------------------ side effects --------------------------- */

  // Restore the volume chosen in an earlier session.
  useEffect(() => {
    const stored = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0 && stored <= 1) {
      setVolume(stored);
      if (videoRef.current) videoRef.current.volume = stored;
    }
  }, []);

  // A new lecture means a new `src`: reset the UI state and resume from where
  // the user left off (`startAt`).
  useEffect(() => {
    setError(null);
    setWaiting(autoPlay);
    setCurrentTime(startAt);
    setDuration(0);
    setBuffered(0);
    setSettingsOpen(false);
    lastReportRef.current = startAt;

    const video = videoRef.current;
    if (!video || embedUrl) return;

    if (video.readyState >= 1) {
      if (startAt > 2 && (!video.duration || startAt < video.duration - 3)) {
        video.currentTime = startAt;
      }
      if (autoPlay) void video.play().catch(() => setPlaying(false));
    }
    // Only re-run when the lecture (src) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Show controls on mouse movement, then fade them out while playing.
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      setSettingsOpen(false);
    }, CONTROLS_HIDE_DELAY);
  }, []);

  useEffect(() => {
    if (!playing || shortcutsOpen || settingsOpen) {
      setControlsVisible(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      return;
    }
    scheduleHide();
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [playing, shortcutsOpen, settingsOpen, scheduleHide]);

  useEffect(
    () => () => {
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current);
    },
    [],
  );

  // Track fullscreen / picture-in-picture state (they can also be left with the
  // Esc key, not just our buttons).
  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    const onEnterPip = () => setIsPip(true);
    const onLeavePip = () => setIsPip(false);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("enterpictureinpicture", onEnterPip);
    document.addEventListener("leavepictureinpicture", onLeavePip);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("enterpictureinpicture", onEnterPip);
      document.removeEventListener("leavepictureinpicture", onLeavePip);
    };
  }, []);

  // Keyboard shortcuts (page-wide, like YouTube). Typing in a field is ignored.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      if (embedUrl) return; // third-party player owns its own shortcuts
      const video = videoRef.current;
      if (!video) return;

      const key = event.key;

      if (event.shiftKey && (key === "?" || key === "/")) {
        setShortcutsOpen((open) => !open);
        event.preventDefault();
        return;
      }

      if (key === "Escape") {
        setShortcutsOpen(false);
        setSettingsOpen(false);
        return;
      }

      if (key === " " || key.toLowerCase() === "k") {
        togglePlay();
      } else if (key === "ArrowLeft") {
        by(-5);
      } else if (key === "ArrowRight") {
        by(5);
      } else if (key.toLowerCase() === "j") {
        by(-10);
      } else if (key.toLowerCase() === "l") {
        by(10);
      } else if (key === "ArrowUp") {
        changeVolume(video.volume + 0.05);
      } else if (key === "ArrowDown") {
        changeVolume(video.volume - 0.05);
      } else if (key.toLowerCase() === "m") {
        toggleMute();
      } else if (key.toLowerCase() === "n") {
        if (hasNext) onNext?.();
      } else if (key.toLowerCase() === "i") {
        void togglePip();
      } else if (key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (key === "Home") {
        seekTo(0);
      } else if (key === "End") {
        seekTo(video.duration || 0);
      } else if (key === "," ) {
        changeRate(
          SPEEDS[Math.max(0, SPEEDS.indexOf(rate) - 1)] ?? SPEEDS[0],
        );
      } else if (key === ".") {
        changeRate(
          SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(rate) + 1)] ??
            SPEEDS[SPEEDS.length - 1],
        );
      } else if (/^[0-9]$/.test(key) && video.duration) {
        seekTo((Number(key) / 10) * video.duration);
      } else {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    by,
    changeRate,
    changeVolume,
    embedUrl,
    hasNext,
    onNext,
    rate,
    seekTo,
    toggleFullscreen,
    toggleMute,
    togglePip,
    togglePlay,
  ]);

  /* ------------------------- progress bar dragging ----------------------- */

  const fractionFromEvent = (clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: PointerEvent) => {
      const time = fractionFromEvent(event.clientX) * (duration || 0);
      setDragTime(time);
      // Live scrub: move the picture too, like YouTube's seek preview.
      if (videoRef.current && videoRef.current.readyState >= 1) {
        videoRef.current.currentTime = time;
      }
    };

    const onUp = () => {
      setDragging(false);
      reportProgress(true);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, duration, reportProgress]);

  const playedPercent =
    duration > 0 ? clamp((displayTime / duration) * 100, 0, 100) : 0;
  const bufferedPercent =
    duration > 0 ? clamp((buffered / duration) * 100, 0, 100) : 0;

  /* --------------------------------- embed ------------------------------- */

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-line bg-black">
        <div className="aspect-video w-full">
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    );
  }

  /* ------------------------------- player -------------------------------- */

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-black ${
        isFullscreen
          ? "flex h-screen w-screen items-center justify-center"
          : "rounded-xl border border-line"
      }`}
      onMouseMove={() => {
        setControlsVisible(true);
        if (playing && !settingsOpen && !shortcutsOpen) scheduleHide();
      }}
      onMouseLeave={() => {
        if (playing && !settingsOpen && !shortcutsOpen) setControlsVisible(false);
      }}
    >
      <div
        className={
          isFullscreen
            ? "relative flex h-full w-full items-center justify-center"
            : "relative aspect-video w-full"
        }
      >
        <video
          key={src}
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          className="size-full bg-black"
          onClick={() => {
            // Wait a beat so a double click (fullscreen) doesn't also toggle
            // playback, which is how YouTube behaves.
            if (clickTimerRef.current !== null) return;
            clickTimerRef.current = window.setTimeout(() => {
              clickTimerRef.current = null;
              togglePlay();
            }, 200);
          }}
          onDoubleClick={() => {
            if (clickTimerRef.current !== null) {
              window.clearTimeout(clickTimerRef.current);
              clickTimerRef.current = null;
            }
            toggleFullscreen();
          }}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setDuration(video.duration || 0);
            video.volume = volume;
            video.playbackRate = rate;
            if (startAt > 2 && (!video.duration || startAt < video.duration - 3)) {
              video.currentTime = startAt;
            }
          }}
          onTimeUpdate={(event) => {
            if (dragging) return;
            setCurrentTime(event.currentTarget.currentTime);
            if (!event.currentTarget.paused) reportProgress();
          }}
          onProgress={(event) => {
            const video = event.currentTarget;
            if (video.buffered.length > 0) {
              setBuffered(video.buffered.end(video.buffered.length - 1));
            }
          }}
          onPlay={() => {
            setPlaying(true);
            setWaiting(false);
          }}
          onPause={() => {
            setPlaying(false);
            reportProgress(true);
          }}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => {
            setWaiting(false);
            setError(null);
          }}
          onEnded={() => {
            setPlaying(false);
            setControlsVisible(true);
            reportProgress(true);
            onEndedRef.current?.();
          }}
          onError={() =>
            setError("This lecture video could not be loaded. Check the URL.")
          }
        />

        {/* Top gradient with the lecture title (fades with the controls) */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 pb-8 pt-3 transition-opacity duration-200 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {title}
            </p>
            {isCompleted && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand/25 px-2 py-0.5 text-[11px] font-semibold text-brand-light">
                <CheckIcon className="size-3" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Centre play / replay button while paused */}
        {!playing && !waiting && !error && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <button
              type="button"
              aria-label={currentTime > 0 ? "Resume lecture" : "Play lecture"}
              onClick={togglePlay}
              className="pointer-events-auto flex size-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:scale-105 hover:bg-brand"
            >
              <PlaySolidIcon className="ml-1 size-7" />
            </button>
          </div>
        )}

        {waiting && !error && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <SpinnerIcon className="size-10 animate-spin text-white" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/85 px-6 text-center">
            <p className="text-sm font-medium text-white">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                const video = videoRef.current;
                if (video) {
                  video.load();
                  void video.play().catch(() => setPlaying(false));
                }
              }}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Try again
            </button>
          </div>
        )}

        {/* Control bar */}
        <div
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-1.5 pt-10 transition-opacity duration-200 ${
            controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Seek bar */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(displayTime)}
            onPointerDown={(event) => {
              event.preventDefault();
              setDragging(true);
              setDragTime(fractionFromEvent(event.clientX) * (duration || 0));
            }}
            onPointerMove={(event) => {
              if (dragging) return;
              setHoverTime(fractionFromEvent(event.clientX) * (duration || 0));
            }}
            onPointerLeave={() => setHoverTime(null)}
            className="group/track relative -mx-1 flex h-4 cursor-pointer items-center px-1"
          >
            <div className="relative h-1 w-full rounded-full bg-white/25 transition-all duration-150 group-hover/track:h-1.5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/40"
                style={{ width: `${bufferedPercent}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-brand"
                style={{ width: `${playedPercent}%` }}
              />
              <div
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-0 shadow transition group-hover/track:opacity-100"
                style={{ left: `${playedPercent}%` }}
              />
            </div>

            {/* Hover time bubble */}
            {hoverTime !== null && duration > 0 && (
              <div
                className="pointer-events-none absolute -top-8 z-30 -translate-x-1/2 rounded bg-black/90 px-2 py-1 text-xs font-medium tabular-nums text-white"
                style={{
                  left: `${clamp((hoverTime / duration) * 100, 4, 96)}%`,
                }}
              >
                {formatTimecode(hoverTime)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-white">
            <ControlButton
              label={playing ? "Pause (k)" : "Play (k)"}
              onClick={togglePlay}
            >
              {playing ? (
                <PauseSolidIcon className="size-5" />
              ) : (
                <PlaySolidIcon className="size-5" />
              )}
            </ControlButton>

            <ControlButton label="Back 10 seconds (j)" onClick={() => by(-10)}>
              <Rewind10Icon className="size-5" />
            </ControlButton>

            <ControlButton label="Forward 10 seconds (l)" onClick={() => by(10)}>
              <Forward10Icon className="size-5" />
            </ControlButton>

            <ControlButton
              label="Next lecture (n)"
              onClick={() => onNext?.()}
              disabled={!hasNext}
            >
              <NextLectureIcon className="size-5" />
            </ControlButton>

            {/* Volume — the slider slides out on hover */}
            <div className="group/vol flex items-center">
              <ControlButton
                label={muted ? "Unmute (m)" : "Mute (m)"}
                onClick={toggleMute}
              >
                {muted || volume === 0 ? (
                  <MuteIcon className="size-5" />
                ) : (
                  <VolumeIcon className="size-5" />
                )}
              </ControlButton>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(event) => changeVolume(Number(event.target.value))}
                aria-label="Volume"
                className="h-4 w-0 cursor-pointer opacity-0 transition-all duration-200 accent-brand group-hover/vol:mr-2 group-hover/vol:w-20 group-hover/vol:opacity-100"
              />
            </div>

            <span className="ml-1 text-xs font-medium tabular-nums text-white/90">
              {formatTimecode(displayTime)}
              <span className="text-white/50">
                {" / "}
                {duration > 0 ? formatTimecode(duration) : "--:--"}
              </span>
            </span>

            <div className="ml-auto flex items-center gap-0.5">
              <ControlButton
                label="Keyboard shortcuts (?)"
                onClick={() => setShortcutsOpen(true)}
              >
                <KeyboardIcon className="size-5" />
              </ControlButton>

              <ControlButton
                label={isPip ? "Exit picture-in-picture" : "Picture-in-picture (i)"}
                onClick={() => void togglePip()}
              >
                <PipIcon className="size-5" />
              </ControlButton>

              {/* Playback speed menu */}
              <div className="relative">
                <ControlButton
                  label="Playback speed"
                  onClick={() => setSettingsOpen((open) => !open)}
                >
                  <span className="flex size-5 items-center justify-center text-xs font-bold">
                    {rate === 1 ? "1×" : `${rate}×`}
                  </span>
                </ControlButton>

                {settingsOpen && (
                  <div className="absolute bottom-10 right-0 z-30 w-36 rounded-lg border border-line bg-black/95 p-1.5 shadow-xl">
                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Speed
                    </p>
                    {SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => {
                          changeRate(speed);
                          setSettingsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition hover:bg-white/10 ${
                          rate === speed ? "text-brand-light" : "text-white/90"
                        }`}
                      >
                        <span>{speed === 1 ? "Normal" : `${speed}×`}</span>
                        {rate === speed && <CheckIcon className="size-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ControlButton
                label={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <ExitFullscreenIcon className="size-5" />
                ) : (
                  <FullscreenIcon className="size-5" />
                )}
              </ControlButton>
            </div>
          </div>
        </div>

        {/* Keyboard shortcut cheat sheet */}
        {shortcutsOpen && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShortcutsOpen(false)}
          >
            <div
              className="max-h-full w-full max-w-md overflow-y-auto rounded-xl border border-line bg-surface p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Keyboard shortcuts
                </h3>
                <button
                  type="button"
                  aria-label="Close shortcuts"
                  onClick={() => setShortcutsOpen(false)}
                  className="rounded-md p-1 text-gray-400 transition hover:text-white"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              <dl className="mt-4 space-y-2">
                {SHORTCUTS.map(([keys, label]) => (
                  <div key={keys} className="flex items-center justify-between gap-4">
                    <dt className="font-mono text-xs text-gray-300">{keys}</dt>
                    <dd className="text-right text-xs text-gray-500">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
