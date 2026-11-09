import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { LoadEntrance, LoadItem } from "@/components/motion/LoadEntrance";
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

      <Container className="flex flex-col justify-end pb-20">
        {/* Load entrance (D-44): five pieces arrive 0.3s apart, 3s in total */}
        <LoadEntrance className="flex flex-col gap-8">
          <div>
            <LoadItem>
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
            </LoadItem>
            <LoadItem className="mt-4">
              <h1 className="display-font">
                {heroContent.firstName} <br /> {heroContent.lastName}
              </h1>
            </LoadItem>
          </div>
          <LoadItem>
            <p className="max-w-md text-lg text-neutral-200 md:text-xl">{heroContent.tagline}</p>
          </LoadItem>
          <div className="flex flex-wrap gap-4">
            <LoadItem>
              <ResumeDialog variant="primary" />
            </LoadItem>
            <LoadItem>
              <Button href={heroContent.cta.href}>{heroContent.cta.label}</Button>
            </LoadItem>
          </div>
        </LoadEntrance>
      </Container>

      <a
        href="#model-shots"
        aria-label="Scroll to Model Shots"
        className="absolute right-4 bottom-6 grid size-11 place-items-center sm:right-6 md:right-10 rounded-full border border-neutral-100/40 text-neutral-100 transition-colors hover:bg-neutral-100/10"
      >
        <ChevronDown aria-hidden="true" className="size-6 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
