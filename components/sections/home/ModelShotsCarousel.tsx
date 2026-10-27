"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import Container from "@/components/ui/Container";
import { modelShots, sectionHeadings } from "@/content/home";
import { getNextIndex, getPrevIndex } from "@/lib/carousel";
import { cn } from "@/lib/utils";

const arrowClass =
  "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-neutral-950/50 text-neutral-100 backdrop-blur-sm transition-colors hover:bg-neutral-950/70 surface-color focus-visible:outline-offset-0";

export default function ModelShotsCarousel() {
  const [index, setIndex] = useState(0);
  const total = modelShots.length;
  const current = modelShots[index];
  const isPortrait = current.height > current.width;
  const next = () => setIndex((i) => getNextIndex(i, total));
  const prev = () => setIndex((i) => getPrevIndex(i, total));

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") next();
    else if (event.key === "ArrowLeft") prev();
  };

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="model-shots-heading"
      onKeyDown={onKeyDown}
      className="surface-light bg-neutral-100 py-16"
    >
      <Container className="space-y-6">
        <h2 id="model-shots-heading" className="text-neutral-800">
          {sectionHeadings.modelShots.title}
        </h2>

        <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-neutral-800 sm:aspect-video lg:aspect-21/9">
          {/* Wide screens: a portrait photo is shown whole over a blurred copy of itself instead of being cropped.
              The copy is decorative and tiny (it's blurred anyway). */}
          {isPortrait && (
            <Image
              key={`${current.id}-backdrop`}
              src={current.src}
              alt=""
              fill
              sizes="256px"
              className="hidden scale-110 object-cover blur-2xl brightness-50 sm:block"
            />
          )}
          <Image
            key={current.id}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className={cn("object-cover object-[50%_30%]", isPortrait && "sm:object-contain")}
          />
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

        <div className="flex justify-center gap-2">
          {modelShots.map((shot, i) => (
            <button
              key={shot.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${total}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative size-12 overflow-hidden rounded-md border-2 transition-colors sm:size-16",
                i === index ? "border-brand-600" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={shot.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
