# Site refresh, round 2: audit, fixes and options to choose

- **Date:** 2026-11-06 · **Owner:** Ashley · **Status:** Draft. Section 2 is agreed work. Section 3 needs Ashley to pick options before anything is built.
- **Follows:** D-38 (`docs/decisions.md`), PR #27 (round 1, open, waiting on Mason). Recorded as D-39 (Proposed).
- **Rules that still hold:** `PRODUCT.md` (palette, fonts and copy are locked unless Ashley decides; Mason sees before/after, U1), `CLAUDE.md` (TDD, tokens not hex, lucide icons with `aria-hidden`, semantic HTML), AA contrast, reduced motion, mobile first.
- **Source key:** "Ashley 2026-11-06" = her message in the session. `path:line` = this codebase on `feat/redesign`. **⚠ unsourced** = a design judgment with no doc behind it. No outside links are cited; none were checked.

## 1. What Ashley noticed, and what the audit found

| # | Finding | Evidence | Verdict |
|---|---|---|---|
| F1 | "Explore the gallery" on the Media hero goes to `#gallery`, which sits a screen below on the same page | `content/media.ts:16`, `app/media/page.tsx:15` | Confirmed redundant. Remove it (2.1) |
| F2 | Location should read "Iowa, US", in the footer and the Contact card, consistently | `content/site.ts:20` is the single source; `Footer.tsx:77` and `ContactCard.tsx:56` both read it | Confirmed. One string change (2.2) |
| F3 | About timeline: "Movie Actor" sits in a different column from the other entries | `Timeline.tsx:45`: text gets `md:order-2` on odd entries, but with no image there is nothing to order against, so it stays in column 1 | Confirmed bug, root cause found (2.3) |
| F4 | Contact card hierarchy | `ContactCard.tsx:35-39`: the name is `text-h1`, bigger than the email people came for; the location is a full icon row; the resume button is a third element | Confirmed. Options in 3.4 |
| F5 | Buttons "haven't changed" | `Button.tsx`: still two variants (outline, light) plus the new arrow nudge | Round 1 only added the hover nudge. Options in 3.2 |
| F6 | Navbar not improved | `Header.tsx`: not sticky, Contact is a plain text link like the others | Confirmed. Options in 3.1 |
| F7 | Homepage needs more | Four light sections in a row (Model Shots to Recent Work), then a dark CTA | Options in 3.3 |
| F8 | **New:** the About hero "Designer ↗" card links to `/media` with no stated reason | `AboutHero.tsx:31-47`, `content/about.ts` `feature.href` | Ask: what is it for? Round 1 made the Home expertise cards non-links (D-33, C24) |
| F9 | **New:** three routes to `/media` from the Home page (nav "Media", hero "View work", Recent Work "View More") | `HeroSection.tsx:41`, `RecentWorkSection.tsx:26`, `content/site.ts:14` | Decide which to keep (see button table in 3.2) |

## 2. Agreed changes (no decision needed)

| Decision | Options considered | Why this one | Risk / tradeoff | Source |
|---|---|---|---|---|
| 2.1 Remove the Media hero button | Remove; keep but change to a scroll cue; keep | A button to the same page is noise, and the gallery is already below the hero | The hero ends with no action, which is fine for a page that is itself the content | Ashley 2026-11-06; `content/media.ts:16` |
| 2.2 Show "Iowa, US" everywhere | Edit the string `contactInfo.location`; hard-code per place | One source already feeds the footer and card, so they cannot drift | It is client data shown publicly. ⚠ Mason has not confirmed "Iowa, US" (Los Angeles came from the mockup). Added to `docs/open-questions.md` as U4 for the next update to Mason | Ashley 2026-11-06; `content/site.ts:20` |
| 2.3 Fix the timeline column | Add `md:col-start-2` to the text when it belongs on the right; give the last two entries placeholder images | The column start fixes the cause for any entry without an image, with no fake content | None | `Timeline.tsx:45` |

**TDD plan**
- **2.2:** change `Footer.test.tsx:79` to expect "Iowa, US" first (red), then edit `content/site.ts`. Add the same check to the Contact page test.
- **2.1:** `app/media/page.test.tsx` asserts there is no "Explore the gallery" link. Delete `mediaContent.cta`.
- **2.3:** a Playwright check in `e2e/about.spec.ts` at desktop width: entry 06's heading sits to the right of the timeline line, like entry 02 and 04. It must fail before the fix. jsdom cannot measure layout, so this one is e2e only.

## 3. Options for Ashley to choose

Each block has a recommendation. Tick one option per block. ⚠ Visual judgments are unsourced by nature; the recommendations rest on `PRODUCT.md` principles 1 and 2 (the work leads; contact is always in reach).

### 3.1 Navbar

| Option | What it is | Why you might pick it | Risk / tradeoff |
|---|---|---|---|
| A. Contact pill | `MF` left; About and Media as text links; **Contact as a filled pill** on the right. Same as today otherwise | The contact path is always visible on every page (principle 2). Cheap | The CTA banner duplicates it; keep both |
| **B. Sticky + pill (recommended)** | A plus a header that stays on scroll, transparent over the hero and solid dark with a soft blur once the page scrolls | Nav stays reachable on long pages. The hero already slides under the header (`--header-height`, `globals.css:8`) | Needs care so the hero overlap and the mobile menu still work; needs e2e checks on both widths |
| C. Split nav | `About  Media` · `MF` centred · `Contact` | Distinct look, logo gets presence | Awkward on mobile; more change than the rest of the site |

**Decided 2026-11-06 (Ashley): keep the navbar as it is, with no Contact pill.** She saw three live variants of option B (quiet bar with a round pill, compact-on-scroll with a glow line, brand-tinted bar with a light pill) and discarded all three, saying the pill should be left out. Nothing was built; `Header.tsx` is unchanged. Sticky-on-scroll was not chosen either. The mobile menu note below is therefore not applied.

Mobile menu (all options): replace the plain dropdown (`MobileMenu.tsx:47`) with a full-width panel, larger type, and Contact as the pill at the bottom.

```text
A / B (desktop)
 MF                          About    Media    [ Contact ]
```

### 3.2 Buttons

**Where buttons are today, and a verdict on each**

| Button | Where | Goes to | Verdict (proposed) |
|---|---|---|---|
| View work | Home hero | `/media` | Keep as hero secondary |
| View resume | Home hero, About hero, Contact card | dialog | Keep; make it the hero **primary** (casting directors, the main user, want the resume fast) ⚠ |
| Explore the gallery | Media hero | same page | **Remove** (2.1) |
| View More (link) | Home, Recent Work | `/media` | Keep as a text link, not a button |
| Get in touch | CTA banner on Home, About, Media, Resume | `/contact` | Keep: end-of-page conversion |
| Designer ↗ card | About hero | `/media` | **Ask** (F8): remove the link or say why it is there |
| Download PDF / Open in new tab | Resume page and dialog | file | Keep |
| Send message | Contact form | submit | Restyle with the new primary |
| Back home | 404 | `/` | Keep |

**Rule to adopt:** one primary button per view; no button that leads to the page you are on or to the same place as its neighbour.

| Option | Look | Risk / tradeoff |
|---|---|---|
| **A. Solid primary + outline secondary (recommended)** | Primary: filled `brand-600` with white text (calculated 2026-11-06 with the WCAG formula: 5.57:1 for white, 5.11:1 for `neutral-100`; AA needs 4.5:1 for small text). Secondary: the existing outline. Tertiary: text link with an arrow | Clear hierarchy, small change, fits the locked palette |
| B. Pill with icon disc | Rounded pill, arrow inside a small circle that slides on hover | More distinctive; the circle is extra detail to keep consistent |
| C. Outline only, gradient fill on hover | Keep the outline; hover fills with a brand gradient | Least change; hierarchy stays weak, since everything still looks equal |

Also: drop the ↗ arrow on buttons that do not leave the page; use it only for external or new-tab links (⚠ judgment).

**Chosen 2026-11-06: option A**, picked by Ashley after seeing A, B and C live on the Home hero (`impeccable generate`). Built test-first in commit `48d82c6`: `Button` has a `primary` variant, `ResumeDialog` takes a `variant`, and the Home hero leads with View resume (primary) then View work (outline). **Done on every page (Ashley's answers, 2026-11-06):**

| View | Primary | Commit |
|---|---|---|
| Home hero | View resume (View work is the outline secondary) | `48d82c6` |
| About hero | View resume | `b689829` |
| Contact page | Send message; the form button now uses `buttonClasses("primary")` and shows a spinner while sending (`LoaderCircle`, `motion-safe:animate-spin`, `aria-hidden`). The card's View resume stays outline | `36a5d4a` |
| Resume page | Download PDF (Open in new tab stays outline) | `446d1ac` |

**↗ arrow rule (decided):** the arrow means "opens a new tab". `Button` shows it only for `newTab` links (`iconName = icon ?? (newTab ? "arrow" : undefined)`); `download` keeps its download icon; links within the site have no icon. The About "Designer" card and Home "View More" lost their arrows too. The Contact card's social links keep theirs (external, and hidden while Mason links no profiles, D-30).

**F8 (Designer card): keep it exactly as it is**, no copy change. The About mockup is the copy source of truth; if Ashley wants the reason spelled out, that is a client question for `docs/open-questions.md`.

Not changed on purpose: the Download button inside the resume dialog stays as it is (the dialog is its own surface; "one primary per view" is applied at page level). The CTA banner "Get in touch" keeps the `light` variant on purple. Not checked by eye yet: hover and focus states, the spinner, and the 390 px layout.

### 3.3 Homepage

| Block | Option | Notes |
|---|---|---|
| Section rhythm | **A. Alternate light and dark (recommended):** Model Shots light, Journey dark with the glow, Expertise light, Recent Work dark | Breaks the long light band; uses only existing tokens; `docs/design-system.md:9` allows both. Check AA on each swap |
| | B. Keep the light band | No change |
| Hero | **A. Resume primary, work secondary, roles line a little larger, scroll cue (recommended)** | Small, uses 3.2 |
| | B. Larger name with a spotlight glow behind the portrait | More dramatic. Do not alter the portrait itself: only non-AI flips and crops (`PRODUCT.md`, C15) |
| Model Shots | **A. Keep the carousel; add swipe (scroll-snap) and larger thumbnails (recommended)** | Closes the backlog item "Swipe on the Model Shots carousel" (`docs/roadmap.md`) |
| | B. Full-width filmstrip | Bigger change; needs its own accessibility check |

`docs/open-questions.md` C23 fixed the order (Model Shots right after the hero). Nothing here changes it.

### 3.4 Contact card

| Option | Hierarchy (top to bottom) | Risk / tradeoff |
|---|---|---|
| **A. Email first (recommended)** | "Contact info" tag, the email as the largest line (a link), `Iowa, US` as a plain muted line (no icon row), the resume button, then the quote | Matches why people visit; the name shrinks. Phone stays hidden (D-35) |
| B. Business card | Name large, role line ("Actor · Musician · Singer · Designer"), then email and `Iowa, US`, then the button | Looks polished; the email is still not the star |

The card's button follows whichever style is chosen in 3.2. The footer uses the same `Iowa, US` string.

### 3.5 Footer

Same location string (2.2). Optional: add the role line under the logo and give the Contact column the same email-first treatment as 3.4, so the card and footer read as one system. Choose when 3.4 is chosen.

## 4. Suggested build order

1. 2.1, 2.2, 2.3 (small, agreed, TDD, one commit each).
2. 3.2 buttons (everything else uses them), then 3.1 navbar, 3.4 card and footer, then 3.3 homepage.
3. For each block, **draft the options in the browser first.** `impeccable` has a `generate` command that shows variants of one element in the live browser, so Ashley can pick by looking (`.claude/skills/impeccable/SKILL.md`, Commands table). Use it for 3.1, 3.2 and 3.4.
4. After each: unit tests, `npm run build`, `CI=1 npx playwright test`, `impeccable detect`, and before/after screenshots for Mason. Capture full pages with reduced-motion emulation (the scroll reveal hides unscrolled sections).

## 5. Questions

- **Mason:** is "Iowa, US" what he wants shown? (⚠ client data; U4)
- ~~**Ashley:** what is the About "Designer ↗" card for (F8)?~~ Answered 2026-11-06: keep it as it is.
- **Ashley:** which option in each of 3.1, 3.3, 3.4 and 3.5? (3.2 buttons is done.)
