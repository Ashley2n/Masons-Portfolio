import Image from "next/image";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import GlowBackground from "@/components/ui/GlowBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { homeImages, sectionHeadings, stats } from "@/content/home";
import type { Stat } from "@/types/content";

const StatItem = ({ value, label, index }: Stat & { index: number }) => (
  <Reveal index={index} className="border-t border-neutral-800 pt-5">
    <p className="font-playfair text-6xl leading-none text-brand-400 tabular-nums md:text-7xl">
      <CountUp value={value} index={index} />
      <span className="text-4xl text-brand-500 md:text-5xl">+</span>
    </p>
    <p className="mt-3 max-w-48 text-small text-neutral-300">{label}</p>
  </Reveal>
);

export default function JourneySection() {
  return (
    <GlowBackground className="bg-neutral-950 pt-16 pb-24 md:pb-32">
      <Container className="space-y-12 md:space-y-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <SectionHeading className="lg:col-span-5" {...sectionHeadings.journey} />
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {stats.map((stat, index) => (
              <StatItem key={stat.id} {...stat} index={index} />
            ))}
          </div>
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
