# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** casting directors, agents and producers checking Mason's range, photos and resume quickly before reaching out. (Priority inferred from the order in `docs/project-brief.md`, approved by Ashley 2026-10-26; not yet confirmed by Mason.)
- **Secondary:** event organizers and venues, brands and design clients, fans and collaborators (`docs/project-brief.md`).

## Product Purpose

A personal portfolio for Mason Farrington, a multidisciplinary artist (actor, musician, singer, designer, model). It presents his work, story and media, and turns visitors into contacts. Success means a visitor finds a clear "Get in touch" path from any page and can preview or download his resume (`docs/project-brief.md`, Goals).

## Positioning

One artist across five disciplines, presented as a single cinematic, dark identity rather than separate portfolios per discipline.

## Operating Context

- Pages: Home `/`, About `/about`, Media `/media`, Contact `/contact`, Resume `/resume` plus a "View resume" dialog on Home, About and Contact (D-16).
- Shared on every page: header nav (About, Media, Contact), the "Interested in working together?" CTA banner, and the footer.
- Hosted on Ashley's Vercel account at `masons-portfolio.vercel.app`, with no custom domain and no analytics (D-21).

## Capabilities and Constraints

- The contact form sends through Resend (D-19). Videos are YouTube embeds only (D-20).
- Media gallery categories are defined in D-22 and D-23; Mason's real photos have replaced all stock photos (D-24).
- No CMS, blog, e-commerce, booking or multi-language support in the MVP (`docs/project-brief.md`, Out of scope).
- Undecided: CMS or client self-editing (`docs/open-questions.md`).

## Brand Commitments

- **The visual system is locked and client-approved (D-10).** Colors and fonts in code are canonical: the `brand-*` purple scale (primary accent `brand-600` `#8A2CF6`), Tailwind `neutral`, and Playfair Display, Inter and Space Mono. Purple glows and gradients are deliberate. Tokens: `docs/design-system.md`; layout, type scale and components: `docs/Mockups/`.
- Dark-first theme that doesn't follow the OS color scheme (`docs/design-system.md`, Theme).
- The homepage mockup is the copy source of truth; discipline names and subtitles follow it on every page (`docs/project-brief.md`, Content).
- Changes to layout, palette, type or copy go to Mason as questions in `docs/open-questions.md`, not straight into code (D-27).
- The hero portrait is an AI edit Mason approved on condition that his face is not altered (C15): no AI upscaling or regeneration; only non-AI flips and crops.

## Evidence on Hand

- Mason's real photos: 97-photo gallery, Model Shots, Journey image, hero (D-24, `content/`, `public/`).
- Resume PDF, served on `/resume` and in the resume dialog.
- No testimonials, press or client logos are on hand; don't invent any.

## Product Principles

1. Mason's work leads; the interface recedes.
2. A clear path to contact or resume is always within reach.
3. Preserve the approved look; refine it within the system instead of reinventing it.

## Accessibility & Inclusion

WCAG AA color contrast, visible focus styles, and keyboard-accessible carousel and gallery (`docs/architecture.md`, Accessibility). Known gap: white text on the light-purple Model and Singer cards is below 4.5:1 (`docs/roadmap.md`, accessibility item).
