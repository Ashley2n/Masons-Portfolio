# Review, chore/impeccable-setup, 2026-10-26

**Reviewed by**: Claude Sonnet (reviewer subagent; author on Opus)
**Scope**: 21 project files (plus 62 vendored Impeccable files, wiring only), branch vs main
**Verdict**: Approve with nits

## Summary
Installs Impeccable (D-27), then fixes WCAG AA contrast (eyebrows, placeholder, Contact card label), a heading-outline bug, a real missing-`<title>` bug on the home page, and an LCP loading hint. The changes are small, correct and recorded in D-27/D-28. The vendored-file wiring is sound. The remaining points are about client-approval boundaries and small consistency issues, none blocking.

## Minor
### 🟡 Contact photo swap is a visible change to the approved look, approved only by the developer, `content/contact.ts:37`, `docs/decisions.md` (D-28)
**Problem**: CLAUDE.md/D-10 say changes to the approved look go to Mason via `docs/open-questions.md`. D-28 records only Ashley's approval for the new photo and the taller mobile card. Contrast fixes (eyebrow colour, placeholder) are accessibility fixes within the system and fine. The photo is content/imagery, which the mockup specifies (dark sea stacks). The old photo was also a stock placeholder under D-11, so the risk is low.
**Why it matters**: If Mason has a view on the Contact imagery, it surfaces after launch rather than before.
**Suggested fix**: Add a one-line "FYI / confirm" item to the next-update table in `docs/open-questions.md` (as done for C19 to C21) so Mason sees the new photo, or note in D-28 why this is outside the D-10 lock.

### 🟡 `Eyebrow` tone change has no test and the Contact "Follow" eyebrow was not reviewed over the photo, `components/sections/contact/ContactCard.tsx:62`
**Problem**: The "Follow" eyebrow stays default `brand-500` and sits over the lower part of the photo, behind the opaque fade. D-28 measured only the "Contact info" label. Also, `Eyebrow` has a new behavioural prop (`tone`) and `SectionHeading` passes it through; the class mapping is visual, so no unit test is acceptable per the testing rule.
**Why it matters**: Probably passes (dark area, 7.3:1 on neutral-950), but it is unmeasured.
**Suggested fix**: Re-run the Impeccable detector on `/contact` at 390 and 1440 px and confirm "Follow" passes; mention in D-28.

### 🟡 Gallery eager hint re-applies to whatever photo is first after filtering, `components/sections/media/Gallery.tsx:94`
**Problem**: `index === 0` is relative to `shown`, so after a filter change the new first photo also gets `loading="eager"`/`fetchPriority="high"`. Harmless, but the first item may be a video card (then nothing is eager, correct).
**Why it matters**: Minor wasted high-priority fetch on filter change; the LCP benefit only applies to initial load.
**Suggested fix**: Acceptable as is; optionally only apply for the initial "All" view, or leave a comment saying the behaviour is intended.

## Nits
- ⚪ `components/sections/contact/ContactCard.tsx:18`, class order: `min-h-[50rem] md:min-h-[36rem]` listed before `flex-col`; fine functionally, but consider ordering mobile then `md:` variants together for consistency (no Prettier Tailwind plugin enforcement seen).
- ⚪ `docs/roadmap.md`, not touched in this diff: CLAUDE.md says to tick items off. The Lighthouse/a11y items may now be partly done and could be updated.
- ⚪ `components/sections/about/AboutHero.tsx:43`, the `<p className="text-h2 font-playfair font-semibold">` duplicates h2 styling by hand; if `text-h2` ever stops carrying family/weight, it will drift. Fine for now.

## Strengths
- Root-cause fix for the missing home `<title>`: omitting the key rather than passing `undefined`, with a unit regression test (`toHaveProperty` fails if the key returns) and an e2e test of the real rendered title.
- Eyebrow contrast is solved once at the component level via a typed `tone`, and `SectionHeading` forwards its tone, so all light-section callers (Journey, Expertise, Timeline, RecentWork) keep `brand-600` and dark ones get `brand-500`. `cn` uses an extended twMerge, so the `text-brand-200` override on ContactCard correctly wins.
- About feature card: the heading-outline bug has a behavioural test using roles, not classes.
- Vendored-install wiring is right: binary dir gitignored (verified with `git check-ignore`, nothing tracked under `scripts/bin/`), `.claude/**` ignored by ESLint, `*.cmd text eol=crlf`, no `settings.json` or hooks files tracked (only a `reference/hooks.md` doc), no vendored `.ts/.tsx` or test files for tsc/Vitest to pick up.
- Decisions are well sourced (D-27, D-28 with licence link and measurements); the CC0 photo credit is recorded in content.
- New photo uses a new filename to avoid Next image cache serving the old one; `next/image` usage with `fill` + `sizes` retained.

## Test coverage
Behavioural changes (SEO title, heading outline) are covered by unit and e2e tests; contrast, photo, min-height and eager-loading changes are visual/Next internals and correctly untested per `docs/architecture.md#testing--tdd`. Gap: no automated contrast check (only manual Impeccable measurements), acceptable for now.
