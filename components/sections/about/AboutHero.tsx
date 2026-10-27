import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ResumeDialog from "@/components/resume/ResumeDialog";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { aboutContent } from "@/content/about";

export default function AboutHero() {
  const { feature } = aboutContent;

  return (
    <section className="relative isolate overflow-x-clip py-16 md:py-24">
      {/* Soft purple glow behind the intro, as in the mockup */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/4 -z-10 size-96 rounded-full bg-brand-700/30 blur-[120px]"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Eyebrow>{aboutContent.eyebrow}</Eyebrow>
          <h1 className="text-[2.75rem] leading-[1.1] text-neutral-100 md:text-display">
            {aboutContent.title}
          </h1>
          <div className="max-w-md space-y-4 text-neutral-300">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div aria-hidden="true" className="h-px w-16 bg-brand-600" />
          <p className="font-signature text-5xl text-brand-500">{aboutContent.signature}</p>
          <ResumeDialog />
        </div>

        <Link
          href={feature.href}
          className="group relative block aspect-4/3 overflow-hidden rounded-lg"
        >
          {/* Text first so the link is announced as "Designer, …" before the image */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-6 text-neutral-100 md:p-8">
            <div>
              {/* Styled like an h2 but not one: a link label shouldn't add a section to the outline */}
              <p className="text-h2 font-playfair font-semibold">{feature.title}</p>
              <p className="text-small">{feature.description}</p>
            </div>
            <ArrowUpRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </div>
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent" />
        </Link>
      </Container>
    </section>
  );
}
