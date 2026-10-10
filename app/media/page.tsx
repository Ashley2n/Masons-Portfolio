import type { Metadata } from "next";
import CtaBanner from "@/components/layout/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { pageIntros } from "@/content/pages";

export const metadata: Metadata = {
  title: "Media",
};

// Placeholder until the full page is built (see docs/roadmap.md)
export default function MediaPage() {
  return (
    <>
      <section className="py-24">
        <Container>
          <SectionHeading as="h1" {...pageIntros.media} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
