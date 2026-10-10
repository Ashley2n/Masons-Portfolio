import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { pageIntros } from "@/content/pages";

export const metadata: Metadata = {
  title: "Contact",
};

// Placeholder until the full page is built (see docs/roadmap.md)
export default function ContactPage() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading as="h1" {...pageIntros.contact} />
      </Container>
    </section>
  );
}
