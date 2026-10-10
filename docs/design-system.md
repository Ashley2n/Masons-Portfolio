# Design System

Source: the "Design System" panel at the top of [`Mockups/Homepage.png`](Mockups/Homepage.png). Tokens are implemented as Tailwind v4 theme variables in [`app/globals.css`](../app/globals.css).

_Last updated: 2026-10-09_

> ⚠️ Hex values were read from a flattened PNG. Values marked **(verify)** should be confirmed against the original design file (see open question I2).

## Theme

The site is **dark-first**. Most sections sit on near-black (`neutral-800`). Light sections (Journey, Expertise and similar on the homepage, and the About timeline) use `neutral-100`. Purple glows and gradients are used as accents.

Don't rely on the visitor's OS light/dark setting. Every section sets its own background and text colors explicitly.

## Color

### Brand (purple), 8 steps

| Token | Hex | Usage |
|---|---|---|
| `brand-100` | `#F2E6FE` | Subtle tints |
| `brand-200` | `#E6CFFE` | |
| `brand-300` | `#D9B5FD` | |
| `brand-400` | `#C09DFD` (verify) | Expertise card |
| `brand-500` | `#A785FC` (verify) | Glows, Expertise card |
| `brand-600` | `#8A5CF6` (verify; code currently has `#8A2CF6`) | **Primary accent**: eyebrows, active nav underline, button borders |
| `brand-700` | `#7234E5` | Expertise card |
| `brand-800` | `#4D3565` | Stat numbers, deep accents |

### Neutral, 8 steps

| Token | Hex | Usage |
|---|---|---|
| `neutral-100` | `#F7F7F8` | Light section background, text on dark |
| `neutral-200` | `#E5E5E7` | |
| `neutral-300` | `#CACACC` | Muted text on dark, nav hover |
| `neutral-400` | `#A1A1AA` | Body text on dark |
| `neutral-500` | `#71717A` | Captions |
| `neutral-600` | _missing from mockup (verify)_ | |
| `neutral-700` | `#3F3F46` | Body text on light, image placeholders |
| `neutral-800` | `#0A0A0B` | **Page background** |

Code currently uses Tailwind's default neutral palette. Phase 3 of the [roadmap](roadmap.md) replaces it with these values.

## Typography

| Family | Weights | Role | CSS variable / utility |
|---|---|---|---|
| **Playfair Display** | Regular 400, SemiBold 600, Bold 700 | Display and headings | `font-playfair` |
| **Inter** | Regular 400, Medium 500, SemiBold 600 | Body and UI | `font-inter` |
| **Space Mono** | Regular 400 | Eyebrows / captions (uppercase, tracked) | `font-space` |

Fonts are loaded with `next/font/google` (self-hosted at build time, no layout shift).

### Type scale

| Style | Size / line-height | Font | Notes |
|---|---|---|---|
| Display | 64px / 1.1 | Playfair Bold, uppercase | Hero name |
| H1 | 48px / 1.15 | Playfair SemiBold | Page titles |
| H2 | 28px / 1.25 | Playfair SemiBold | Section titles |
| H3 | 20px / 1.4 | Playfair Regular | Card titles |
| Body | 16px / 1.7 | Inter Regular | |
| Small | 14px / 1.7 | Inter Regular | |
| Caption | 12px / 1.6 | Space Mono, uppercase, tracked | "Eyebrow" labels above headings |

The code currently uses `text-[100px]` for Display and `text-3xl` (30px) for H2. Phase 3 aligns these with the scale.

On mobile, scale down Display to about 40–44px and H1 to about 36px.

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
| Video card | Home, Media | YouTube thumbnail, title, date. Plays an embed on click. |
| Stat | Home | Large Playfair number + `brand-600` "+" + label. |
| Carousel | Home (Model Shots) | Prev/next arrows + thumbnail strip; must be keyboard accessible. |
| Timeline item | About | Number, title, underline accent, text, image, check node. |
| Gallery grid + filter tabs | Media | Category tabs, play badge on video items, "Load more". |
| Contact form | Contact | Name, Email, Message, Send. Labels in Space Mono. |
| Contact info card | Contact | Image background, contact rows with icons, social links. |

## Icons

The mockups use simple line icons (mail, phone, pin, Instagram, YouTube, arrows). Proposed: [`lucide-react`](https://lucide.dev) for UI icons, plus inline SVGs for brand logos. See [decisions.md](decisions.md).
