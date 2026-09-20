import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Icons used by the course player controls. Same 24×24 currentColor style as
 * `components/landing/icons.tsx`, but the play/pause/volume glyphs need a
 * *filled* shape to read well inside the dark control bar.
 */
function StrokeIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

function FillIcon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

/** Solid triangle — the big centre-play button and the control bar play key. */
export function PlaySolidIcon(props: IconProps) {
  return (
    <FillIcon {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11.14-6.86a1 1 0 0 0 0-1.74L9.5 4.27A1 1 0 0 0 8 5.14Z" />
    </FillIcon>
  );
}

export function PauseSolidIcon(props: IconProps) {
  return (
    <FillIcon {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1.2" />
      <rect x="14" y="4" width="4" height="16" rx="1.2" />
    </FillIcon>
  );
}

/** Play triangle + horizontal bar: "jump to next lecture". */
export function NextLectureIcon(props: IconProps) {
  return (
    <FillIcon {...props}>
      <path d="M6 5.14v13.72a1 1 0 0 0 1.5.87l9-5.5V19a1 1 0 0 0 2 0V5a1 1 0 0 0-2 0v4.77l-9-5.5A1 1 0 0 0 6 5.14Z" />
    </FillIcon>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </StrokeIcon>
  );
}

export function MuteIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
      <path d="m16 9.5 5 5" />
      <path d="m21 9.5-5 5" />
    </StrokeIcon>
  );
}

export function Rewind10Icon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3.5 8.5h5v-5" />
      <path d="M3.6 8.6a9 9 0 1 1-1.1 5.1" />
      <path d="M10.3 13.6h2v4.2h-2.8" />
      <path d="M15.4 13.4h2.3v4.4h-2.3z" />
    </StrokeIcon>
  );
}

export function Forward10Icon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M20.5 8.5h-5v-5" />
      <path d="M20.4 8.6a9 9 0 1 0 1.1 5.1" />
      <path d="M6 13.6h2v4.2H5.2" />
      <path d="M11.1 13.4h2.3v4.4h-2.3z" />
    </StrokeIcon>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    </StrokeIcon>
  );
}

export function ExitFullscreenIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M16 3v3a2 2 0 0 0 2 2h3" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    </StrokeIcon>
  );
}

/** Picture-in-picture: a screen with a small inset screen. */
export function PipIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <rect x="12" y="11" width="8" height="7" rx="1" fill="currentColor" stroke="none" />
    </StrokeIcon>
  );
}

export function TheaterIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h6" />
    </StrokeIcon>
  );
}

export function KeyboardIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </StrokeIcon>
  );
}

/** Circular buffering spinner — add `animate-spin` when using it. */
export function SpinnerIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeWidth={2.2} />
    </StrokeIcon>
  );
}
