import { ChevronDown } from "lucide-react";
import Image from "next/image";
import ResumeDialog from "@/components/resume/ResumeDialog";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { heroContent, homeImages } from "@/content/home";

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-(--header-height) flex min-h-svh overflow-hidden pt-(--header-height)">
      {/* Portrait: full-bleed on mobile, right side on desktop, fading into the page */}
      <div className="absolute inset-0 -z-10 md:left-1/3">
        <Image
          src={homeImages.hero.src}
          alt={homeImages.hero.alt}
          fill
          priority
          sizes="(min-width: 768px) 67vw, 100vw"
          className="object-cover object-[60%_20%] opacity-60 md:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent md:bg-linear-to-r md:from-neutral-950 md:via-neutral-950/30" />
      </div>

      <Container className="flex flex-col justify-end gap-8 pb-20">
        <div>
          <ul
            aria-label="Roles"
            className="flex flex-wrap items-center gap-x-3 font-space text-small tracking-wider text-brand-500 uppercase md:text-body"
          >
            {heroContent.roles.map((role) => (
              <li key={role} className="not-first:before:mr-3 not-first:before:content-['•']">
                {role}
              </li>
            ))}
          </ul>
          <h1 className="display-font mt-4">
            {heroContent.firstName} <br /> {heroContent.lastName}
          </h1>
        </div>
        <p className="max-w-md text-lg text-neutral-200 md:text-xl">{heroContent.tagline}</p>
        <div className="flex flex-wrap gap-4">
          <ResumeDialog variant="primary" />
          <Button href={heroContent.cta.href}>{heroContent.cta.label}</Button>
        </div>
      </Container>

      <a
        href="#model-shots"
        aria-label="Scroll to Model Shots"
        className="absolute bottom-6 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full border border-neutral-100/40 text-neutral-100 transition-colors hover:bg-neutral-100/10"
      >
        <ChevronDown aria-hidden="true" className="size-6 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
