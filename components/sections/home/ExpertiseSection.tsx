import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { expertiseItems, sectionHeadings } from "@/content/home";
import { cn } from "@/lib/utils";
import type { ExpertiseItem } from "@/types/content";

const ExpertiseCard = ({ item }: { item: ExpertiseItem }) => (
  <Link
    href={item.href}
    className={cn(
      "group flex min-h-40 items-end justify-between gap-4 rounded-lg p-6 text-neutral-100 transition-transform duration-300 hover:scale-102 md:min-h-48 md:p-8",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
      item.colorClass,
    )}
  >
    <div className="space-y-2">
      <h3 className="text-h2 font-semibold">{item.title}</h3>
      <p className="text-small">{item.description}</p>
    </div>
    <ArrowUpRight
      aria-hidden="true"
      className="size-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
      strokeWidth={1.5}
    />
  </Link>
);

export default function ExpertiseSection() {
  return (
    <section className="bg-neutral-100 py-16">
      <Container className="space-y-12">
        <SectionHeading tone="light" {...sectionHeadings.expertise} />
        <div className="grid gap-4 sm:grid-cols-2">
          {expertiseItems.map((item) => (
            <ExpertiseCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
