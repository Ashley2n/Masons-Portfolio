import GlowBackground from "@/components/ui/GlowBackground";
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
      <div className="space-y-4">
        <p className="caption-text text-brand-600 ">About Me</p>
        <h2 className="text-neutral-800">The Journey So Far</h2>
        <p className="max-w-md text-neutral-600">
          Years of training, stages, and performances that shaped where I am today
        </p>
      </div>
      <div className="flex justify-between py-8">
        {stats.map((stat) => (
          <StatItem key={stat.id} {...stat} />
        ))}
      </div>
      <div className="bg-neutral-700 rounded-lg h-1/2 mt-16"></div>
    </GlowBackground>
  );
}
