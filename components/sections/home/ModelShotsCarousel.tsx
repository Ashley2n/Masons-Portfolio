"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Container from "@/components/ui/Container";
import { modelShots, sectionHeadings } from "@/content/home";
import { getNextIndex, getPrevIndex } from "@/lib/carousel";
import { cn } from "@/lib/utils";

const arrowClass =
  "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-neutral-950/50 text-neutral-100 backdrop-blur-sm transition-colors hover:bg-neutral-950/70 surface-color focus-visible:outline-offset-0";

export default function ModelShotsCarousel() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const total = modelShots.length;
  const current = modelShots[index];

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // Arrows, thumbnails and keys scroll the track; the track's scroll position is what swiping changes.
  // The index follows the track once it stops moving, so one swipe is one announcement, not several.
  const goTo = (i: number) => {
    setIndex(i);
    const track = trackRef.current;
    track?.scrollTo?.({ left: i * track.clientWidth });
  };
  const next = () => goTo(getNextIndex(index, total));
  const prev = () => goTo(getPrevIndex(index, total));
  const onScroll = () => {
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      const settled = Math.round(track.scrollLeft / track.clientWidth);
      if (settled >= 0 && settled < total) setIndex(settled);
    }, 100);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") next();
    else if (event.key === "ArrowLeft") prev();
  };

  if (!current) return null;

  return (
    <section
      id="model-shots"
      aria-roledescription="carousel"
      aria-labelledby="model-shots-heading"
      onKeyDown={onKeyDown}
      className="surface-light bg-neutral-100 py-16 md:pt-20"
    >
      <Container className="space-y-6">
        <h2 id="model-shots-heading" className="reveal text-neutral-800">
          {sectionHeadings.modelShots.title}
        </h2>

        <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-neutral-800 sm:aspect-video lg:aspect-21/9">
          {/* Swipe: a row of full-width slides that snap into place (CSS scroll-snap, no JavaScript for the gesture). */}
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex size-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
          >
            {modelShots.map((shot, i) => {
              const isPortrait = shot.height > shot.width;
              return (
                // Only the current photo is announced; the others are off-screen copies
                <div key={shot.id} aria-hidden={i !== index} className="relative size-full shrink-0 basis-full snap-center">
                  {/* Wide screens: a portrait photo is shown whole over a blurred copy of itself instead of being cropped.
                      The copy is decorative and tiny (it's blurred anyway). */}
                  {isPortrait && (
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="256px"
                      className="hidden scale-110 object-cover blur-2xl brightness-50 sm:block"
                    />
                  )}
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1280px) 1280px, 100vw"
                    className={cn("object-cover object-[50%_30%]", isPortrait && "sm:object-contain")}
                  />
                </div>
              );
            })}
          </div>
          <button type="button" onClick={prev} aria-label="Previous photo" className={cn(arrowClass, "left-4")}>
            <ChevronLeft aria-hidden="true" className="size-6" />
          </button>
          <button type="button" onClick={next} aria-label="Next photo" className={cn(arrowClass, "right-4")}>
            <ChevronRight aria-hidden="true" className="size-6" />
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          Photo {index + 1} of {total}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {modelShots.map((shot, i) => (
            <button
              key={shot.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1} of ${total}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative size-14 overflow-hidden rounded-md border-2 transition-colors sm:size-20 md:size-24",
                i === index ? "border-brand-600" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={shot.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
