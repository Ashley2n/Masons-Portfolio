import type { Metadata } from "next";
import CtaBanner from "@/components/layout/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { pageIntros } from "@/content/pages";

export const metadata: Metadata = {
  title: "Resume",
};

// Placeholder until the full page is built (see docs/roadmap.md)
export default function ResumePage() {
  return (
    <>
      <section className="py-24">
        <Container>
          <SectionHeading as="h1" {...pageIntros.resume} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
