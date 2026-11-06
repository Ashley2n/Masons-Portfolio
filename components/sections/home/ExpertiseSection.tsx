import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { expertiseItems, sectionHeadings } from "@/content/home";
import { cn } from "@/lib/utils";
import type { ExpertiseItem } from "@/types/content";

// Widths alternate row by row so the four cards read as a composition, not a uniform grid
const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

const ExpertiseCard = ({ item, className }: { item: ExpertiseItem; className?: string }) => (
  <li
    className={cn(
      "reveal group relative isolate flex min-h-80 items-end overflow-hidden rounded-lg bg-neutral-800 text-neutral-100 md:min-h-112",
      className,
    )}
  >
    <Image
      src={item.image.src}
      alt={item.image.alt}
      width={item.image.width}
      height={item.image.height}
      sizes="(min-width: 1280px) 700px, (min-width: 768px) 55vw, 100vw"
      className={cn(
        "absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105",
        item.imagePosition,
      )}
    />
    {/* Dark at the bottom so the white text stays above AA contrast on any photo; purple at the top keeps the brand tint */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950/90 via-neutral-950/35 to-brand-800/25"
    />
    <div className="space-y-2 p-6 md:p-8">
      <h3 className="text-h1 font-semibold md:text-display/tight">{item.title}</h3>
      <p className="text-body text-neutral-200">{item.description}</p>
    </div>
  </li>
);

export default function ExpertiseSection() {
  return (
    <section className="surface-light bg-neutral-100 py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeading tone="light" {...sectionHeadings.expertise} />
        <ul aria-label="Expertise" className="grid gap-4 md:grid-cols-12 md:gap-6">
          {expertiseItems.map((item, index) => (
            <ExpertiseCard key={item.id} item={item} className={spans[index]} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
