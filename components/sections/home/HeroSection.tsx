import Image from "next/image";
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
            className="caption-text flex flex-wrap items-center gap-x-3 text-brand-500"
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
        <p className="max-w-sm text-neutral-300">{heroContent.tagline}</p>
        <Button href={heroContent.cta.href}>{heroContent.cta.label}</Button>
      </Container>
    </section>
  );
}
