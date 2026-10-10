import GlowBackground from "@/components/ui/GlowBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats } from "@/content/home";
import type { Stat } from "@/types/content";

const StatItem = ({ value, label }: Stat) => (
  <div>
    <p className="font-playfair text-7xl text-brand-800">
      {value}
      <span className="text-brand-600 text-4xl">+</span>
    </p>
    <p className="text-neutral-700">{label}</p>
  </div>
);

export default function JourneySection() {
  return (
    <GlowBackground className="h-screen bg-neutral-100 px-23 py-16">
      <SectionHeading
        tone="light"
        eyebrow="About Me"
        title="The Journey So Far"
        description="Years of training, stages, and performances that shaped where I am today"
      />
      <div className="flex justify-between py-8">
        {stats.map((stat) => (
          <StatItem key={stat.id} {...stat} />
        ))}
      </div>
      <div className="bg-neutral-700 rounded-lg h-1/2 mt-16"></div>
    </GlowBackground>
  );
}
