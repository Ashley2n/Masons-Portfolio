import { Check } from "lucide-react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutContent, milestones } from "@/content/about";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types/content";

const Node = ({ status }: Pick<Milestone, "status">) => (
  <span
    className={cn(
      "absolute left-4 top-1 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full ring-8 ring-brand-100 md:left-1/2",
      status === "complete" ? "bg-brand-600 text-neutral-100" : "bg-brand-500",
    )}
  >
    {status === "complete" && <Check aria-hidden="true" className="size-4" strokeWidth={3} />}
    <span className="sr-only">{status === "complete" ? "Completed" : "In progress"}</span>
  </span>
);

export default function Timeline() {
  const { journey } = aboutContent;

  return (
    <section className="bg-neutral-100 py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeading tone="light" eyebrow={journey.eyebrow} title={journey.title} />

        {/* ::before draws the line the milestones hang from: left on mobile, centered on desktop.
            A pseudo-element keeps the <ol> valid (only <li> children). */}
        <ol
          aria-label={journey.title}
          className="relative space-y-16 before:absolute before:inset-y-0 before:left-4 before:border-l-2 before:border-dashed before:border-neutral-300 before:content-[''] md:before:left-1/2"
        >
          {milestones.map((milestone, i) => {
            const textFirst = i % 2 === 0;
            return (
              <li
                key={milestone.id}
                className="relative grid gap-6 pl-12 md:grid-cols-2 md:gap-24 md:pl-0"
              >
                <Node status={milestone.status} />
                <div className={cn("space-y-3", textFirst ? "md:text-right" : "md:order-2")}>
                  <p className="caption-text text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-h3 font-semibold text-neutral-800">{milestone.title}</h3>
                  <span
                    aria-hidden="true"
                    className={cn("block h-0.5 w-8 bg-brand-500", textFirst && "md:ml-auto")}
                  />
                  <p className={cn("max-w-sm text-small text-neutral-600", textFirst && "md:ml-auto")}>
                    {milestone.description}
                  </p>
                </div>
                {milestone.image && (
                  <div
                    className={cn(
                      "relative aspect-video overflow-hidden rounded-lg bg-neutral-800",
                      !textFirst && "md:order-1",
                    )}
                  >
                    <Image
                      src={milestone.image.src}
                      alt={milestone.image.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                    {/* Brand tint so the stock photos share one look, like the mockup */}
                    <div className="absolute inset-0 bg-brand-700/25 mix-blend-color" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
