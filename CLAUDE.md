# CLAUDE.md

Portfolio site for client **Mason Farrington**, built by Ashley. Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4.

## Read first

- `docs/project-brief.md`: scope, pages, timeline (demo-ready Wed 2026-10-14, launch Fri 2026-10-16)
- `docs/roadmap.md`: current phase. Tick items off when you complete them.
- `docs/architecture.md`: folder structure and conventions (follow them)
- `docs/design-system.md`: tokens and type scale; the mockups are in `docs/Mockups/`
- `docs/decisions.md`: append a new entry when making a lasting technical or product decision
- `docs/open-questions.md`: add client questions here instead of guessing on product decisions

## TDD (required, see D-13)

- Red → green → refactor for every behavior change. Write the failing test first, run it, and confirm it fails for the right reason before writing implementation code.
- Bug fixes start with a test that reproduces the bug.
- Colocated `*.test.ts(x)`, Vitest + React Testing Library, user-centric queries (`getByRole`…). Playwright e2e for pages (from Phase 4).
- Commit the test and implementation together. Never use `--no-verify`.
- What to test and what not to test: `docs/architecture.md#testing--tdd`.

## Rules

- `app/` is for routes only. Components go in `components/`, copy and data in `content/`, helpers in `lib/`, and types in `types/`. Import with the `@/` alias.
- Use Server Components by default. Put `"use client"` only on the smallest interactive leaf.
- Use design tokens (`brand-*`, `neutral-*`, `font-playfair|inter|space`), not raw hex. The theme is dark-first and doesn't depend on OS color scheme.
- Use stable IDs or slugs for list keys (never `Math.random()` or array index).
- Use `next/image` with real dimensions or `fill` + `sizes`.
- Write semantic, accessible HTML: links for navigation, buttons for actions, no clickable `div`s.
- The homepage mockup is the copy source of truth. Colors and fonts in code are the design source of truth (D-10).
- Write mobile-first; there are no mobile mockups, so follow the responsive rules in `docs/design-system.md`.

## Workflow

- Work on a feature branch (`feat/…`, `fix/…`, `refactor/…`, `docs/…`, `chore/…`), never directly on `main`.
- Make small, focused Conventional Commits (`feat: …`, `fix: …`, `docs: …`).
- The pre-commit hook runs `npm run lint`, `npm run typecheck` and `npm test`. Run `npm run build` at the end of each phase (CI also runs it).
- The dev environment is Windows. Bash and PowerShell are both available.
