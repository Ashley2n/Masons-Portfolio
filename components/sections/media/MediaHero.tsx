import { LoadEntrance, LoadItem } from "@/components/motion/LoadEntrance";
import Container from "@/components/ui/Container";
import { mediaContent } from "@/content/media";

export default function MediaHero() {
  return (
    <section className="relative isolate overflow-x-clip py-16 text-center md:py-24">
      {/* Purple glows at both edges, as in the mockup */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-96 rounded-full bg-brand-700/30 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/3 -z-10 size-96 rounded-full bg-brand-700/30 blur-[120px]" />
      <Container>
        <LoadEntrance className="flex flex-col items-center gap-6">
          <LoadItem>
            <h1 className="text-[2.5rem] leading-[1.1] font-normal text-neutral-100 md:text-display">
              {mediaContent.title}
            </h1>
          </LoadItem>
          <LoadItem>
            <p className="max-w-md text-neutral-300">{mediaContent.description}</p>
          </LoadItem>
        </LoadEntrance>
      </Container>
    </section>
  );
}
