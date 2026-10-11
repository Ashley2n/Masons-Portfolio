import type { Metadata } from "next";
import { pageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import CtaBanner from "@/components/layout/CtaBanner";
import AboutHero from "@/components/sections/about/AboutHero";
import Timeline from "@/components/sections/about/Timeline";

export const metadata: Metadata = pageMetadata(pageSeo.about);

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <CtaBanner />
    </>
  );
}
