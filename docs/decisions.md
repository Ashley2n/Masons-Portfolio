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
- **Context:** Next.js-native hosting with preview deploys suits client demos.
- **Decision:** Deploy to Vercel. Every branch or PR gets a preview URL. The production domain is connected at launch.
- **Consequences:** Free tier is sufficient. Need to decide who owns the Vercel account.

### D-09 · Icons with `lucide-react`

- **Date:** 2026-10-09 · **Status:** Proposed
- **Context:** The mockups use line icons (arrows, mail, phone, pin, social).
- **Decision:** Use `lucide-react` for UI icons, plus inline SVGs for brand logos (Instagram, YouTube), since Lucide doesn't ship brand marks.
- **Consequences:** One small, tree-shaken dependency. Consistent stroke style.
