import CtaBanner from "@/components/layout/CtaBanner";
import ExpertiseSection from "@/components/sections/home/ExpertiseSection";
import HeroSection from "@/components/sections/home/HeroSection";
import JourneySection from "@/components/sections/home/JourneySection";
import ModelShotsCarousel from "@/components/sections/home/ModelShotsCarousel";
import RecentWorkSection from "@/components/sections/home/RecentWorkSection";
import { pageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(pageSeo.home);

export default function Home() {
  return (
    <>
      <HeroSection />
      <JourneySection />
      <ExpertiseSection />
      <RecentWorkSection />
      <ModelShotsCarousel />
      <CtaBanner />
    </>
  );
}
