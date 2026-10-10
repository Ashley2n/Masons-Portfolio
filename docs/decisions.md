# Decision Log

A lightweight record of technical and product decisions, in the style of [Architecture Decision Records](https://adr.github.io/). Add new entries at the bottom. Don't edit old ones; if a decision changes, add a new entry that supersedes the old one.

**Status:** Proposed · Accepted · Superseded by D-xx

---

### D-01 · Next.js App Router + Tailwind v4 + TypeScript

- **Date:** 2026-09-13 · **Status:** Accepted
- **Context:** A fast, SEO-friendly portfolio that's mostly static, with a few interactive pieces.
- **Decision:** Next.js 16 App Router, React 19, Tailwind CSS v4, strict TypeScript.
- **Consequences:** Static rendering by default, built-in image and font optimization, deploys easily to Vercel.

### D-02 · `app/` is for routing only; shared code lives at the root

- **Date:** 2026-10-09 · **Status:** Accepted
- **Context:** Components, data and fonts were all under `app/`, and `page.tsx` held every section inline.
- **Decision:** Use the structure in [architecture.md](architecture.md#folder-structure): `components/`, `content/`, `lib/` and `types/` at the root, imported through `@/`.
- **Consequences:** Clear separation between routes, UI and content. Swapping in a CMS later only touches `content/`.

### D-03 · Content stored in typed TypeScript files (CMS deferred)

- **Date:** 2026-10-09 · **Status:** Accepted (revisit after client meeting; see Q C1)
- **Context:** Whether Mason will edit content himself is not yet decided. The deadline is one week away.
- **Decision:** All copy and data go in `content/*.ts`, typed by `types/content.ts`. Data shapes are designed so a headless CMS (e.g. Sanity) could replace these files later.
- **Consequences:** Fastest to build, with no extra accounts or costs. Content edits need a developer until a CMS is added.

### D-04 · Dark-first theme, not OS-dependent

- **Date:** 2026-10-09 · **Status:** Accepted
- **Context:** The design is dark-first. The current `dark:bg-neutral-950` on `<body>` made the hero invisible (white on white) for visitors whose OS is in light mode.
- **Decision:** Set backgrounds and text colors explicitly per section. Don't use `prefers-color-scheme` switching.
- **Consequences:** The site looks the same for every visitor.

### D-05 · Videos are YouTube embeds behind a custom card

- **Date:** 2026-10-09 · **Status:** Accepted
- **Context:** Mason's videos are on YouTube, and the cards should match the site's styling.
- **Decision:** Show a custom card (YouTube thumbnail, title, date, play badge). Load the YouTube iframe only on click, using `youtube-nocookie.com`.
- **Consequences:** Full control over card styling and much faster page loads (no iframes until needed). Better privacy.

### D-06 · Resume: preview + download page

- **Date:** 2026-10-09 · **Status:** Accepted (implementation details proposed)
- **Context:** Resume preview and download are in the MVP. There's no mockup.
- **Decision:** A `/resume` page in the site's layout with a **Download PDF** button (`download` attribute) and an inline preview of the PDF (`<object>`/`<iframe>`, with a fallback link on mobile, where inline PDF viewing is unreliable). The PDF lives at `public/resume/`.
- **Consequences:** No extra dependencies. Updating the resume means replacing one file.

### D-07 · Contact form delivery: pending client input

- **Date:** 2026-10-09 · **Status:** Proposed
- **Context:** The contact form needs a backend. Options: Resend (via a Next.js server action, needs an API key and verified domain), Formspree (hosted, free tier), or `mailto:`.
- **Decision:** Build the form UI with validation now. For the demo, fall back to `mailto:`. Choose the delivery method after Q C2 is answered.
- **Consequences:** The demo isn't blocked by a client decision.

### D-08 · Hosting on Vercel

- **Date:** 2026-10-09 · **Status:** Proposed (see Q C5)
- **Context:** Next.js-native hosting with preview deploys suits client demos. Mason has no domain yet (2026-10-10).
- **Decision:** Deploy to Vercel. Every branch or PR gets a preview URL. Launch on the free `*.vercel.app` URL if no domain has been bought by then; connect a domain later. Use Vercel Web Analytics (cookieless) for visitor stats.
- **Consequences:** Free tier is sufficient. Need to decide who owns the Vercel account.

### D-09 · Icons with `lucide-react`

- **Date:** 2026-10-09 · **Status:** Proposed
- **Context:** The mockups use line icons (arrows, mail, phone, pin, social).
- **Decision:** Use `lucide-react` for UI icons, plus inline SVGs for brand logos (Instagram, YouTube), since Lucide doesn't ship brand marks.
- **Consequences:** One small, tree-shaken dependency. Consistent stroke style.

### D-10 · Code is the source of truth for colors and fonts

- **Date:** 2026-10-10 · **Status:** Accepted
- **Context:** Hex values read from the mockup PNG differ slightly from the code (e.g. brand-600 `#8A5CF6` vs `#8A2CF6`), and the Contact mockup shows different fonts.
- **Decision:** Colors in `app/globals.css` (brand scale + Tailwind's default `neutral`) and the fonts configured in code (Playfair Display, Inter, Space Mono) are canonical. The mockups define layout, type scale and components.
- **Consequences:** No palette rework needed. [design-system.md](design-system.md) documents the code values.

### D-11 · Free stock photos for the MVP

- **Date:** 2026-10-10 · **Status:** Accepted
- **Context:** Mason's current site has few photos, and extracting them takes time. The deadline is one week away.
- **Decision:** Use free-licensed photos (Unsplash, Pexels and similar) for the MVP. Record each photo's source URL and photographer in `content/`. Portraits that stand in for Mason himself (hero, Model Shots, Portraits category) are placeholders and get replaced with his real photos before or shortly after launch (Q C10).
- **Consequences:** Unblocks design work immediately. Optimize the images before committing them; the current placeholders are up to 7 MB.

### D-12 · Videos: YouTube and Instagram Reels in one card system, hand-curated

- **Date:** 2026-10-10 · **Status:** Proposed (confirm list and ordering with Mason; see Q C6)
- **Context:** Mason may want both YouTube videos and Instagram Reels, ordered by most recent or most viewed.
- **Decision:**
  - The data model supports both: `{ id, platform: "youtube" | "instagram", url, title, date, thumbnail, orientation: "landscape" | "portrait", featured? }`.
  - **YouTube:** thumbnail comes free from `img.youtube.com`. Clicking loads the `youtube-nocookie.com` player inline. Shorts use the same flow in a 9:16 card.
  - **Instagram Reels:** Instagram doesn't offer a styleable player or free thumbnails, so cards use an uploaded thumbnail and open the Reel on Instagram (or in Instagram's official embed in a modal).
  - **Ordering:** a hand-curated list sorted newest first, with a `featured` flag for "Recent Work". Automatic "most viewed / most recent" is a post-MVP option: the YouTube Data API needs a free API key; the Instagram Graph API needs a Business/Creator account plus a Meta app.
- **Consequences:** Fully custom card styling for both platforms with no API keys in the MVP. This is independent of the CMS decision; a CMS would only let Mason add or reorder videos himself.

### D-13 · Test-driven development (TDD), enforced by hooks and CI

- **Date:** 2026-10-10 · **Status:** Accepted
- **Context:** Ashley wants TDD enforced on this project. The deadline is tight, so regressions during the restructure and the fast feature work are a real risk.
- **Decision:**
  - Every behavior change starts with a **failing test** (red), then the minimum code to pass (green), then cleanup (refactor). Bug fixes start with a test that reproduces the bug.
  - **Vitest + React Testing Library (jsdom)** for unit and component tests, colocated as `*.test.ts(x)`.
  - **Playwright** for end-to-end smoke tests of real pages. Added in Phase 4, once routes exist, because Vitest can't render async Server Components.
  - **Enforcement:** a husky pre-commit hook runs lint, typecheck and tests. GitHub Actions runs lint, typecheck, tests and build on every push to `main` and every PR.
- **Consequences:** A test and its implementation are committed together, so every commit is green. Pure styling (Tailwind classes, visual layout) is checked visually against the mockups, not with unit tests (see [architecture.md](architecture.md#testing--tdd)).

### D-14 · Separate "hero" size above the Display style

- **Date:** 2026-10-10 · **Status:** Accepted
- **Context:** The design system lists Display as 64px, but the hero name in the Homepage mockup is clearly larger, about 100px (matching the existing code).
- **Decision:** Add a `text-hero` token (100px / 1.1) used only for the hero name, scaling 44px → 72px → 100px across breakpoints. `text-display` (64px) is for large page titles (About, Media, Contact).
- **Consequences:** The homepage matches the mockup visually. All other sizes follow the documented scale, and both are covered by `app/design-tokens.test.ts`.
