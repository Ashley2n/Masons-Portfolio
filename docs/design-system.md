# Design System

Sources: **the colors and fonts configured in code are the source of truth** ([`app/globals.css`](../app/globals.css), [`app/lib/constants.ts`](../app/lib/constants.ts)). Layout, type scale and components come from the "Design System" panel in [`Mockups/Homepage.png`](Mockups/Homepage.png). Tokens are Tailwind v4 theme variables (decision D-10).

_Last updated: 2026-10-10 (Phase 3)_

## Theme

The site is **dark-first**. Most sections sit on near-black (`neutral-950`). Light sections (Journey, Expertise and similar on the homepage, and the About timeline) use `neutral-100`. Purple glows and gradients are used as accents.

Don't rely on the visitor's OS light/dark setting. Every section sets its own background and text colors explicitly.

## Color

### Brand (purple), 8 steps (from code)

| Token | Hex | Usage |
|---|---|---|
| `brand-100` | `#F2E6FE` | Subtle tints |
| `brand-200` | `#E6CFFE` | |
| `brand-300` | `#D9B5FD` | |
| `brand-400` | `#C09CFD` | Expertise card |
| `brand-500` | `#A78BFA` | Glows, Expertise card |
| `brand-600` | `#8A2CF6` | **Primary accent**: eyebrows, active nav underline, button borders |
| `brand-700` | `#7234E5` | Expertise card |
| `brand-800` | `#4D3565` | Stat numbers, deep accents |

### Neutral (Tailwind default `neutral` scale)

The code uses Tailwind's built-in `neutral` palette, so no custom tokens are needed.

| Token | Usage |
|---|---|
| `neutral-100` | Light section background, headings/text on dark |
| `neutral-300` | Nav hover, muted text on dark |
| `neutral-400` | Body text on dark |
| `neutral-500` | Captions, dates |
| `neutral-600` / `neutral-700` | Body text on light, image placeholders |
| `neutral-800` | Headings on light |
| `neutral-950` | **Page background** |

The mockup PNG's neutrals (`#A1A1AA`, `#71717A`, `#3F3F46`…) are a slightly cooler gray, close to Tailwind's `zinc` scale. Switching is optional and not planned.

## Typography

| Family | Weights | Role | CSS variable / utility |
|---|---|---|---|
| **Playfair Display** | Regular 400, SemiBold 600, Bold 700 | Display and headings | `font-playfair` |
| **Inter** | Regular 400, Medium 500, SemiBold 600 | Body and UI | `font-inter` |
| **Space Mono** | Regular 400 | Eyebrows / captions (uppercase, tracked) | `font-space` |

Fonts are loaded with `next/font/google` (self-hosted at build time, no layout shift). Use these three fonts on **every** page. The Contact mockup shows a different serif and sans, but that is not intended.

### Type scale

| Style | Token | Size / line-height | Font | Notes |
|---|---|---|---|---|
| Hero | `text-hero` | 100px / 1.1 | Playfair Bold, uppercase | Homepage hero name only (D-14). 44px mobile → 72px tablet → 100px desktop via `.display-font` |
| Display | `text-display` | 64px / 1.1 | Playfair Bold | Large page titles (About, Media, Contact) |
| H1 | `text-h1` | 48px / 1.15 | Playfair SemiBold | Page titles |
| H2 | `text-h2` | 28px / 1.25 | Playfair SemiBold | Section titles |
| H3 | `text-h3` | 20px / 1.4 | Playfair Regular | Card titles |
| Body | `text-body` | 16px / 1.7 | Inter Regular | |
| Small | `text-small` | 14px / 1.7 | Inter Regular | `.small-text` |
| Caption | `text-caption` | 12px / 1.6 | Space Mono, uppercase, tracked | "Eyebrow" labels, `.caption-text` |

Tokens live in `app/globals.css` and are checked by `app/design-tokens.test.ts`. On mobile, scale Display down to about 40–44px and H1 to about 36px.

## Spacing & layout

- Content max width: about 1280px, centered.
- Page gutter: 92px on desktop (`px-23`, as currently used) → 24px on tablet → 16px on mobile.
- Section vertical padding: about 64px desktop / 48px mobile.
- Corner radius: `rounded-lg` (8px) for cards and media; `rounded-md` (6px) for buttons and inputs.

## Responsive

There are no mobile mockups. Rules:

| Breakpoint | Behavior |
|---|---|
| `< md` (mobile) | Single column. Nav collapses to a menu button. Expertise grid → 1 column. Other Work → horizontal scroll or 1 column. Gallery → 2 columns. Timeline → single line on the left. |
| `md` (tablet) | Expertise 2 columns, Other Work 2 columns, Gallery 3 columns. |
| `lg+` (desktop) | Matches mockups. |

## Components (inventory)

| Component | Appears on | Notes |
|---|---|---|
| Header / Nav | All | MF monogram, links: About, Media, Resume, Contact. Active link = `brand-600` underline. |
| Footer | All | Monogram + ©, Navigation, Connect, Contact/Location columns. |
| CTA banner | Home, About, Media | "Interested in working together?" + "Get in touch" button → `/contact`. |
| Eyebrow | All | Caption style, `brand-600`, uppercase. |
| Section heading | All | Eyebrow + H2 (+ optional subtitle and "View more" link). |
| Button: outline | Hero, Media | Dark fill, `brand-600` border, label + ↗ arrow. |
| Button: solid light | CTA banner | White pill, dark text. |
| Expertise card | Home | Purple gradient tile, title, subtitle, ↗. Hover: slight scale. |
| Video card | Home, Media | One card style for both platforms: thumbnail, title, date, platform badge. YouTube plays inline on click; Instagram Reels open Instagram (D-12). Vertical 9:16 variant for Reels/Shorts. |
| Stat | Home | Large Playfair number + `brand-600` "+" + label. |
| Carousel | Home (Model Shots) | Prev/next arrows + thumbnail strip; must be keyboard accessible. |
| Timeline item | About | Number, title, underline accent, text, image, check node. |
| Gallery grid + filter tabs | Media | Category tabs, play badge on video items, "Load more". |
| Contact form | Contact | Name, Email, Message, Send. Labels in Space Mono. |
| Contact info card | Contact | Image background, contact rows with icons, social links. |

## Icons

The mockups use simple line icons (mail, phone, pin, Instagram, YouTube, arrows). Proposed: [`lucide-react`](https://lucide.dev) for UI icons, plus inline SVGs for brand logos. See [decisions.md](decisions.md).
