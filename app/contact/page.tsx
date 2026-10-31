import type { Metadata } from "next";
import { pageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import ContactCard from "@/components/sections/contact/ContactCard";
import ContactForm from "@/components/sections/contact/ContactForm";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { contactContent } from "@/content/contact";

export const metadata: Metadata = pageMetadata(pageSeo.contact);

export default function ContactPage() {
  return (
    <section className="relative isolate overflow-x-clip py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 -z-10 size-96 rounded-full bg-brand-700/30 blur-[120px]"
      />
      <Container className="grid gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
        <div className="space-y-10">
          <div className="space-y-6">
            <Eyebrow>{contactContent.eyebrow}</Eyebrow>
            <h1 className="text-[2.75rem] leading-[1.05] font-normal text-neutral-100 md:text-display">
              {contactContent.title}
            </h1>
            <p className="max-w-md text-neutral-300">{contactContent.intro}</p>
            <span aria-hidden="true" className="block h-0.5 w-12 bg-brand-500" />
          </div>
          <ContactForm />
        </div>
        <ContactCard />
      </Container>
    </section>
  );
}
