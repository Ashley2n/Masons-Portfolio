import ExpertiseSection from "@/components/sections/home/ExpertiseSection";
import HeroSection from "@/components/sections/home/HeroSection";
import JourneySection from "@/components/sections/home/JourneySection";
import ModelShotsCarousel from "@/components/sections/home/ModelShotsCarousel";
import RecentWorkSection from "@/components/sections/home/RecentWorkSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <JourneySection />
      <ExpertiseSection />
      <RecentWorkSection />
      <ModelShotsCarousel />
    </>
  );
}
