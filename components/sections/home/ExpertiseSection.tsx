import { expertiseItems } from "@/content/home";
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
    <span className="font-normal text-2xl flex justify-end items-end">↗</span>
  </div>
);

export default function ExpertiseSection() {
  return (
    <section className="h-full bg-neutral-100 px-23 py-16 space-y-12">
      <div className="space-y-4">
        <p className="caption-text text-brand-600 ">Expertise</p>
        <h2 className="text-neutral-800">What I Do</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {expertiseItems.map((item) => (
          <ExpertiseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
