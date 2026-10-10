# Roadmap

Phased plan to an MVP launch. Each phase is a branch with small commits. Tick items as they're done.

_Last updated: 2026-10-10_

| Milestone | Target date |
|---|---|
| Demo-ready (Vercel preview link to Mason) | **Wed 2026-10-14** |
| Client demo meeting | One meeting Wed 10/14 – Sun 10/18 (Mason's availability) |
| Launch | **Fri 2026-10-16** |

## Phase 0 · Secure current work + TDD setup (`fix/homepage-wip`), Sat 10/10 ✅

- [x] Fix the carousel crash on the last image (test-first, `lib/carousel.ts`)
- [x] Commit the in-progress homepage work and placeholder images (optimized 13 MB → 1.5 MB)
- [x] Add `.gitattributes` to normalize line endings (LF)
- [x] TDD setup: Vitest + React Testing Library, husky pre-commit hook, GitHub Actions CI (D-13)
- [x] Patch `next` and `sharp` security advisories

## Phase 1 · Documentation (`docs/project-foundation`), Fri 10/9 ✅

- [x] Project brief, roadmap, architecture, design system, decision log
- [x] Content checklist and open questions for the client
- [x] README and `CLAUDE.md`

## Phase 2 · Restructure, no visual changes (`refactor/project-structure`), Sat 10/10 ✅

- [x] **First:** add a characterization test that renders the homepage sections (headings, stats, expertise cards) to protect the refactor
- [x] Move `Header` to `components/layout/`
- [x] Split `app/page.tsx` into `components/sections/home/*`. The page becomes a Server Component, and only the carousel is a client component.
- [x] Move fonts to `lib/fonts.ts`, add `cn()` to `lib/utils.ts`
- [x] Move data to `content/`, types to `types/content.ts`, with static IDs
- [x] Remove `app/lib/` and the leftover Next.js boilerplate SVGs in `public/`; photos moved to `public/images/home/`
- [x] Verify: tests, build, lint and type check pass; homepage looks unchanged (checked in browser)

## Phase 3 · Design tokens (`feat/design-tokens`), Sat 10/10 ✅

- [x] Brand and neutral palettes match [design-system.md](design-system.md) (covered by token tests)
- [x] Type scale (Hero 100, Display 64, H1 48, H2 28, H3 20, Body 16, Small 14, Caption 12) with line heights (D-14)
- [x] Fix the self-referencing `--font-*` variables (`@theme inline`)
- [x] Dark-first base (fixes the invisible hero in light mode; see D-04)
- [x] Site metadata (title, description) to replace "Create Next App"
- [x] Font usage matches the design system on every page (D-10)

## Phase 4 · Shared layout (`feat/layout`), Sun 10/11 ✅

- [x] Semantic `Header` with `<nav>`, active link, Contact link, mobile menu
- [x] `Footer` (Navigation / Connect / Contact columns, year generated automatically)
- [x] `CtaBanner` → `/contact` (Home, About, Media, Resume)
- [x] UI primitives: `Button` (outline / light), `Eyebrow`, `SectionHeading`, `Container`
- [x] Stub pages for `/about`, `/media`, `/resume`, `/contact` so nav links work
- [x] One `<main>` per page (root layout); "View work" links to `/media`
- [x] Global CSS moved into Tailwind layers so utility classes can override element styles
- [x] Add Playwright with e2e smoke tests: every nav link loads its page; the hero stays readable with a light-mode OS theme (regression test for the Phase 3 fix)

## Phase 5 · Homepage complete (`feat/home`), Sun 10/11 ✅

- [x] Hero with portrait image, "View work" → `/media`; name is the page `<h1>`
- [x] Journey stats + image with glow
- [x] Expertise cards are real links (to `/media` for now)
- [x] Recent Work + Other Work with `VideoCard` (YouTube inline + Instagram Reel support, D-12); mock Blender open-movie videos and Shorts
- [x] Model Shots carousel: wraparound, prev/next, thumbnails, keyboard support
- [x] Responsive pass (mobile / tablet), checked in the browser at 375 / 768 / 1280
- [x] Copy matches the homepage mockup exactly (stats, expertise wording, tagline)
- [x] Source and optimize free stock photos (D-11)

## Phase 6 · About & Media (`feat/about`, `feat/media`), Sun 10/11 ✅

- [x] About hero with signature (placeholder script font until Q C13) and feature card
- [x] Journey timeline (6 milestones, alternating layout desktop / single column mobile)
- [x] Media hero, category filters, masonry gallery (photos, videos and Shorts), "Load more"
- [x] Responsive pass
- [x] Fixed: `cn()` dropped custom text sizes next to text colors (tailwind-merge config)

## Phase 7 · Resume & Contact (`feat/resume`, `feat/contact`), Wed 10/14 AM

- [ ] `/resume`: inline PDF preview + download button (D-06)
- [ ] `/contact`: form UI with validation, contact card, socials. `mailto:` fallback until D-07 is decided.

## 🎬 Demo-ready Wed 10/14, meeting Wed–Sun

- [ ] Deploy to Vercel and share the preview URL with Mason
- [ ] Schedule the demo meeting (Wed 10/14 – Sun 10/18)
- [ ] Walk through [open-questions.md](open-questions.md) with Mason

## Phase 8 · Polish & launch (`chore/launch`), Thu 10/15 → Fri 10/16

- [ ] Apply demo feedback
- [ ] Swap in final images and copy (see [content-checklist.md](content-checklist.md))
- [ ] Contact form backend (per D-07)
- [ ] SEO: per-page metadata, Open Graph image, `sitemap.ts`, `robots.ts`, favicon
- [ ] Accessibility pass (keyboard, focus, alt text, contrast). Known: white text on the light purple Model/Singer cards is below 4.5:1 (as in the mockup)
- [ ] Lighthouse audit (target ≥ 90 on every category)
- [ ] Custom 404 page
- [ ] Enable Vercel Web Analytics
- [ ] Launch on `*.vercel.app` (connect a domain when Mason buys one) 🚀

## Post-launch (backlog)

- [ ] CMS for client self-editing (if requested; see Q C1 / D-03)
- [ ] Replace stock portraits with Mason's own photos (Q C10)
- [ ] Automatic video ordering via YouTube / Instagram APIs (D-12)
- [ ] Custom domain (Q C5)
- [ ] Page transitions and scroll animations
- [ ] Gallery lightbox (open photos full screen)
- [ ] Phase 6 review cleanups: row-ordered gallery grid (CSS-columns masonry reorders on "Load more"), move remaining aria/status strings to `content/`, shared `Glow` component, shared `.page-title` h1 size, single helper in `content/media.ts`
- [ ] CI: build once and share it between the `check` and `e2e` jobs (currently builds twice)
- [ ] Footer year is set at build time; redeploy once a year (or render it client-side) so it doesn't go stale
