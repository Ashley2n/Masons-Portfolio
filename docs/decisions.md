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

- **Date:** 2026-10-09 · **Status:** Accepted; extended by D-12, then D-20
- **Context:** Mason's videos are on YouTube, and the cards should match the site's styling.
- **Decision:** Show a custom card (YouTube thumbnail, title, date, play badge). Load the YouTube iframe only on click, using `youtube-nocookie.com`.
- **Consequences:** Full control over card styling and much faster page loads (no iframes until needed). Better privacy.

### D-06 · Resume: preview + download page

- **Date:** 2026-10-09 · **Status:** Accepted; implemented in Phase 7, amended by D-16
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

- **Date:** 2026-10-10 · **Status:** Accepted; amended by D-24 (gallery) and D-28 (Contact photo)
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

- **Date:** 2026-10-19 · **Status:** Accepted (confirms D-03); amended by D-26
- **Context:** Mason will add and remove photos, but only every 3–6 months (Q C1). A CMS costs setup time and another account for very little use.
- **Decision:** Content stays in `content/*.ts`. Mason drops new photos into the shared Google Drive folder with a category and a short caption, and Ashley adds them (file, alt text, dimensions) and redeploys.
- **Consequences:** No cost and nothing new to build; alt text stays good because Ashley writes it. If updates become frequent, a Git-based admin page (Keystatic or Decap: free, no database, commits to the repo) is the cheapest upgrade.

### D-19 · Contact form sends through Resend

- **Date:** 2026-10-19 · **Status:** Accepted (supersedes D-07); unblocked 2026-10-31 (F1 resolved)
- **Context:** Mason wants a nicely formatted email when someone reaches out (Q C2). Formspree's free emails are plain; sending through his Gmail would store a password with full mailbox access in Vercel.
- **Decision:** A server action sends a branded HTML email via Resend (free tier) to Mason, with `replyTo` set to the visitor. Mason owns the Resend account, signed up with the receiving address, so it can deliver to him before a domain is verified. The API key lives in a Vercel environment variable. It replaces the `send` function injected into `ContactForm`.
- **Consequences:** Send-only credential and delivery logs. Until a domain is verified, mail comes from `onboarding@resend.dev` and only reaches the account owner's address; adding a domain later only changes the `from` address. Blocked on Mason creating the account (F1).

### D-20 · Videos are YouTube-only

- **Date:** 2026-10-19 · **Status:** Accepted (supersedes D-12); social links amended by D-30
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

- **Date:** 2026-10-26 · **Status:** Accepted (extends D-11); 97 imported, two damaged photos left out (C16)
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

- **Date:** 2026-10-26 · **Status:** Accepted (amends D-11 for this photo); the card is redesigned under D-33 (C22)
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

- **Date:** 2026-10-29 · **Status:** Email part Accepted; phone part superseded by D-35
- **Context:** His resume lists `mason.13.farrington@gmail.com`; the site used `masonfarrington@gmail.com`. The resume also prints his cell number, which the site has never shown (C3).
- **Decision:** The site's email becomes `mason.13.farrington@gmail.com`. The phone number appears nowhere public: the published resume PDF has the phone line removed from the file itself (not covered with a box), and the output is checked with a text extraction. (Ashley, 2026-10-29.)
- **Consequences:** The Resend account (F1, D-19) is expected under the same address; with no domain, Resend can only deliver to the account's own address, so confirm it before building the form. The original resume (with phone) is not committed.

### D-32 · Only real videos on the site; empty video sections hide

- **Date:** 2026-10-29 · **Status:** Accepted; Reel 2 0 shown as "Intro Video" (U2), three more reels added 2026-10-31 (F3)
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

### D-34 · Mason's reels keep their contact title card (exception to D-31)

- **Date:** 2026-10-31 · **Status:** Superseded by D-35
- **Context:** Mason sent three more reels (Vocal, Dance, Acting; F3). Their YouTube thumbnail is a title card he made with his email, phone number and Instagram handle, so the Other Work cards show it. D-31 says no phone number anywhere public, and D-30 says no social links.
- **Decision:** Show the reels as Mason uploaded them, title card included. Ashley believes the card is deliberate (a casting-style contact slate) and that it's the only place the number appears. The site itself still shows no phone number and links no profiles: the exception covers Mason's own video content only. Ashley confirms with Mason (U3). (Ashley, 2026-10-31.)
- **Consequences:** The number is visible on the homepage and Media page through YouTube's thumbnails and players. The site's code, content files and docs still never contain it. If Mason wants it gone, he changes the thumbnail (and the video, if the card is in it) on YouTube; the site picks that up without a code change. If he can't, swap to our own thumbnails or hold the reels back.

### D-35 · Mason's phone number may be public: resume as sent, reels as uploaded

- **Date:** 2026-10-31 · **Status:** Accepted; supersedes D-34 and the phone part of D-31
- **Context:** D-31 kept his phone number off everything public, and D-34 made a provisional exception for the contact card on his reels. Ashley checked with Mason (U3).
- **Decision:** Mason wants his contact details shown where he put them. The resume PDF is published exactly as he sent it, phone line included, and the reels keep their contact-card thumbnails. (Mason, confirmed to Ashley 2026-10-31.)
- **Consequences:** The resume PDF and reel thumbnails are the only places the number appears; the site's own pages still don't show it and `contactInfo.phone` stays unset: Ashley keeps it off the Contact page and footer (2026-10-31). No exception is left to track. D-30 (no social links on the site) is unchanged, even though his Instagram handle shows on the reel thumbnails.

### D-36 · How the contact form sends through Resend

- **Date:** 2026-10-31 · **Status:** Accepted (implements D-19; #16, #17, #18)
- **Context:** D-19 chose Resend via a server action. #17 needed the details: what gets checked on the server, what's logged, how the form behaves while sending, and how to test without emailing Mason.
- **Decision:**
  - **Send hook** (#16): `ContactForm`'s injectable `send` takes the validated values and resolves to `{ ok }` (`ContactSend`, `lib/contact.ts`). The form only says "sent" when `ok`; a rejected promise counts as failed. The default `send` is the server action `sendContact` (`lib/contact-action.ts`), the only place `RESEND_API_KEY` is read.
  - **Server checks:** the logic lives in `sendContactMessage` (`lib/send-contact-message.ts`, `import "server-only"`), which treats input as untrusted, checks the shape, then reuses the client's `validateContact`, so the server rejects everything the browser does. It also rejects what only a direct POST could send: a name over 100 characters, an email over 254 (RFC 5321 path limit) or containing `, ; < > " ( ) [ ] \` (Reply-To stays one bare address), and control characters (the message may keep line breaks) (Ashley, 2026-10-31). The Resend client is passed in, so tests use a fake.
  - **Email:** to `contactInfo.email`, from `onboarding@resend.dev` (no verified domain yet, D-19), Reply-To = the visitor, subject `Portfolio inquiry from <name>`, plain text plus a branded HTML version (#18, below).
  - **Branded email** (#18, Ashley 2026-10-31): `buildContactEmail` returns `{ subject, text, html }`, so one function builds the whole email and `sendContactMessage` sends both versions. The HTML is a table layout with inline styles on a light background (Gmail drops `<style>` and ignores flex/grid; light reads best in inboxes even though the site is dark-first), with no new dependencies. Visitor input is HTML-escaped; line breaks become `<br>` (some clients ignore `white-space`). Colors repeat the tokens as hex (`EMAIL_COLORS`), the generated-images exception in `docs/architecture.md`, and a unit test fails if a brand value drifts from `app/globals.css`. The look was checked by a manual screenshot, not an automated visual test.
  - **Privacy:** failures log only a fixed message plus Resend's error `name`/`statusCode`, never its `message` (it can echo addresses) and never the visitor's name, email or message. A missing key fails as "not sent", not a crash.
  - **Form states:** sending (status line and button say "Sending…"; the button is `aria-disabled`, not `disabled`, so it keeps keyboard focus, and `onSubmit` ignores repeat presses; fields are read-only so the confirmation matches what was sent), sent, failed (offers Mason's email as a link). Copy agreed with Ashley 2026-10-31.
  - **Testing:** no automated test sends email. Unit tests inject fakes; an auto fixture in `e2e/fixtures.ts` aborts every server-action request in the browser for every e2e test, because local e2e can reuse a dev server that has the real key from `.env.local`. ESLint stops specs importing `test` from `@playwright/test` directly, so new specs get the guard too. Real sends are checked by hand, labelled as tests (#20).
- **Consequences:** `mailto:` sending and `buildMailtoUrl` are gone. The 1,500-character limit stays because the error copy promises it. Vitest aliases `server-only` to the package's own no-op (`vitest.config.mts`); Next's build still enforces it.

### D-37 · Spam protection on the contact form

- **Date:** 2026-11-05 · **Status:** Accepted (implements #19; builds on D-36)
- **Context:** #19 asks for basic spam protection with no new accounts: a hidden honeypot and a minimum time, checked on the server. Per-IP rate limiting is out of scope (it needs storage such as Upstash); the worst case is flooding Mason's own inbox, because the onboarding sender can only deliver to him (D-19). Ashley agreed every choice below on 2026-11-05 and said bots are a low risk, so this stays minimal.
- **Decision:**
  - **Pure helper:** `isSpamSubmission({ website, startedAt }, now)` in `lib/contact-spam.ts`, so tests use fixed numbers and no fake timers. `sendContactMessage` calls it with an injected `now`; `sendContact` passes `Date.now`.
  - **Load time:** the form records `startedAt` (`Date.now()` on mount) and submits it. Options: the client sends a timestamp (chosen) or the server signs a token on load. The timestamp is forgeable by a bot that reads our code and depends on the visitor's clock; the signed token needs a new secret, an extra round trip on every page load and more code. Swap in the token only if spam shows up; the helper's interface stays the same.
  - **Rules:** spam if the honeypot (`website`) is not `""`, if `startedAt` is missing, not a number or not finite, or if `now - startedAt` is under `MIN_FILL_MS` (3000 ms; a future time gives a negative gap, so it is flagged too). ⚠ The 3 seconds is a judgment, not from the ticket or docs: a human can't read, fill in and send in under 3 s, and a false positive silently loses a real lead, so it stays low. Tune the constant if real data says otherwise.
  - **Order and reply:** parse → spam check → validate → send. Spam gets the normal `{ ok: true }`, sends nothing and logs nothing, so a bot has nothing to learn or retry from (the ticket asks for this; no logging follows the "never log visitor details" rule in D-36). Spam is checked before validation so invalid junk gets the same reply.
  - **Types:** `ContactSubmission = ContactValues & { website; startedAt }`, and `ContactSend` takes it. `validateContact` and `buildContactEmail` still take `ContactValues`, so the spam fields can never reach Mason's email.
  - **Honeypot field:** `<input name="website">` in an `aria-hidden` wrapper with `sr-only` (kept rendered because some bots skip `display:none`), `tabIndex={-1}` and `autoComplete="off"`. Read through a ref at submit, so no state. ⚠ The field name and the `sr-only` choice are unsourced.
- **Consequences:** a visitor with JavaScript disabled can't send (the form already needed it). Real Chrome autofill may still fill a hidden field despite `autoComplete="off"`; that would drop a real message silently, so check by hand in #20 that autofill leaves `website` empty. e2e can't see the server's decision (the fixture aborts the request), so seam 2's unit tests cover it.

### D-38 · Full-site visual refresh inside the locked design system

- **Date:** 2026-11-06 · **Status:** Accepted (scope and direction); built on `feat/redesign`, not shipped until Mason sees before/after (U1)
- **Context:** Ashley finds the site stale after seeing it every day and wants every page refreshed today. D-33 approved a redesign of six parts only, and `PRODUCT.md` locks the palette and fonts (D-10) and says layout, palette, type and copy changes go to Mason first.
- **Decision:** Ashley chose (2026-11-06) a fresh look on **every page, inside the locked system**: the purple `brand-*` palette, Tailwind `neutral`, Playfair/Inter/Space Mono and all copy stay. The direction is **editorial cinematic**: larger type and stats, photo-led cards (Mason's own photos, D-24), a tighter rhythm, one authored scroll moment that respects `prefers-reduced-motion`, and a CTA banner whose heading reaches AA. Skill: `impeccable` (D-27, which rejected the Taste Skill). Rejected: stage-light atmosphere (competes with the photos) and a light tidy-up (probably still feels familiar). The light/dark section rhythm stays, as `docs/design-system.md` defines it.
- **Eyebrows removed:** the Impeccable craft floor bans a label above a heading (`.claude/skills/impeccable/reference/craft-floor.md`, "Page scaffolds"). They were mockup copy, which `PRODUCT.md` (Brand Commitments) says goes to Mason, so we first kept them; then Ashley decided on 2026-11-06 to remove them (she has free rein on copy, `docs/open-questions.md`, Resolved, 2026-10-09 entry). Removed above every page and section heading (Home, About, Media, Contact, Resume). Kept on purpose: the hero's role list (it is content), the "Contact info" tag on the Contact card and "Error 404" on the 404 page. Ashley also chose to leave the Journey stats, the About stock photos and the reel thumbnails as they are (2026-11-06).
- **Expertise cards:** photos from Mason's gallery, not links (D-33; C24 dropped the links, `docs/roadmap.md`). The old test that each card was a link is replaced.
- **Consequences:** the redesign changes how every page looks, so it goes to Mason as before/after. The before screenshots were taken 2026-11-06 at 1280 and 390 px.

### D-39 · Round 2 of the refresh: fixes agreed, options to be chosen

- **Date:** 2026-11-06 · **Status:** Accepted (every block is decided and built; see the progress notes and D-40)
- **Context:** After round 1 (D-38, PR #27) Ashley listed what still felt wrong: the homepage, navbar and buttons had not changed; the Media hero button leads to the page you are on; the Contact card hierarchy; the location; the About timeline's last entry sits in the wrong column.
- **Decision:** The audit, the three agreed fixes, and the options for the navbar, buttons, homepage, Contact card and footer are in `docs/specs/2026-11-06-site-refresh-round-2.md`. Agreed (Ashley 2026-11-06): remove the Media hero "Explore the gallery" button; show the location as "Iowa, US" everywhere from the one source `content/site.ts`; fix the timeline column. Not decided: which option to build in each block (the spec recommends one per block).
- **Rejected for now:** nothing yet. ⚠ "Iowa, US" is Ashley's call and not confirmed by Mason.
- **Sources:** Ashley, 2026-11-06; code paths and line numbers are in the spec.
- **Consequences:** build the three fixes first (TDD); update this entry to Accepted, with the chosen options, before building the rest.
- **Progress (2026-11-06, homepage 3.3):** Ashley chose variant 1 of the live rhythm preview and agreed every seam. `b7e7c43` alternates the bands (Model Shots and Expertise light, Journey and Recent Work dark; the Journey glow went from `opacity-70` to `50` so it suits the dark band); `3329483` adds the hero scroll cue and a larger roles line; `fd5b87d` makes the Model Shots carousel a CSS scroll-snap track with larger thumbnails (56/80/96px). The Contact card (`db2a7cc`), footer roles line (`143f58a`) and mobile menu (`7350e0b`) are in D-40. Recent Work (dark) runs into the dark CTA banner, so Ashley added a 1px `neutral-800` hairline (`border-t`) at the top of `CtaBanner`'s section ("add it, we will see", 2026-11-06); the banner is shared, so it also shows on About, Media and Resume. Pinned in `e2e/section-rhythm.spec.ts`.
- **Progress (2026-11-06):** the three fixes are built, each test-first, one commit each on `feat/redesign`: `8a474cd` (Media hero button), `eec7b5b` ("Iowa, US"), `f2081f7` (timeline column, `md:col-start-2` when the entry has no photo). Still Proposed: the option blocks.
- **Progress (2026-11-06, buttons 3.2):** Ashley chose option A (solid `brand-600` primary + outline secondary) after comparing A, B and C in the browser. Built in `48d82c6`: `Button` `primary` variant (5.11:1 text on `brand-600`, calculated with the WCAG formula and checked in the browser by `e2e/buttons.spec.ts`), `ResumeDialog` `variant` prop, Home hero order resume then work. B (pill with arrow disc) and C (gradient wipe on hover) were rejected. Applied to the Home hero only; the rest of the site's buttons are still open (see the spec).
- **Progress (2026-11-06, buttons on every page):** Ashley decided one primary per page: About hero View resume (`b689829`), Contact Send message with a spinner while sending (`36a5d4a`), Resume page Download PDF (`446d1ac`). The ↗ now means "opens a new tab": `Button` shows it only for `newTab` links, and internal links (About Designer card, Home View More, View work, Get in touch, Back home) have no icon. F8: the About Designer card stays as it is. Each change was test-first (unit plus the `e2e/buttons.spec.ts` colour and contrast table). 3.2 is finished; still Proposed overall because the navbar, homepage, Contact card and footer options are open.

### D-41 · Motion pass: one authored moment and three quiet supports

- **Date:** 2026-11-06 · **Status:** Accepted (Ashley's decision); all four slices built on `feat/redesign` (`32d4b1e`, `7e5fa5b`, `c3a26f3` to `f34488c`, `b72d42e`)
- **Context:** `docs/design-system.md:79` says larger motion (scroll reveals, page transitions) needs an `/architect` decision first. Ashley asked for a motion pass before the reviews and agreed every item, timing and test seam with the agent on 2026-11-06 (`docs/handoff.md`, "Motion pass").
- **Decision:**

| Decision | Options considered | Why this one | Risk / tradeoff | Source |
|---|---|---|---|---|
| One authored moment: the hero entrance (roles, name, tagline, two buttons rise 600ms each, 100ms apart, done by 1s) | Entrance on every section; hero only; none | One rehearsed focal sequence beats repeated reveals on a Persuade page; the portrait stays still (C15) | Costs the visitor about 1s of choreography on the first screen | Ashley 2026-11-06; `.claude/skills/impeccable/reference/animate.md` ("Visitor mode", "Set the motion thesis") |
| Page change: a quick crossfade of the page content (about 200 to 250ms), header and footer stay still | Slide or morph transitions; no transition | Quiet continuity; a morph has no shared element to carry on this site | If the header and footer can't be pinned reliably, stop and bring options instead of shipping a flicker | Ashley 2026-11-06; `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` (route navigations are Transitions, so `<ViewTransition>` animates them with no config) |
| Mobile menu: the panel slides up while fading in (330ms) and drops away faster (198ms); the Menu/X icon turns into place (264ms); the panel is see-through neutral (`neutral-900` at 85% plus a backdrop blur) instead of solid, so the page shows faintly behind it (Ashley asked for "transparent blue", chose translucent neutral because blue is off-palette, D-10) | Opacity fade only (first agreed, 250ms in / 150ms out); no animation | Exit faster than entrance; Ashley asked for the slide, the icon turn and 10% longer, then 20% longer again, on 2026-11-06 after seeing it | The panel stays mounted 198ms after closing (short unmount delay, not CSS-only) so the scroll lock, which follows the node, releases only when it is gone; reduced motion skips the movement and the delay | Ashley 2026-11-06; `animate.md` ("Timing and easing"); `components/layout/MobileMenu.tsx` |
| Section headings (`h2` only, never `h1`) use the existing `reveal` | Reveal on every block | Headings are the one place a scroll cue helps; the hero name already has the entrance | Scroll-driven, so browsers without `animation-timeline` just show it | Ashley 2026-11-06; D-33, D-38 (`.reveal`) |
| Easing `cubic-bezier(0.16, 1, 0.3, 1)`, CSS only, no new dependency, every item has a reduced-motion path (reveal-style effects are also `screen` only) | A motion library (Motion, GSAP) | The stack expresses all four with CSS and React's own `<ViewTransition>` | `<ViewTransition>` is not in stable `react@19.2.8`; Next's bundled React provides it (the guide names React 19.3) | `animate.md` ("Implement to the runtime", "Accessibility and control"); `package.json:21` |

- **Exception (Ashley, 2026-11-06):** the hero scroll cue keeps its endless `animate-bounce` (reduced-motion safe, `motion-safe:`) even though the hero entrance is meant to be the one authored moment, and it moved from the bottom centre to the bottom right. `impeccable detect` flags the bounce as an advisory ("bounce-easing"); accepted. Pinned in `e2e/section-rhythm.spec.ts`.
- **Kept on purpose:** the Menu/X icon turns in on a full page load as well as on a swap (the header persists across client navigations, so it is only on load). Limiting it needs extra state in `MobileMenu` and a test for a negligible gain; Ashley left the decision to the agent (2026-11-06) and it was not judged necessary.
- **Consequences:** `docs/design-system.md:79` is updated to point here. Tests are e2e, in `e2e/motion.spec.ts` and `e2e/mobile-menu.spec.ts`, because the motion is CSS and only a real browser computes it.

### D-40 · Full-screen mobile menu, no Contact pill, plain Contact card

- **Date:** 2026-11-06 · **Status:** Accepted (Ashley's decisions); built on `feat/redesign`, not shipped until Mason sees before/after (U1)

| Decision | Options considered | Why this one | Risk / tradeoff | Source |
|---|---|---|---|---|
| Mobile menu is a full-screen panel (`fixed inset-0`) that locks page scroll, with links centred and at least 44px tall | The old drop-down list; the same panel with larger links | Ashley asked for it from a reference image, then "take up the whole page and prevent scrolling" | Link text is still 14px Space Mono caps; Ashley was offered larger links twice and chose to keep them as they are (2026-11-06) | Ashley 2026-11-06; `7350e0b`; `components/layout/MobileMenu.tsx`; `e2e/mobile-menu.spec.ts` |
| Header stays exactly as it is: no sticky header, no Contact pill | Three live variants of a sticky header with a Contact pill (option B) | Ashley saw all three and discarded them | None; the hero still pulls under the header with `-mt-(--header-height)` | Ashley 2026-11-06; `docs/specs/2026-11-06-site-refresh-round-2.md` 3.1 |
| Contact card: plain lines, no mail, pin or phone icons; email first, then `Iowa, US`; name `text-h2` (was `text-h1`); no `tel:` link | Making the email bigger (spec 3.4 option A) | Ashley said not to make the email bigger; with no icons the two lines read as matching | The "Contact info" tag above the name was removed on Ashley's go-ahead (2026-11-06); "Contact info" stays as the card's landmark name (`aria-label`) | Ashley 2026-11-06; `db2a7cc`; `components/sections/contact/ContactCard.test.tsx`; D-35 (no phone) |

- **Consequences:** the mobile menu's motion and see-through background are in D-41.

### D-42 · More motion: feedback everywhere, a few quiet reveals, two more authored moments

- **Date:** 2026-11-06 · **Status:** Proposed (Ashley chose the amount and both moments; each slice still needs her OK when built and shown)
- **Context:** `docs/design-system.md:79` says motion beyond D-41 needs a recorded decision. Ashley asked how much more motion and how many small user responses the site can take. The audit of the code (2026-11-06) found: no control on the site has a press state (`grep "active:"` over `components/` and `app/` is empty); hover and focus are mostly covered; state changes are instant (form errors, sent and failed message, Resume dialog open and close, "Load more" items, video thumbnails). Tailwind 4.3.3 wraps `hover:` in `@media (hover: hover)`, so hover does not stick on touch; phones simply get no feedback without a press state (`node_modules/tailwindcss/dist/lib.mjs`, `hover` variant).
- **Decision:**

| Decision | Options considered | Why this one | Risk / tradeoff | Source |
|---|---|---|---|---|
| Amount: option C of the handoff (feedback, plus a few quiet reveals, plus more authored moments) | A feedback only (recommended by the agent); B plus quiet reveals | Ashley chose "all the above" when offered A, B and C | Amends D-41's "one authored moment": the hero stays the entrance, and the timeline line and the Journey count-up are the two more. More to test and review; a Persuade page can feel busy | Ashley 2026-11-06; D-41; `.claude/skills/impeccable/reference/animate.md` ("Visitor mode": prefer one focal sequence to repeated reveals) |
| Authored moments: About timeline line draws as you scroll; Journey stats count up | Only one of the two | Ashley chose both | The stats are small numbers (10, 12, 4), so the count ends fast; the count-up must keep the number as real text for screen readers, show the final number when motion is reduced or `animation-timeline` is missing | Ashley 2026-11-06; `content/home.ts:21-25`; `components/sections/about/Timeline.tsx:33` |
| Count-up technique: a registered integer custom property (`@property`) driven by a scroll-driven animation and shown with a CSS counter; the real number stays in the DOM as `sr-only` text | A JavaScript counter; a motion library | The stack does it in CSS; D-41 already rules out a new dependency | Generated content is not read by screen readers, hence the `sr-only` real text; `@property` needs a current browser (older ones show the final number) | [MDN `@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property), [MDN `animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline); D-41 (CSS only) |
| Feedback set, each with a reduced-motion path: press states (a small scale-down, 100 to 150ms) on buttons, carousel arrows and thumbnails, "Load more", filter tabs, the dialog close button; form field focus, error text arriving, and the sent and failed message arriving; Resume dialog fade and scale in, faster out; "Load more" arrow nudge and new items entering; video thumbnails fade in on load | Hover and colour only (what exists) | Closes the audit's gaps; feedback is what animate.md says motion is for | Dialog and gallery items need a short unmount delay like `MobileMenu` (`EXIT_MS`); every effect adds an e2e test | animate.md ("Find the job", "Accessibility and control"); `components/layout/MobileMenu.tsx`; `components/resume/ResumeDialog.tsx:60` |
| Quiet reveals: Recent Work video cards and gallery items use the existing `reveal` | A new reveal style | Reuses `.reveal` (screen only, reduced-motion safe) | Gallery items are added by "Load more" and filters: reveal must not hide content that is already in view | `app/globals.css` (`.reveal`); D-33, D-38 |
| Same rules as D-41: easing `cubic-bezier(0.16, 1, 0.3, 1)`, exits faster than entrances, design tokens only, CSS only, movement stops for reduced motion but colour and opacity feedback stays | | Keeps the site's motion language one thing | | D-41; animate.md ("Timing and easing") |

- **Not in this pass:** the stronger mobile-menu effect. Ashley has not supplied a reference and "more significant" has no shape yet, so it needs real research (D-41, "Kept on purpose"). Left for later and said so.
- **Open:** whether the Expertise cards should keep their hover zoom now that they are not links (D-38). A zoom on something that does not respond to a click suggests it does.

### D-43 · Gallery tab order and five photos removed (Mason's feedback)

- **Date:** 2026-11-06 · **Status:** Accepted (Mason's feedback via Ashley; amends the order in D-22 and D-23)
- **Context:** Ashley recorded Mason's feedback in `docs/feeback.md`: the gallery tags in the order Staged, Modeling, Concerts, Recital, Design, and five photos to take off the site (embedded in that file as `image.png` to `image-4.png`).

| Decision | Options considered | Why this one | Risk / tradeoff | Source |
|---|---|---|---|---|
| Tabs run All, Staged, Modeling, Concerts, Recital, Design, Other. The source of the order is `galleryCategoryIds` (`types/content.ts`), so the "All" view also takes one photo from each category in that order | Reorder the tabs only; leave "All" as it was | One source of truth already drives both the tabs and the "All" interleave; a second order would drift | "All" now leads with a Staged photo instead of a Concerts one | Mason via Ashley, `docs/feeback.md`; `content/media.ts`; `lib/gallery.ts` |
| "All" stays first and "Other" stays last, labels unchanged ("Staged", "Recital") | Rename to Mason's words "Stages" and "Recitals"; drop "Other" | Mason's list has five tags; "All" and "Other" were not in it, and "Other" holds his four reels | ⚠ unsourced assumption that the wording was loose and "Other" should stay; confirm with Mason | `docs/feeback.md` (his list omits All and Other); `content/media.ts` videos are in "other" |
| Removed `staged-12`, `staged-19`, `staged-20`, `staged-21`, `staged-33` from `content/gallery-photos.ts` and deleted the five files from `public/images/media/staged/` | Hide the entries but keep the files | A public repo should not keep photos Mason asked to take down; the content test already fails on unused image files | Photos stay in git history; the numbering has gaps | Mason via Ashley, `docs/feeback.md`; `content/content.test.ts` ("uses every image file") |

- **Consequences:** `content/content.test.ts` pins the new order and the five removed ids. The import script may reuse number 33 for a later Staged photo.
