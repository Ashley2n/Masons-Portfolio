# Roadmap

Phased plan to an MVP launch. Each phase is a branch with small commits. Tick items as they're done.

_Last updated: 2026-11-15_

| Milestone | Target date | Status (2026-11-15) |
|---|---|---|
| Demo-ready (Vercel preview link to Mason) | **Wed 2026-10-14** | Date passed. The demo meeting was held Mon 10/19; no Vercel preview link is recorded as shared. |
| Client demo meeting | One meeting Wed 10/14 – Sun 10/18 (Mason's availability) | Held Mon 2026-10-19. |
| Launch | **Fri 2026-10-16** | Date passed, not launched. ⚠ No new date set: ask Ashley. |

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

## Phase 7 · Resume & Contact (`feat/resume`, `feat/contact`), Sun 10/11 ✅

- [x] `/resume`: inline PDF preview + download button (D-06), placeholder PDF until Q C4
- [x] `/contact`: form UI with validation, contact card, socials. `mailto:` fallback until D-07 is decided.
- [x] Resume opens in a modal from Home, About and Contact; Resume removed from the nav (D-16)

## 🎬 Demo-ready Wed 10/14, meeting Wed–Sun

- [ ] Deploy to Vercel and share the preview URL with Mason
- [x] Schedule the demo meeting (held Mon 10/19)
- [x] Walk through [open-questions.md](open-questions.md) with Mason (answers in D-18 – D-22)

## Phase 8 · Polish & launch (`chore/launch`), Thu 10/15 → Fri 10/16

- [x] Apply demo feedback (the 10/29 meeting: Phase 9, then the Phase 10 redesign and rounds 1 and 2). Mason's later feedback is tracked in `docs/feeback.md` and `docs/open-questions.md`
- [ ] Swap in final images and copy (see [content-checklist.md](content-checklist.md))
- [x] Contact form backend: Resend server action with branded email (D-19, needs F1). Plain-text sending (#17, D-36), branded HTML email (#18), and spam check with honeypot + minimum time (#19, D-37) merged to `main` 2026-11-06 (PRs #22 to #25). Live check (#20) done by Ashley on the preview 2026-11-06 (see I6 in `docs/open-questions.md`)
- [x] Rename gallery categories to All / Concerts / Recital / Modeling / Staged / Design / Other (D-22, D-23)
- [ ] Remove Instagram Reels from content and video cards; YouTube-only socials (D-20)
- [x] Replace stock portraits with Mason's own photos (Q C10, launch blocker, F5). Gallery, Model Shots, Journey image and hero (D-24, C15)
- [x] Swap in the real resume once confirmed (F2) and the real YouTube links (F3, F4). Done in Phase 9 (D-31, D-32); no channel link (D-30)
- [x] SEO: per-page metadata, Open Graph image, `sitemap.ts`, `robots.ts`, favicon (D-17)
- [x] Accessibility pass (keyboard, focus, alt text, contrast). Closed 2026-11-15: the cards (C20) and the CTA banner (C19) were fixed in Phase 10 (D-38), and the keyboard and reduced-motion pass on all six pages is in the Lighthouse notes below (2026-11-08). Known: white text on the light purple Model/Singer cards is below 4.5:1 (as in the mockup). 2026-10-26 Impeccable audit: keyboard, focus, alt text and headings pass; eyebrow, placeholder and Contact card contrast fixed (D-27, D-28). Left: the cards (C20) and the CTA banner (C19), now part of the Phase 10 redesign (D-33)
- [x] Lighthouse audit (target ≥ 90 on every category). Re-measured 2026-11-15, every measured page is at or above 90 (first bullet below). History: 2026-10-26: every page ≥ 90 except Media mobile performance (88; option: AVIF images) and Home accessibility (96, the C20 cards). `/resume` desktop CLS 0.134 seen only in Lighthouse, not reproduced
  - **2026-11-15 (final re-measure, commit `c270dfc`), Lighthouse 13.6.0 via `npx`, headless Chrome, production build, one run per page.** Accessibility, best practices and SEO are 100 on every page, mobile and desktop. Performance, mobile: Home 100, About 91, Media 91, Contact 100, Resume 100. Desktop: Home 100, About 100, Media 100, Contact 100, Resume 95. CLS: 0 everywhere except Resume (mobile 0.037, desktop 0.133, Chrome's PDF viewer iframe). The 404 was not measured: Lighthouse refuses a page that answers with a 404 status (it errored), so its 2026-11-08 numbers stand.
  - **2026-11-08 (#36), Lighthouse 13.6.0 via `npx`, headless Chrome, production build.** Accessibility, best practices and SEO are 100 on every page except the 404 (best practices 96, SEO 54: it answers with a 404 status, expected). Performance, mobile before → after the 50% entrance start (D-44): Home 84 → **100**, About 90 → **91**, Media 85 to 87 → **87**, Contact 92 → **100**, Resume 89 → **99**, 404 91 → **100**. Desktop (after): Home 100, About 100, Media 100, Contact 100, Resume 95, 404 100. Mobile LCP after: Home 0.82s, About 3.49s, Media 4.09s, Contact 0.76s, Resume 1.21s, 404 0.76s. `/resume` desktop CLS 0.134 (Chrome's PDF viewer iframe in the preview). Compared with 2026-10-26: Media mobile 88 → 87, Home accessibility 96 → 100, `/resume` CLS unchanged.
  - **Media mobile fixed (2026-11-09, Ashley: "yep sounds good"): 87 to 89 became 92 (4 of 5 runs; one cold run 89).** The LCP photo (`staged-01`, 21 KiB, already eager + high priority) sat inside `Reveal`, hidden until hydration; the first gallery photo now mounts at rest (`instant`, `Gallery.tsx`). The 36 KiB image savings belong to a different, lazy photo, so AVIF would not have moved the LCP. Unthrottled LCP is 1.1s; the rest of the simulated 3.4s is JavaScript (async `domAnimation`, still not pulled). Test: `e2e/motion.spec.ts`, first-frame opacity 1 (seen red: 0).
  - **About is borderline** (89 to 91 between runs; its LCP is a photo). 2026-11-15, 5 runs: 91, 91, 91, 91, 88; simulated LCP 3.4 to 3.9s but observed LCP 254ms and CLS 0. Adding `fetchPriority="high"` to the hero image changed nothing (90, 90, 90, 91, 88) and was reverted. Accepted as is unless Ashley decides otherwise (⚠ the simulated-vs-observed reading is not from a Lighthouse doc). JS gzip per page: Home 242.4 kB, About 232.5, Media 232.7, Contact 233.8, Resume 221.2, 404 221.1; about 29 KiB unused JavaScript is flagged everywhere (async `domAnimation` not pulled).
  - **2026-11-08 (#36), keyboard and reduced-motion pass on all six pages** (production build, 1280px, Chrome): with reduced motion nothing is left hidden or animating and every focused control is visible; with motion, no focused control is stuck hidden or off-screen, but one inside an unrevealed block is invisible for 190 to 816ms (accepted, D-44). The Resume PDF `iframe` shows no focus ring (Chrome's own PDF viewer). Full e2e on a `CI=1` production build after the 50% start: 307 passed, 7 skipped, 0 failed. `impeccable detect` on the 18 changed UI files: 0 anti-patterns.
- [x] Custom 404 page
- [ ] Launch on `*.vercel.app` (connect a domain when Mason buys one) 🚀

## Phase 9 · 10/29 meeting fixes (`fix/meeting-content`)

Live-site content that's wrong today. Ships before the redesign.

- [x] Real resume at `public/resume/mason-farrington-resume.pdf`, ~~phone line removed from the file and checked~~ published as sent, phone included (D-35) (F2, D-31)
- [x] Contact email → `mason.13.farrington@gmail.com` (D-31)
- [x] "Reel 2 0" as featured Recent Work and in the gallery under Other; remove all Blender videos; Other Work hides when empty (F3, D-32)
- [x] Remove Email from `socialLinks`; hide footer Connect and Contact Follow when empty (D-30)
- [x] Move Model Shots to right after the hero (C23)
- [x] Add `RESEND_API_KEY` in Vercel env vars; confirm the Resend account email before building the form (F1, done 2026-10-31)

## Phase 10 · Impeccable redesign (`feat/redesign`)

Scope and requirements in D-33. Show Mason a before/after before it ships.

- [x] CTA banner (AA 3:1 heading), 2026-11-06 on `feat/redesign`: white on near-black, glow kept to the right edge (D-38)
- [x] Buttons: arrow nudge on hover, 2026-11-06 on `feat/redesign` (D-38)
- [x] Contact page right-hand card, 2026-11-06 on `feat/redesign`: plain, email first, smaller name (D-39, D-40)
- [x] Footer (from the D-30 version), 2026-11-06 on `feat/redesign`: roles line under the logo (D-39)
- [x] Animations (reduced-motion safe), 2026-11-06 on `feat/redesign`: scroll reveal on the Journey stats, Expertise cards and section headings (D-38, D-41); hero entrance, page crossfade, mobile menu slide, fade and icon turn (D-41). CSS only, e2e-tested
- [x] Expertise cards (AA text; photos, no links), 2026-11-06 on `feat/redesign` (D-38)
- [ ] "Get in touch" near the top on mobile (C26): try options and review
- [x] Motion everywhere, built and pushed on `feat/motion-everywhere` 2026-11-15, not merged, no PR yet (D-44, issue #29, tickets #30 to #41): #30 done 2026-11-08 on `feat/motion-everywhere` (`a9a0773`, `e9a8edb`: D-44, Motion installed, `LoadEntrance`, Home hero); #31 done 2026-11-08 (`0efaf88`, load entrance on About, Media, Contact, Resume and the 404); #32 done 2026-11-08 (`102137b`, scroll reveals onto Motion, `components/motion/Reveal.tsx`, old `.reveal` CSS removed); #39 ("Load more" jumped to the top, fixed with `preventScroll`) done 2026-11-08 (`8358e4e`); #33 done 2026-11-08 (`988664e`, new reveals: carousel, Recent Work cards, CTA banner, Contact card and form, Resume preview, gallery); #34 done 2026-11-08 (`9a2915c`, About timeline line draws on scroll, `components/motion/DrawLine.tsx`); #35 (Journey count-up, `components/motion/CountUp.tsx`) and the #36 Lighthouse gate done; #37 (`b632384`, reel thumbnails), #38 (`04cfaab`, About timeline photos and copy), #41 (`1e8396b`, last two timeline entries) and #40 done. 2026-11-15 follow-ups: flaky mobile "Load more" test fixed (`5c26240`), dev-only reduced-motion hydration warning fixed and a `Reveal` rests when focused (`d152c9c`). Full `CI=1` e2e: 307 passed, 7 skipped, 0 failed, 0 flaky
- [x] Round 3 motion, 2026-11-15 on `feat/motion-everywhere` (uncommitted until Ashley says): About timeline checkpoints pulse and the last two are dull grey (D-46); one 250ms ease-in-out for every colour change on clickable controls (D-47); new gallery photos fade in on Load more and tab changes (D-48). Tests: `e2e/about.spec.ts`, `e2e/hover-ease.spec.ts`, `e2e/media.spec.ts`
- [ ] More motion and small user responses (D-42, Proposed; slices 5 to 7 now belong to D-44): option C chosen 2026-11-06. Slice 1 press states done (`2a3527a`); slices 2 to 7 (form feedback, dialog, media feedback, quiet reveals, timeline line, count-up) not built under D-42 (quiet reveals, the timeline line and the count-up were built under D-44 in #33, #34 and #35). Details in `docs/handoff.md`
- [x] Gallery: tabs in Mason's order and five photos removed, 2026-11-06 (D-43, `43458f2`)
- [ ] Final checks before the handoff to Mason: code review, ~~Lighthouse on every page~~ (done 2026-11-15, see Phase 8), full e2e and build (done 2026-11-15 on the branch), accessibility pass, link and image check. Still to do: open a PR, show Mason before and after (U1), and his open questions in `docs/open-questions.md`. Planned in `docs/handoff.md`
- [x] Round 2 (2026-11-06, spec `docs/specs/2026-11-06-site-refresh-round-2.md`, D-39): done 2026-11-06 on `feat/redesign`: removed the Media hero button, "Iowa, US" everywhere (Mason to confirm, U4), fixed the About timeline's last entry. Buttons (3.2) done: option A, one primary per page on Home, About, Contact (with a sending spinner) and Resume, and the ↗ only on new-tab links (`48d82c6`, `b689829`, `36a5d4a`, `446d1ac`). The navbar stays as it is, and the Contact card, footer, mobile menu, homepage rhythm and hero are done too (D-39, D-40)

## Post-launch (backlog)

- [ ] Git-based admin page (Keystatic/Decap) if Mason's photo updates become frequent (D-18)
- [ ] Automatic video ordering via the YouTube Data API (D-20)
- [ ] Custom domain (Q C5)
- [ ] ~~Page transitions and scroll animations~~ Moved to Phase 10 (D-33)
- [ ] Gallery lightbox (open photos full screen)
- [ ] ~~Expertise cards link to their gallery category~~ Dropped: tiles don't link (C24, 2026-10-29)
- [x] Swipe on the Model Shots carousel (touch gesture or CSS scroll-snap). Critique P2, 2026-10-27. Done 2026-11-06 on `feat/redesign` with CSS scroll-snap (`fd5b87d`)
- [ ] Consider React Hook Form for the contact form (Ashley, 2026-10-26). Today's form has 3 fields and a small tested validation helper; RHF adds client JavaScript, so it pays off once forms grow (many fields, conditional steps). Decide with `/architect` before adopting
- [ ] Phase 7 review cleanups: shared `ResumeViewer` for the modal and `/resume`, shared external-link helper (Footer + ContactCard), render or remove the unused contact `errorSummary`, treat `download=""` as a download in `Button`
- [ ] Phase 6 review cleanups: row-ordered gallery grid (CSS-columns masonry reorders on "Load more"), move remaining aria/status strings to `content/`, shared `Glow` component, shared `.page-title` h1 size, single helper in `content/media.ts`
- [ ] SEO/404 review cleanups: note the generated-image hex exception in CLAUDE.md (it's only in architecture.md), reuse the shared page-title and glow styles in the 404 page, drop the unsupported italic in `apple-icon.tsx`, give `shareImage` a `url` key so `lib/seo.ts` doesn't re-map it
- [ ] Decide whether `/resume` should be `noindex` (and out of the sitemap) until the real resume replaces the placeholder (Q C4)
- [ ] CI: build once and share it between the `check` and `e2e` jobs (currently builds twice)
- [ ] Footer year is set at build time; redeploy once a year (or render it client-side) so it doesn't go stale
