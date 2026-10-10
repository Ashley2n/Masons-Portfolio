# Architecture & Conventions

_Last updated: 2026-10-09_

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config in `app/globals.css`), `tailwind-merge` for class merging |
| Fonts | `next/font/google`: Playfair Display, Inter, Space Mono |
| Images | `next/image` |
| Video | YouTube embeds (lazy-loaded) |
| Linting | ESLint 9 + `eslint-config-next` |
| Hosting | Vercel (proposed; see [decisions.md](decisions.md)) |

## Folder structure

`app/` is used **only for routing** (pages, layouts and route-level files). Everything else lives at the project root and is imported through the `@/` alias (`tsconfig.json` → `"@/*": ["./*"]`).

### Target

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
  sitemap.ts  robots.ts  opengraph-image.(tsx|png)
components/
  layout/               # Header, MobileNav, Footer, CtaBanner
  ui/                   # Button, Eyebrow, SectionHeading, Container, YouTubeEmbed
  sections/
    home/               # HeroSection, JourneySection, ExpertiseSection, RecentWorkSection, ModelShotsCarousel
    about/              # AboutHero, Timeline
    media/              # GalleryHero, GalleryGrid, CategoryTabs
    contact/            # ContactForm, ContactCard
content/                # all editable copy and data (typed); the only place to change text
  site.ts               # name, nav links, socials, contact info
  home.ts  about.ts  media.ts
lib/
  fonts.ts              # next/font definitions
  utils.ts              # cn() = twMerge(clsx(...)), small helpers
types/
  content.ts            # shared content types (NavLink, Stat, Video, GalleryItem, Milestone…)
public/
  images/<page>/…       # optimized images, kebab-case names
  resume/mason-farrington-resume.pdf
docs/                   # project documentation (you are here)
```

### Current → target mapping

| Current | Target |
|---|---|
| `app/components/layout/Header.tsx` | `components/layout/Header.tsx` |
| `app/lib/constants.ts` (fonts) | `lib/fonts.ts` |
| `app/lib/constants.ts` (data + types) | `content/*.ts` + `types/content.ts` |
| `app/lib/helper-func.ts` | removed (static IDs instead of random) |
| `app/lib/types.ts` (empty) | removed |
| `app/page.tsx` (all sections inline) | `components/sections/home/*` |
| `public/background/*` | `public/images/home/*` (placeholders until real photos arrive) |

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

### Styling

- Use Tailwind utilities and design tokens (`brand-*`, `neutral-*`, `font-playfair`…). Don't hard-code hex values in components.
- Merge conditional classes with `cn()`.
- Global element styles (`h1`–`h3`, `body`) and the few semantic classes (`.display-font`, `.caption-text`) live in `globals.css` only.
- Mobile-first: write base styles for mobile and add `md:` / `lg:` for larger screens.

### Images

- Use `next/image` with real `width`/`height` (or `fill` + `sizes`). Use `priority` only on the hero image.
- Resize and compress large originals before committing (target < 500 KB each).

### Accessibility

- One `<main>` per page (in the root layout), `<header>`, `<nav>`, `<footer>`, and `<section>` with headings.
- Interactive elements are `<a>`/`<Link>` (navigation) or `<button>` (actions), never clickable `<div>`s.
- Visible focus styles. Carousel and gallery are keyboard accessible.
- Color contrast is at least WCAG AA.

## Git workflow

- `main` is always deployable.
- Do the work on short-lived branches: `docs/…`, `feat/…`, `fix/…`, `refactor/…`, `chore/…`.
- Make **small, focused commits** using [Conventional Commits](https://www.conventionalcommits.org): `feat: add footer`, `fix: carousel wraps to first image`, `docs: add design system`.
- Open a PR (or merge locally) per roadmap phase. Vercel preview deploys are used for client review.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
