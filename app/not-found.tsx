import type { Metadata } from "next";
import Link from "next/link";
import { LoadEntrance, LoadItem } from "@/components/motion/LoadEntrance";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { notFoundContent } from "@/content/not-found";
import { navLinks } from "@/content/site";

export const metadata: Metadata = {
  title: notFoundContent.metaTitle,
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-x-clip py-24 text-center md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-96 -translate-x-1/2 rounded-full bg-brand-700/30 blur-[120px]"
      />
      <Container>
        <LoadEntrance className="flex flex-col items-center gap-6">
          <LoadItem>
            <Eyebrow>{notFoundContent.eyebrow}</Eyebrow>
          </LoadItem>
          <LoadItem>
            <h1 className="text-[2.5rem] leading-[1.1] font-normal text-neutral-100 md:text-display">
              {notFoundContent.title}
            </h1>
          </LoadItem>
          <LoadItem>
            <p className="max-w-md text-neutral-300">{notFoundContent.description}</p>
          </LoadItem>
          <LoadItem>
            <Button href="/">{notFoundContent.homeLabel}</Button>
          </LoadItem>
          <LoadItem className="mt-6">
            <nav aria-label={notFoundContent.suggestionsLabel} className="space-y-3">
              <p className="text-small text-neutral-400">{notFoundContent.suggestionsIntro}</p>
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="caption-text text-neutral-300 underline-offset-4 transition-colors hover:text-brand-400 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </LoadItem>
        </LoadEntrance>
      </Container>
    </section>
  );
}
