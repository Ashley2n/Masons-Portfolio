# Review, feat/button-states-polish, 2026-10-27

**Reviewed by**: Sonnet 5.5 (author on Opus 5.5 per commit trailers)
**Scope**: 24 files (2 docs-only critique snapshots), branch vs main
**Verdict**: Approve with nits

## Summary
Consolidates focus styling into one base-layer `:focus-visible` rule with a surface-driven `--focus-ring` colour, raises mobile tap targets to 44px, shows a visible resume label (D-29), and gates scale/translate motion behind `motion-safe:`. The approach is sound and the cascade is correct (base rule, utilities still override). Main gaps: one unrecorded look change and a few tap targets/ring edge cases the design-system rules imply but the diff does not cover.

## Minor
### 🟡 Unrecorded hover colour change on the light Button, `components/ui/Button.tsx:10`
**Problem**: `light` hover changed from `hover:bg-white` to `hover:bg-brand-200`. It is not mentioned in D-29, the design-system doc, or the branch purpose, and it sits in the "focus ring" commit (8a6e124).
**Why it matters**: D-10 locks the client-approved look; look changes should be recorded or sent to the client as a question. It also hides a visual change inside an unrelated commit.
**Suggested fix**: Either add a line to D-29/design-system explaining it (and confirm it is a hover-state fix, not a restyle), or revert and raise it in `docs/open-questions.md`.

### 🟡 Gallery filter tabs and "Load more" not brought to 44px, `components/sections/media/Gallery.tsx:48-60,112`
**Problem**: Branch goal (2) is mobile targets of at least 44px, but the filter tabs (about 30px tall, adjacent so `.touch-target` would overlap) and the Load more button were only touched for focus classes.
**Why it matters**: Same touch-target gap the critique flagged remains on the Media page. Adjacent tabs need real padding (as the design-system note says), not `::after`.
**Suggested fix**: Add real vertical padding (`py-` / `min-h-11`) to the tabs on mobile and `.touch-target` or min-height to Load more, or record the Media page as deliberately deferred.

### 🟡 Form fields gain a 2px outline offset, `components/sections/contact/ContactForm.tsx:22`
**Problem**: The field class sets `outline-2 outline-brand-500/40` but not `outline-offset-0`; the new base rule now supplies `outline-offset: 2px`, so the soft ring detaches from the border. design-system.md says fields "keep their own border + soft ring".
**Why it matters**: Subtle visual regression on the Contact form; contradicts the doc line added in this branch.
**Suggested fix**: Add `focus-visible:outline-offset-0` to the field class, and check visually.

## Nits
- ⚪ `docs/decisions.md:125`, D-16's Decision text still says "icon-only"; only the Status line points to D-29. Consider a short "(see D-29)" in the Decision sentence.
- ⚪ `components/sections/home/ModelShotsCarousel.tsx:11`, `surface-color` sits mid-string after `hover:` utilities; group it with the other base classes for readability.
- ⚪ `components/layout/Header.tsx:14`, `min-w-11` on the MF link is harmless but unneeded (the text is already wider).

## Strengths
- Focus ring defined once in `@layer base` with a CSS-variable colour per surface, removing about 15 duplicated per-component ring classes; utilities (`outline-offset-0/4`) still win as intended, and the carousel arrows correctly use offset 0 to avoid clipping in `overflow-hidden`.
- Honest use of `.touch-target` only where there is room (mobile menu pitch is 52px so the 44px areas do not overlap; footer uses real padding instead), exactly as the design-system note states.
- `buttonClasses()` removes style drift between ResumeDialog and Button; the test now asserts the visible text is the accessible name and no `aria-label`/`title` (WCAG 2.5.3). Carousel images keep `key={current.id}`, so the fade actually replays.
- Reduced-motion handled with `motion-safe:` on all scale/translate hovers and an opacity-only fade token.

## Test coverage
Test signal is configured. The one behaviour change (resume trigger name/label) has its test updated first and it matches D-29; existing e2e `getByRole("button", { name: "View resume" })` still resolves. The rest is class-only visual work, which `docs/architecture.md#testing--tdd` says not to unit-test, so no missing-test findings. Visual checks of the focus colours on each surface, the form-field ring, and 412px hero button fit are still manual.
