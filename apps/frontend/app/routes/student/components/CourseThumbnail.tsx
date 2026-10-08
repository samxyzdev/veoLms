import { useState } from "react";
import type { ReactNode } from "react";

export type CourseArtKey =
  | "react"
  | "node"
  | "html"
  | "typescript"
  | "nextjs"
  | "design"
  | "javascript"
  | "git"
  | "default";

const courseArtwork: Record<
  CourseArtKey,
  { gradient: string; content: ReactNode }
> = {
  react: {
    gradient: "from-slate-950 via-indigo-950 to-cyan-500",
    content: <span className="text-5xl text-cyan-300">⚛</span>,
  },
  node: {
    gradient: "from-slate-950 via-emerald-950 to-green-500",
    content: (
      <span className="text-3xl font-extrabold tracking-wide text-white">
        node
        <span className="ml-1 text-sm text-green-300">JS</span>
      </span>
    ),
  },
  html: {
    gradient: "from-orange-500 via-red-500 to-blue-500",
    content: (
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">5</span>
        <span className="rounded-lg bg-white/10 px-3 py-2 text-3xl font-black text-white backdrop-blur">3</span>
      </div>
    ),
  },
  typescript: {
    gradient: "from-blue-700 via-blue-600 to-cyan-400",
    content: (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
        <span className="text-3xl font-black text-white">TS</span>
      </div>
    ),
  },
  nextjs: {
    gradient: "from-black via-slate-900 to-slate-700",
    content: (
      <span className="text-3xl font-light tracking-[0.15em] text-white">
        NEXT
        <span className="text-sm tracking-normal">.js</span>
      </span>
    ),
  },
  design: {
    gradient: "from-pink-500 via-purple-500 to-orange-400",
    content: (
      <div className="relative h-16 w-16">
        <span className="absolute left-0 top-0 h-8 w-8 rounded-full bg-orange-500" />
        <span className="absolute right-0 top-0 h-8 w-8 rounded-full bg-pink-400" />
        <span className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-sky-400" />
        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-400" />
        <span className="absolute left-4 top-4 h-8 w-8 rounded-full bg-violet-500" />
      </div>
    ),
  },
  javascript: {
    gradient: "from-yellow-400 via-yellow-500 to-orange-500",
    content: (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-yellow-400 shadow-inner">
        <span className="text-2xl font-black text-slate-900">JS</span>
      </div>
    ),
  },
  git: {
    gradient: "from-orange-500 via-red-600 to-slate-900",
    content: <span className="text-3xl font-black text-white">git</span>,
  },
  default: {
    gradient: "from-indigo-500 to-violet-500",
    content: <span className="text-3xl font-black tracking-wide text-white">COURSE</span>,
  },
};

export function getCourseArtKey(title: string): CourseArtKey {
  const value = title.toLowerCase();

  if (value.includes("typescript") || value.includes("type script")) {
    return "typescript";
  }
  if (value.includes("javascript") || value.includes("java script")) {
    return "javascript";
  }
  if (value.includes("react")) return "react";
  if (value.includes("node")) return "node";
  if (value.includes("html") || value.includes("css")) return "html";
  if (value.includes("next")) return "nextjs";
  if (value.includes("design") || value.includes("ui") || value.includes("ux")) {
    return "design";
  }
  if (value.includes("git") || value.includes("github")) return "git";

  return "default";
}

type CourseThumbnailProps = {
  artKey: CourseArtKey;
  title: string;
  imageUrl?: string | null;
  zoomOnHover?: boolean;
  className?: string;
  children?: ReactNode;
};

export function CourseThumbnail({
  artKey,
  title,
  imageUrl,
  zoomOnHover = false,
  className = "",
  children,
}: CourseThumbnailProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const art = courseArtwork[artKey] ?? courseArtwork.default;
  const isImageUrl = imageUrl && /^(https?:|data:image\/)/i.test(imageUrl);
  const showImage = Boolean(isImageUrl && failedImageUrl !== imageUrl);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${art.gradient} ${className}`}>
      {showImage ? (
        <img
          src={imageUrl!}
          alt={`${title} thumbnail`}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
            zoomOnHover ? "group-hover:scale-105" : ""
          }`}
          loading="lazy"
          onError={() => setFailedImageUrl(imageUrl!)}
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-12 left-8 h-28 w-28 rounded-full border border-white/10"
          />
          <div aria-hidden="true" className="relative flex h-full items-center justify-center">
            {art.content}
          </div>
        </>
      )}
      {children}
    </div>
  );
}
