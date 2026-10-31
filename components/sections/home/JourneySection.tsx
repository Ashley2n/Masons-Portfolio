import Image from "next/image";
import Container from "@/components/ui/Container";
import GlowBackground from "@/components/ui/GlowBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { homeImages, sectionHeadings, stats } from "@/content/home";
import type { Stat } from "@/types/content";

const StatItem = ({ value, label }: Stat) => (
  <div>
    <p className="font-playfair text-5xl text-brand-800 md:text-6xl">
      {value}
      <span className="text-3xl text-brand-600 md:text-4xl">+</span>
    </p>
    <p className="mt-2 max-w-48 text-small text-neutral-700">{label}</p>
  </div>
);

export default function JourneySection() {
  return (
    <GlowBackground className="surface-light bg-neutral-100 pt-16 pb-24 md:pb-32">
      <Container className="space-y-12 md:space-y-14">
        <SectionHeading tone="light" {...sectionHeadings.journey} />
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatItem key={stat.id} {...stat} />
          ))}
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-800 lg:aspect-21/9">
          <Image
            src={homeImages.journey.src}
            alt={homeImages.journey.alt}
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </GlowBackground>
  );
}
