import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { expertiseItems, sectionHeadings } from "@/content/home";
import { cn } from "@/lib/utils";
import type { ExpertiseItem } from "@/types/content";

const ExpertiseCard = ({ item }: { item: ExpertiseItem }) => (
  <div
    className={cn(
      "rounded-lg text-neutral-100 p-8 pt-24 grid grid-cols-2 hover:scale-102 transition-transform duration-300 group cursor-pointer",
      item.colorClass,
    )}
  >
    <div className="space-y-4">
      <h2 className="">{item.title}</h2>
      <p className="text-sm">{item.description}</p>
    </div>
    <span className="flex items-end justify-end">
      <ArrowUpRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
    </span>
  </div>
);

export default function ExpertiseSection() {
  return (
    <section className="h-full bg-neutral-100 px-23 py-16 space-y-12">
      <SectionHeading tone="light" {...sectionHeadings.expertise} />
      <div className="grid grid-cols-2 gap-4">
        {expertiseItems.map((item) => (
          <ExpertiseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
