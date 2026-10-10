"use client";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatVideoDate, videoUrl, youTubeEmbedUrl, youTubeThumbnail } from "@/lib/video";
import type { Video } from "@/types/content";

type VideoCardProps = {
  video: Video;
  /** Text color for the page background behind the card */
  tone?: "light" | "dark";
  /** next/image `sizes` for the thumbnail */
  sizes?: string;
  /** Extra classes for the media frame, e.g. a wider aspect ratio */
  frameClassName?: string;
  /** false hides the title (still read by screen readers) and the date, e.g. in the gallery */
  showMeta?: boolean;
  className?: string;
};

const PlayBadge = () => (
  <span className="absolute inset-0 grid place-items-center bg-neutral-950/20 transition-colors duration-300 group-hover:bg-neutral-950/40">
    <span className="grid size-14 place-items-center rounded-full border border-neutral-100/80 bg-neutral-950/50 text-neutral-100 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
      <Play aria-hidden="true" className="ml-0.5 size-6" fill="currentColor" />
    </span>
  </span>
);

export default function VideoCard({
  video,
  tone = "light",
  sizes = "(min-width: 768px) 33vw, 100vw",
  frameClassName,
  showMeta = true,
  className,
}: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const frame = cn(
    "group relative block w-full overflow-hidden rounded-lg bg-neutral-800",
    video.orientation === "portrait" ? "aspect-9/16" : "aspect-video",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
    frameClassName,
  );

  let media;
  if (video.platform === "instagram") {
    media = (
      <a
        href={videoUrl(video)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch ${video.title} on Instagram`}
        className={frame}
      >
        <Image
          src={video.thumbnail.src}
          alt={video.thumbnail.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
        <PlayBadge />
      </a>
    );
  } else if (playing) {
    media = (
      <div className={frame}>
        <iframe
          src={youTubeEmbedUrl(video.youtubeId)}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  } else {
    media = (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${video.title}`}
        className={cn(frame, "cursor-pointer")}
      >
        <Image
          src={youTubeThumbnail(video.youtubeId)}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
        <PlayBadge />
      </button>
    );
  }

  return (
    <article className={cn("space-y-2", className)}>
      {media}
      {showMeta ? (
        <div>
          <h3
            className={cn(
              "font-inter text-small font-medium",
              tone === "light" ? "text-neutral-800" : "text-neutral-100",
            )}
          >
            {video.title}
          </h3>
          <time
            dateTime={video.date}
            className={cn("text-caption", tone === "light" ? "text-neutral-600" : "text-neutral-400")}
          >
            {formatVideoDate(video.date)}
          </time>
        </div>
      ) : (
        <h3 className="sr-only">{video.title}</h3>
      )}
    </article>
  );
}
