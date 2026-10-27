import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { ctaBanner } from "@/content/site";

/** "Interested in working together?" banner shown above the footer. */
export default function CtaBanner() {
  return (
    <section className="py-12">
      <Container>
        <div className="surface-color flex flex-col items-center gap-6 rounded-lg bg-linear-to-r from-brand-800 via-brand-700 to-brand-500 px-6 py-12 text-center">
          <h2 className="text-neutral-100 md:text-display/tight">{ctaBanner.title}</h2>
          <Button href={ctaBanner.href} variant="light">
            {ctaBanner.buttonLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
