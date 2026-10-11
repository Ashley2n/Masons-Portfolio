import type { Metadata } from "next";
import { pageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import CtaBanner from "@/components/layout/CtaBanner";
import Gallery from "@/components/sections/media/Gallery";
import MediaHero from "@/components/sections/media/MediaHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = pageMetadata(pageSeo.media);

export default function MediaPage() {
  return (
    <>
      <MediaHero />
      <section id="gallery" className="scroll-mt-8 pb-8">
        <Container>
          <Gallery />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
