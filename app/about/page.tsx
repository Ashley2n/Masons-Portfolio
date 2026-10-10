import type { Metadata } from "next";
import CtaBanner from "@/components/layout/CtaBanner";
import AboutHero from "@/components/sections/about/AboutHero";
import Timeline from "@/components/sections/about/Timeline";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <CtaBanner />
    </>
  );
}
