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

- **Date:** 2026-10-09 · **Status:** Accepted (confirmed by D-18)
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

- **Date:** 2026-10-09 · **Status:** Superseded by D-19
- **Context:** The contact form needs a backend. Options: Resend (via a Next.js server action, needs an API key and verified domain), Formspree (hosted, free tier), or `mailto:`.
- **Decision:** Build the form UI with validation now. For the demo, fall back to `mailto:`. Choose the delivery method after Q C2 is answered.
- **Implemented (2026-10-11):** `lib/contact.ts` validates and builds a prefilled `mailto:` link; `ContactForm` takes an injectable `send` function, so swapping in Resend/Formspree later means replacing that one function (e.g. with a server action) without touching validation or UI.
- **Consequences:** The demo isn't blocked by a client decision.

### D-08 · Hosting on Vercel

- **Date:** 2026-10-09 · **Status:** Superseded by D-21
- **Context:** Next.js-native hosting with preview deploys suits client demos. Mason has no domain yet (2026-10-10).
- **Decision:** Deploy to Vercel. Every branch or PR gets a preview URL. Launch on the free `*.vercel.app` URL if no domain has been bought by then; connect a domain later. Use Vercel Web Analytics (cookieless) for visitor stats.
- **Consequences:** Free tier is sufficient. Need to decide who owns the Vercel account.

### D-09 · Icons with `lucide-react`

- **Date:** 2026-10-09 · **Status:** Accepted (2026-10-11)
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

- **Date:** 2026-10-10 · **Status:** Superseded by D-20
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

### D-15 · Playwright uses the installed Google Chrome

- **Date:** 2026-10-11 · **Status:** Accepted
- **Context:** Downloading Playwright's bundled browser timed out in the development sandbox.
- **Decision:** Playwright runs with `channel: "chrome"`, the Google Chrome already installed locally and preinstalled on GitHub's Ubuntu runners.
- **Consequences:** No browser download step locally or in CI. Tests run on stable Chrome rather than a pinned build. Switch back to the bundled browser (`npx playwright install chromium`) if version pinning becomes important.

### D-16 · Resume opens in a modal; removed from the nav

- **Date:** 2026-10-11 · **Status:** Accepted (refines D-06); the icon-only button is amended by D-29
- **Context:** Ashley asked to drop "Resume" from the navigation and let visitors open the resume from the pages where it's relevant.
- **Decision:** An icon-only `ResumeDialog` button (file icon, accessible name "View resume") on the home hero, the About intro and the Contact card opens the PDF in a native `<dialog>` with **Download PDF** and **Open in new tab**. The nav and footer list About, Media and Contact. `/resume` stays as an unlinked page, useful as a direct link to share and as a fallback.
- **Consequences:** The PDF only loads when someone opens the modal. Escape, focus containment and an inert background come from the browser. Adding the button to another page is one `<ResumeDialog />`.

### D-17 · SEO metadata and the site URL

- **Date:** 2026-10-11 · **Status:** Accepted
- **Context:** Link previews, canonical URLs and the sitemap need the site's absolute URL. There's no domain yet (Q C5), and the Vercel URL shouldn't be hard-coded.
- **Decision:** `getSiteUrl()` (`lib/site-url.ts`) uses `NEXT_PUBLIC_SITE_URL` when set, else Vercel's built-in `VERCEL_PROJECT_PRODUCTION_URL`, else `localhost`. Per-page copy lives in `content/seo.ts` and goes through `pageMetadata()`. It repeats the shared Open Graph fields and the share image on every page, because a page's `openGraph`/`twitter` replaces the layout's instead of merging. The share image is generated from the hero photo (`app/opengraph-image.tsx`). The favicon is an "MF" monogram (`app/icon.svg`, `app/apple-icon.tsx`).
- **Consequences:** Nothing to configure now. A custom domain later is one environment variable. Generated images use Next.js's default sans-serif font, since using Playfair would mean committing its font file. The share image updates automatically when the hero photo or tagline changes. Its URL carries a `?v=` hash of the photo and hero text, so sites that cache link previews fetch the new one. The photo must be a JPEG or PNG (the image renderer can't read WebP), and the build stops with a clear error otherwise. `NEXT_PUBLIC_SITE_URL` accepts a bare domain; `https://` is added if missing.

### D-18 · Photo updates through a shared folder, no CMS

- **Date:** 2026-10-19 · **Status:** Accepted (confirms D-03)
- **Context:** Mason will add and remove photos, but only every 3–6 months (Q C1). A CMS costs setup time and another account for very little use.
- **Decision:** Content stays in `content/*.ts`. Mason drops new photos into the shared Google Drive folder with a category and a short caption, and Ashley adds them (file, alt text, dimensions) and redeploys.
- **Consequences:** No cost and nothing new to build; alt text stays good because Ashley writes it. If updates become frequent, a Git-based admin page (Keystatic or Decap: free, no database, commits to the repo) is the cheapest upgrade.

### D-19 · Contact form sends through Resend

- **Date:** 2026-10-19 · **Status:** Accepted (supersedes D-07)
- **Context:** Mason wants a nicely formatted email when someone reaches out (Q C2). Formspree's free emails are plain; sending through his Gmail would store a password with full mailbox access in Vercel.
- **Decision:** A server action sends a branded HTML email via Resend (free tier) to Mason, with `replyTo` set to the visitor. Mason owns the Resend account, signed up with the receiving address, so it can deliver to him before a domain is verified. The API key lives in a Vercel environment variable. It replaces the `send` function injected into `ContactForm`.
- **Consequences:** Send-only credential and delivery logs. Until a domain is verified, mail comes from `onboarding@resend.dev` and only reaches the account owner's address; adding a domain later only changes the `from` address. Blocked on Mason creating the account (F1).

### D-20 · Videos are YouTube-only

- **Date:** 2026-10-19 · **Status:** Accepted (supersedes D-12)
- **Context:** Mason only wants YouTube linked for now (Q C7) and will send a hand-picked list, newest first (Q C6).
- **Decision:** Keep D-12's YouTube flow (free thumbnails, click-to-load `youtube-nocookie.com` player, 9:16 cards for Shorts) and its hand-curated, newest-first list with a `featured` flag. Drop Instagram Reels from the content and the UI; the `platform` field can stay so Reels can come back later.
- **Consequences:** No Instagram embed script or uploaded thumbnails. Footer and Contact show YouTube and Email only.

### D-21 · Hosting on Ashley's Vercel account, no domain, no analytics

- **Date:** 2026-10-19 · **Status:** Accepted (supersedes D-08)
- **Context:** Mason isn't buying a domain for now and declined analytics (Q C5, Q C14).
- **Decision:** Deploy on Vercel as in D-08, under Ashley's account, and launch on the `*.vercel.app` URL. Don't add Vercel Web Analytics.
- **Consequences:** Ashley controls deploys. If the project later moves to Mason's account, the `vercel.app` URL may change (D-17 handles the URL automatically). The Hobby plan is officially for non-commercial use, which a working portfolio sits close to; revisit if Vercel flags it or a domain is bought.

### D-22 · Gallery categories

- **Date:** 2026-10-19 · **Status:** Accepted (order amended by D-23)
- **Context:** Mason renamed the gallery categories (Q C11).
- **Decision:** Filters in this order: **All** (default), Concerts, Modeling, Staged (theater/stage acting), Design, Other. Existing items move over as Performances → Concerts, Portraits and Editorial → Modeling, Behind the Scenes → Other.
- **Consequences:** `GalleryCategory` and `galleryCategories` change, along with their tests. No current placeholder is in Staged or Design until Mason's photos arrive.


### D-23 · Recital gallery category

- **Date:** 2026-10-26 · **Status:** Accepted (amends D-22)
- **Context:** Mason's shared Drive folder sorts his photos into Concert Performances, Recital Performances, Staged Performances, Modeling and Designs. D-22 has no category for recitals.
- **Decision:** Add **Recital** right after Concerts. Filters in this order: All, Concerts, Recital, Modeling, Staged, Design, Other. Drive folders map to categories by name: Concert Performances → Concerts, Recital Performances → Recital, Staged Performances → Staged, Modeling → Modeling, Designs → Design. (Ashley, 2026-10-26, based on Mason's folder names.)
- **Consequences:** One more filter tab. Mason chose D-22's list himself, so mention the new tab in the next update to him.

### D-24 · Mason's photos replace all stock photos in the gallery

- **Date:** 2026-10-26 · **Status:** Accepted (extends D-11)
- **Context:** The Drive folder has 99 unique photos across five categories. D-11 only required replacing stock *portraits*.
- **Decision:** All 99 go into the `/media` gallery (D-18: what Mason puts in the folder goes on the site). Every stock photo leaves the gallery, and the homepage hero and Model Shots use Mason's photos (F5). Stock stays only where no real photo fits yet: the About journey and feature images and the Contact background. Weak photos (for example the ones under ~800 px wide) are flagged to Mason, not dropped. (Ashley, 2026-10-26.)
- **Consequences:** A gallery about Mason shows only Mason. About 30 MB of images added to the repo. Unused stock files and their credits are deleted.

### D-25 · Photo import script

- **Date:** 2026-10-26 · **Status:** Accepted
- **Context:** The 99 originals total 172 MB (largest 8.6 MB, up to 7008 px wide), against a 500 KB target per image (`docs/architecture.md`). Mason sends new batches every 3–6 months (D-18), so the import repeats.
- **Decision:** `npm run import-photos -- <unzipped Drive folder>` runs `scripts/import-photos.ts` with [sharp](https://sharp.pixelplumbing.com/). For each photo it applies the EXIF rotation, resizes to fit 2000 px, saves a JPEG at quality 80, and strips all metadata (including any GPS location). It writes `public/images/media/<category>/<category>-NN.jpg`, numbering after the photos already there, and appends entries to `content/gallery-photos.ts` with real dimensions and **empty alt text for Ashley to write** (D-18). It skips byte-identical duplicates and files it can't read, and reports them. The file type comes from the contents, not the extension: Mason's four `.heif` files are really JPEGs. Pure helpers live in `lib/images.ts`, and the script runs on Node's built-in TypeScript support (`allowImportingTsExtensions` in `tsconfig.json`), so there's no extra runner.
- **Consequences:** `sharp` becomes a devDependency (it was already an optional dependency of `next`). A content test fails while any alt text is empty, so photos can't ship without it. A real iPhone HEIC file would be reported, not imported; convert it first (on a Mac: `sips -s format jpeg`).

### D-26 · Claude drafts gallery alt text, Ashley reviews every line

- **Date:** 2026-10-26 · **Status:** Accepted (amends D-18)
- **Context:** The first import added 97 photos at once. Writing every alt text from scratch would take 1–2 hours; reviewing drafts takes far less.
- **Decision:** For large batches, Claude drafts alt text after viewing each photo, and Ashley reviews and edits every line before the commit. The drafts describe only what is visible and don't name people, because the same person can't be confirmed across photos; Ashley adds "Mason" where she knows it's him. (Ashley, 2026-10-26.)
- **Consequences:** D-18's goal (good alt text with a person behind it) holds. The review step can't be skipped: the drafts can't know who is who, what the show was, or which details matter to Mason.

### D-27 · Impeccable for the design-polish pass, project-scoped, hooks off

- **Date:** 2026-10-26 · **Status:** Accepted
- **Context:** The built site needs a design-quality pass (accessibility, hierarchy, spacing, motion) before the roadmap's Lighthouse and a11y items, without changing the approved design system (D-10).
- **Decision:** Use Impeccable v4.8.0 (`audit`, `critique`, `polish`), installed for this project only with `npx impeccable@4.8.0 install --project --providers=claude --no-hooks`. The skill text and its 4 agents are committed so every clone uses the same version; the 17 MB native binary in `.claude/skills/impeccable/scripts/bin/` is gitignored, because the launcher downloads the right one for each OS and refuses it unless its SHA-256 matches `scripts/engine-checksums.txt`. The automatic design-detector hooks stay off. Impeccable findings that would change the approved look (layout, palette, type, copy) become questions in `docs/open-questions.md`, not code changes. Its flags on Inter and the purple brand are expected noise: both are client-approved (D-10). So is its craft-floor ban on eyebrow labels (`reference/craft-floor.md`): eyebrows are in every approved mockup.
- **Rejected:** Taste Skill (`Leonxlnx/taste-skill`), which is aimed at generating new designs while this site is in polish (Ashley, 2026-10-26). Hooks on: they run the binary after every edit and would repeat the D-10 noise.
- **Sources:** install flags and commands: https://impeccable.style and `npx impeccable install --help`; checksum check: the launcher `.claude/skills/impeccable/scripts/impeccable`; git scope and hooks off: Ashley, 2026-10-26.
- **Consequences:** On first run on a new machine (including Ashley's Windows PC), the launcher downloads the engine from GitHub releases. Upgrading means re-running the installer with a new pinned version and reviewing the diff.

### D-28 · Contact card photo and label meet WCAG AA

- **Date:** 2026-10-26 · **Status:** Accepted (amends D-11 for this photo)
- **Context:** The "Contact info" label on the Contact card measured 1.2:1. The stock photo (JIWON KANG / Unsplash) is bright sky where the label sits, unlike the mockup's dark sea stacks, so no text color passed (even `brand-100` reached only 4.1:1). On mobile the card's text fills it from the top, so the label lands on the brightest part of any dusk photo.
- **Decision:** Replace the photo with a violet long-exposure seascape, dark rocks across the middle ("Sunset" by Wang, Wikimedia Commons, CC0, imported from the 500px archive; its 500px watermark sits under the card's opaque fade). Show the label in `brand-200` on this card only (`<Eyebrow tone="photo">`). On mobile, make the card taller (`min-h-[50rem]`, desktop unchanged at `36rem`) so the text sits on the dark lower half, as it does on desktop. Saved as `coast-violet-rocks.jpg`, a new file name so Next's image cache doesn't serve the old photo. (Ashley, 2026-10-26.)
- **Options measured with the Impeccable detector (desktop / mobile):** old photo + any palette color: fail; new photo alone: 3.9 / 1.7:1; beach-sunset photo (WordPress Photos, CC0): 3.8 / 2.6:1; new photo + `brand-200` + taller mobile card: pass at 1440, 412 and 390 px. Re-measured after code review: every text element on `/contact` passes at those widths, including the "Follow" label (3.6:1 before the D-27 eyebrow fix).
- **Client check:** this changed the approved look (D-10) before Mason saw it. Exception made because the live site failed WCAG AA (1.2:1); Mason is asked to approve or reject it (C22), and it's reverted if he declines (Ashley, 2026-10-26, after code review).
- **Sources:** licence: https://commons.wikimedia.org/w/index.php?curid=71315995 (CC0 1.0); contrast rule: `docs/architecture.md` (Accessibility, WCAG AA); the mobile layout is derived, not mocked up: `docs/design-system.md` (Responsive).
- **Consequences:** Closer to the Contact mockup's mood than the old photo. The mobile card is about 14rem taller. The label is a lighter lilac than other dark-section eyebrows.

### D-29 · The resume button shows its label

- **Date:** 2026-10-27 · **Status:** Accepted (amends D-16)
- **Context:** The Impeccable homepage critique (2026-10-27) rated the icon-only resume button P1: the resume is a top goal for the primary visitor (casting directors, `PRODUCT.md`), and a file icon whose name only appears on hover can't be read on touch screens at all. The Contact mockup also had RESUME in the nav.
- **Decision:** Keep D-16's modal and placements (home hero, About intro, Contact card), but the button now shows the text "View resume" plus the `FileText` icon, styled like the outline button next to it. The visible text is the accessible name, so the `aria-label` and the duplicate `title` tooltip are removed (WCAG 2.5.3 Label in Name: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html). (Ashley, 2026-10-27.)
- **Consequences:** The button reuses the outline `Button` classes through `buttonClasses()` in `components/ui/Button.tsx`, so the two hero buttons can't drift apart again. All buttons use `px-6` below 640px (`px-8` above) so "View work" and "View resume" fit side by side at 412px. Covered by `components/resume/ResumeDialog.test.tsx` ("shows a visible 'View resume' label…").

### D-30 · No social links; YouTube only for embedded videos

- **Date:** 2026-10-29 · **Status:** Accepted (amends D-20)
- **Context:** Mason doesn't want YouTube (or any social profile) linked (F4, 2026-10-29 meeting). With no profile URLs, the footer "Connect" column and the Contact card "Follow" section held only "Email", which repeats the email already shown next to them.
- **Decision:** `socialLinks` in `content/site.ts` holds real profiles only (no Email entry). The footer "Connect" column and the Contact card "Follow" section render only when `socialLinks` has at least one item. Videos keep D-20's click-to-load YouTube embeds; the site never links to his channel. (Ashley, 2026-10-29.)
- **Consequences:** Footer becomes Navigation + Contact. Adding a profile later is one line in `content/site.ts`; the sections come back on their own. The embedded player still shows YouTube's own logo, which can't be removed.

### D-31 · Public contact email matches the resume; no phone number anywhere public

- **Date:** 2026-10-29 · **Status:** Accepted
- **Context:** His resume lists `mason.13.farrington@gmail.com`; the site used `masonfarrington@gmail.com`. The resume also prints his cell number, which the site has never shown (C3).
- **Decision:** The site's email becomes `mason.13.farrington@gmail.com`. The phone number appears nowhere public: the published resume PDF has the phone line removed from the file itself (not covered with a box), and the output is checked with a text extraction. (Ashley, 2026-10-29.)
- **Consequences:** The Resend account (F1, D-19) is expected under the same address; with no domain, Resend can only deliver to the account's own address, so confirm it before building the form. The original resume (with phone) is not committed.

### D-32 · Only real videos on the site; empty video sections hide

- **Date:** 2026-10-29 · **Status:** Accepted
- **Context:** Mason has sent one video so far, "Mason Farrington Reel 2 0" (`1BnBTdARUHk`, unlisted, sent by him). More are coming (F3). The live site still shows Blender demo films as his work.
- **Decision:** "Reel 2 0" is the featured Recent Work video and joins the gallery under "Other". Every Blender placeholder video is removed (home and gallery). Other Work hides itself while it has no videos (C25). (Ashley, 2026-10-29.)
- **Consequences:** Unlisted videos embed fine (embedding is on; checked with YouTube oEmbed), but they become effectively public once on the site. New videos are added newest first as Mason sends them, and Other Work comes back on its own.

### D-33 · Impeccable redesign of the banner, buttons, Contact card, footer, expertise cards and animations

- **Date:** 2026-10-29 · **Status:** Accepted (scope); designs to come
- **Context:** At the 2026-10-29 review, Ashley decided to redesign several parts of the site rather than patch them (replaces the C19 gradient fix, C20 text-color fix and C22 approval).
- **Decision:** One redesign pass with the Impeccable skill (D-27), on its own branch after the content fixes. Scope:
  1. CTA banner ("Interested in working together?"). Its heading must reach AA (3:1 large text; it's 2.5:1 today).
  2. Buttons across the site.
  3. The Contact page's right-hand card. Starting point: D-28 (darker photo, lighter label) is what made it pass AA.
  4. Footer, starting from the D-30 version (no Connect column).
  5. Site animations (absorbs the "Page transitions and scroll animations" backlog item); respect `prefers-reduced-motion`.
  6. Expertise cards: text must pass AA (4.5:1 for subtitles; Model and Singer are 2.0:1 and 2.5:1 today). Try photos on the tiles (C24); the tiles don't link anywhere.
  - Also: "Get in touch" reachable from the top of the homepage on mobile (C26), via a third hero action or a header that stays visible. Try options and review.
- **Consequences:** Changes the approved look (D-10), so Mason sees a before/after before it ships. Every redesigned piece is re-measured for AA contrast.
