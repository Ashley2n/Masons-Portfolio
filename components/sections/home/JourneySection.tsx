import Image from "next/image";
import Container from "@/components/ui/Container";
import GlowBackground from "@/components/ui/GlowBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { homeImages, sectionHeadings, stats } from "@/content/home";
import type { Stat } from "@/types/content";

const StatItem = ({ value, label }: Stat) => (
  <div>
    <p className="font-playfair text-6xl text-brand-800 md:text-7xl">
      {value}
      <span className="text-4xl text-brand-600">+</span>
    </p>
    <p className="max-w-48 text-neutral-700">{label}</p>
  </div>
);

export default function JourneySection() {
  return (
    <GlowBackground className="bg-neutral-100 py-16">
      <Container className="space-y-12">
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
