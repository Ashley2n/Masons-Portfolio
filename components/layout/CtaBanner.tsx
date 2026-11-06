import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { ctaBanner } from "@/content/site";

/** "Interested in working together?" banner shown above the footer. */
export default function CtaBanner() {
  return (
    <section className="border-t border-neutral-800 py-12 md:py-20">
      <Container>
        {/* Dark panel with the purple glow on the right, away from the heading, so the heading
            stays above AA contrast (D-33: it was 2.5:1 on the old gradient) */}
        <div className="surface-color flex flex-col items-start gap-8 overflow-hidden rounded-2xl bg-neutral-900 bg-[radial-gradient(70%_140%_at_100%_100%,var(--color-brand-700),transparent_65%)] px-6 py-12 ring-1 ring-brand-500/20 md:flex-row md:items-center md:justify-between md:gap-12 md:px-12 md:py-16">
          <h2 className="max-w-2xl text-balance text-4xl text-neutral-100 md:text-display/tight">
            {ctaBanner.title}
          </h2>
          <Button href={ctaBanner.href} variant="light" className="shrink-0">
            {ctaBanner.buttonLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
