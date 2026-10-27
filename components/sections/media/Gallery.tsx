"use client";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VideoCard from "@/components/ui/VideoCard";
import { galleryCategories, galleryItems, mediaContent } from "@/content/media";
import { countByCategory, filterGallery, type GalleryFilter } from "@/lib/gallery";
import { cn } from "@/lib/utils";

const counts = countByCategory(galleryItems);

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [visibleCount, setVisibleCount] = useState(mediaContent.pageSize);
  const listRef = useRef<HTMLUListElement>(null);
  // Index of the first item added by "Load more", focused once it renders so focus
  // is never lost when the button disappears.
  const focusIndex = useRef<number | null>(null);

  const matching = filterGallery(galleryItems, filter);
  const shown = matching.slice(0, visibleCount);

  useEffect(() => {
    if (focusIndex.current === null) return;
    (listRef.current?.children[focusIndex.current] as HTMLElement | undefined)?.focus();
    focusIndex.current = null;
  }, [visibleCount]);

  const loadMore = () => {
    focusIndex.current = shown.length;
    setVisibleCount((count) => count + mediaContent.pageSize);
  };

  const choose = (next: GalleryFilter) => {
    setFilter(next);
    setVisibleCount(mediaContent.pageSize);
  };

  return (
    <div className="space-y-8">
      <div
        role="group"
        aria-label="Filter by category"
        className="flex gap-6 overflow-x-auto pb-2 md:gap-10"
      >
        {galleryCategories.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => choose(id)}
            disabled={counts[id] === 0}
            className={cn(
              "caption-text shrink-0 border-b-2 pb-2 transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400",
              filter === id
                ? "border-brand-600 text-brand-500"
                : "border-transparent text-neutral-300 hover:text-neutral-100",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        Showing {shown.length} of {matching.length}
      </p>

      {/* Masonry via CSS columns: every item keeps its own aspect ratio */}
      {/* Gives the hidden video titles (h3) a parent heading */}
      <h2 id="gallery-heading" className="sr-only">
        Gallery
      </h2>
      <ul
        ref={listRef}
        aria-labelledby="gallery-heading"
        className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
      >
        {shown.map((item, index) => (
          <li
            key={item.id}
            tabIndex={-1}
            className="mb-4 break-inside-avoid rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
          >
            {item.kind === "photo" ? (
              <Image
                src={item.photo.src}
                alt={item.photo.alt}
                width={item.photo.width}
                height={item.photo.height}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full rounded-lg bg-neutral-800"
                // The first photo is the mobile LCP: load it eagerly, not lazily (Next docs:
                // prefer loading/fetchPriority over preload when the LCP varies by viewport)
                {...(index === 0 && { loading: "eager", fetchPriority: "high" })}
              />
            ) : (
              <VideoCard
                video={item.video}
                showMeta={false}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
          </li>
        ))}
      </ul>

      {shown.length < matching.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="caption-text inline-flex items-center gap-2 text-neutral-100 transition-colors hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"
          >
            {mediaContent.loadMore}
            <ArrowDown aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
