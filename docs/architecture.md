# Architecture & Conventions

_Last updated: 2026-10-10_

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config in `app/globals.css`), `tailwind-merge` for class merging |
| Fonts | `next/font/google`: Playfair Display, Inter, Space Mono |
| Images | `next/image` |
| Video | YouTube embeds (click-to-load) (D-20) |
| Linting | ESLint 9 + `eslint-config-next` |
| Testing | Vitest + React Testing Library (jsdom); Playwright e2e from Phase 4 (D-13) |
| Git hooks / CI | husky pre-commit (lint, typecheck, test); GitHub Actions (+ build, + Playwright e2e) |
| Hosting | Vercel, no analytics (D-21) |

## Folder structure

`app/` is used **only for routing** (pages, layouts and route-level files). Everything else lives at the project root and is imported through the `@/` alias (`tsconfig.json` → `"@/*": ["./*"]`).


```
app/
  layout.tsx            # root layout: fonts, <Header>, <main>, <Footer>
  page.tsx              # Home
  about/page.tsx
  media/page.tsx
  resume/page.tsx
  contact/page.tsx
  not-found.tsx
  globals.css           # Tailwind import + @theme design tokens
  sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  apple-icon.tsx
components/
  layout/               # Header, MobileMenu, NavLinks, Footer, CtaBanner
  resume/               # ResumeDialog ("View resume" modal, used on several pages)
  ui/                   # Button, Eyebrow, SectionHeading, Container, VideoCard
  sections/
    home/               # HeroSection, JourneySection, ExpertiseSection, RecentWorkSection, ModelShotsCarousel
    about/              # AboutHero, Timeline
    media/              # GalleryHero, GalleryGrid, CategoryTabs
    contact/            # ContactForm, ContactCard
content/                # all editable copy and data (typed); the only place to change text
  site.ts               # name, nav links, socials, contact info, footer, CTA
  home.ts  about.ts  media.ts  resume.ts  contact.ts
lib/
  fonts.ts              # next/font definitions
  utils.ts              # cn() = twMerge(clsx(...)), small helpers
types/
  content.ts            # shared content types (NavLink, Stat, Video, GalleryItem, Milestone…)
public/
  images/<page>/…       # optimized images, kebab-case names
  resume/mason-farrington-resume.pdf
e2e/                    # Playwright end-to-end tests (*.spec.ts)
docs/                   # project documentation (you are here)
```

The restructure was completed in Phase 2 (2026-10-10). Pages that don't exist yet (`about`, `media`, `resume`, `contact`) and their section folders are added in later phases.

## Conventions

### Server vs client components

- Components are **Server Components by default**.
- Add `"use client"` only to the smallest interactive leaf (carousel, mobile nav, gallery filter, contact form). Never put it on a whole page.

### Naming

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase, one main component per file | `ExpertiseCard.tsx` |
| Non-component modules | camelCase or kebab-case | `fonts.ts`, `utils.ts` |
| Types | PascalCase, **no `Type` suffix** | `Stat`, `Video`, `GalleryItem` |
| Content exports | camelCase | `expertiseItems`, `statItems` |
| Routes and folders | kebab-case | `app/about/` |
| Public assets | kebab-case, descriptive | `hero-portrait.jpg` |
| Docs | kebab-case `.md` in `docs/` | `design-system.md` |

### Content & data

- All user-facing copy and lists live in `content/`. Components receive data through props or import it from `content/`.
- Every list item has a **stable, human-readable `id` or `slug`** (no `Math.random()`), used as the React `key`.
- Every image has meaningful `alt` text.
- Page titles, search descriptions and link-preview copy live in `content/seo.ts`. Pages export `metadata = pageMetadata(pageSeo.<page>)` (`lib/seo.ts`). A new page needs an entry there, which also adds it to the sitemap.

### Styling

- Use Tailwind utilities and design tokens (`brand-*`, `neutral-*`, `font-playfair`…). Don't hard-code hex values in components. The exception is generated images (`opengraph-image.tsx`, `apple-icon.tsx`, `icon.svg`), which can't read CSS variables. Their hex values are commented with the token they mirror.
- Merge conditional classes with `cn()`.
- Global element styles (`h1`–`h3`, `body`) live in `@layer base` and the semantic classes (`.display-font`, `.caption-text`, `.small-text`) in `@layer components` in `globals.css`. Never add unlayered rules there: they override Tailwind utility classes.
- Mobile-first: write base styles for mobile and add `md:` / `lg:` for larger screens.

### Images

- Use `next/image` with real `width`/`height` (or `fill` + `sizes`). Use `priority` only on the hero image.
- Resize and compress large originals before committing (target < 500 KB each).

### Accessibility

- One `<main>` per page (in the root layout), `<header>`, `<nav>`, `<footer>`, and `<section>` with headings.
- Interactive elements are `<a>`/`<Link>` (navigation) or `<button>` (actions), never clickable `<div>`s.
- Visible focus styles. Carousel and gallery are keyboard accessible.
- Color contrast is at least WCAG AA.

## Testing & TDD

This project uses **test-driven development** (D-13). For every change:

1. **Red:** write a test describing the behavior. Run it and watch it fail for the right reason.
2. **Green:** write the minimum code to make it pass.
3. **Refactor:** clean up with the tests still green.
4. Commit the test and the implementation **together**. The pre-commit hook rejects commits with failing tests.

**Bug fixes** start with a test that reproduces the bug.

### What to test

| Kind of code | How | Example |
|---|---|---|
| Pure logic (`lib/`) | Unit test | `getNextIndex` wraps around (`lib/carousel.test.ts`) |
| Interactive client components | RTL: user clicks, keyboard, ARIA state | Carousel next/prev and thumbnails, mobile menu, gallery filter, contact form validation |
| Content (`content/`) | Data integrity tests | Unique IDs, every image has alt text, nav links point to real routes, video URLs are valid |
| Sync Server Components | RTL render + query by role/text | Section shows heading and items from content |
| Pages / routing / async Server Components | Playwright e2e (from Phase 4) | Every nav link loads, resume downloads, contact form submits |

**Don't unit-test** Tailwind class names, visual layout or Next.js/third-party internals. Check those visually against the mockups.

### Where tests live

| Test type | Location | File name | Tool |
|---|---|---|---|
| Logic, components, content | Next to the file it tests | `*.test.ts(x)` | Vitest + React Testing Library |
| Whole pages in a real browser | `e2e/` | `*.spec.ts` | Playwright |

Colocating keeps a test next to its code, so missing tests are visible and files move together. E2E tests cover several pages at once, so they get their own folder. Test files inside `app/` are safe: Next.js only routes `page.tsx`, `layout.tsx`, `route.ts` and similar.

### Conventions

- Colocate tests next to the code: `Foo.tsx` → `Foo.test.tsx`.
- Query like a user: `getByRole`, `getByLabelText`, `getByText`. Avoid test IDs and class selectors.
- Use `@testing-library/user-event` for interactions.
- Test names describe behavior: `it("wraps from the last image back to the first")`.
- Playwright runs desktop and mobile (Pixel 7) projects with the installed Google Chrome (`channel: "chrome"`), so no browser download is needed (D-15). Locally it reuses `npm run dev`; CI tests the production build.
- When a test guards against a bug, check it fails with the bug put back (a test that can't fail protects nothing).
- `next/font/google` is stubbed globally in `vitest.setup.ts`. When adding a new Google font, add its loader to that stub.

## Git workflow

- `main` is always deployable.
- Do the work on short-lived branches: `docs/…`, `feat/…`, `fix/…`, `refactor/…`, `chore/…`.
- Make **small, focused commits** using [Conventional Commits](https://www.conventionalcommits.org): `feat: add footer`, `fix: carousel wraps to first image`, `docs: add design system`.
- The pre-commit hook runs lint, typecheck and tests. Never bypass it with `--no-verify`.
- Open a PR (or merge locally) per roadmap phase. Vercel preview deploys are used for client review.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate Next.js route types (`next typegen`), then type check. Works on a fresh checkout, so CI can run it before `build` |
| `npm test` | Run all tests once |
| `npm run test:watch` | Tests in watch mode (use while doing TDD) |
| `npm run test:e2e` | Playwright end-to-end tests (starts the dev server if needed) |
