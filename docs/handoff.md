# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. Update it at the end of each session.

GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-05

## Where things stand
- **Phase 9 (10/29 meeting fixes): done.** PR #15 merged 2026-10-31; closed #8–#14 (email, no social links, real videos, Model Shots order, real resume, Resend key in Vercel).
- **Contact form via Resend: in progress.** #16 and #17 are done and committed **locally, not pushed, no PR yet** (ask Ashley before pushing or opening PRs). Stacked branches: `refactor/16-contact-send-hook` (`d4ed514`) → `feat/17-resend-contact` (`3b8b6f1`, contains both). The real form now sends through Resend (D-36 records every choice).
- **#18 branded email: done and committed locally, not pushed, no PR yet** on `feat/18-branded-email` (stacked on `feat/17-resend-contact`). Ashley approved the email preview 2026-11-05; lint, typecheck and all 310 tests passed the same day. Don't push or open a PR without asking.
  - **Choices are in D-36** (the "Branded email" line, `docs/decisions.md`): extend `buildContactEmail` to `{ subject, text, html }`, token-drift test in `lib/contact.test.ts`, the send test only checks `html` is sent, manual screenshot instead of a visual test. Email copy is a placeholder (U2).
  - **Review verdicts to keep:** the test's hand-written neutral hex list is deliberate (an independent source; deriving it from `EMAIL_COLORS` would make the test tautological). The two tag-based assertions (`script, img, b` and `br`) are deliberate and commented.
- **Next: #19** (branch from `feat/18-branded-email`; it also touches `lib/send-contact-message.ts`), then #20 (`needs-human`).
  - **#19:** agree seams first. The automated security review flagged "no abuse controls" on `sendContact`: the honeypot + min-time check is #19; per-IP rate limiting stays out of scope per #19's text (worst case is flooding Mason's own inbox, because the onboarding sender can only deliver to him). Say so in the PR.
  - **#20:** Ashley sends a few real messages labelled "Test by Ashley" by hand (agreed 2026-10-31). No automated test may send email.
- **Phase 10 redesign (D-33): not started.** Needs designs before a spec.
- **Launch on `*.vercel.app`:** not done (roadmap Phase 8). The milestone dates in the roadmap are stale.

## Open decisions (don't guess, ask Ashley)
- U2: contact email wording (placeholder copy until Mason weighs in).
- I5: should portrait videos (Shorts) count for Other Work? (`docs/open-questions.md`)
- U1: show Mason the redesign before/after.

## How Ashley wants the work done (2026-10-31)
- Use `mattpocock-skills:tdd` before and during each ticket, and `mattpocock-skills:implement` per ticket (`implement-spec` isn't installed). Agree test seams with Ashley before writing a test; one question at a time with a recommendation.
- Red → green → refactor each cycle (project rule D-13 wins over the TDD skill's "no refactor in the loop"; Ashley chose this).
- After each ticket: `mattpocock-skills:code-review` (Standards + Spec sub-agents), verify findings before fixing (a "violation" can be wrong), then commit with `Closes #N`.

## Gotchas
- Windows. Bash and PowerShell both work. Python writes CRLF unless you open files with `newline=""`.
- Agent worktrees under `.claude/worktrees/` get picked up by Vitest and ESLint: remove them when done. A fresh checkout or worktree needs `npm ci`.
- e2e: `CI=1 npx playwright test` (builds and serves; uses installed Chrome, D-15). Specs must import `test`/`expect` from `e2e/fixtures.ts` (ESLint enforces it): its auto fixture aborts the contact server action so no e2e test can email Mason.
- `.env.local` holds the **real** `RESEND_API_KEY`, and local e2e reuses a running `npm run dev`. Never submit a valid form outside the fixture or against the real action. Never print the key.
- Vitest aliases `server-only` to its no-op (`vitest.config.mts`); Next's build still enforces it.
- Git Bash rewrites `/c` to `C:/` in arguments (e.g. `cmd /c`); run those from PowerShell.
- Playwright MCP is installed at user scope (`@playwright/mcp@0.0.83`, Chrome), so new sessions can drive the browser with it. It blocks `file:` URLs (serve local HTML on `127.0.0.1`) and only saves files inside the repo, in `.playwright-mcp/`, which is **not gitignored**: move or delete it after use (or add it to `.gitignore` in a `chore:` commit).
- Public repo: only Mason's resume PDF and reel thumbnails show his phone number (D-35). Never put it in code, tests, docs, issues or commits. Never commit `.env.local`.
- Tickets use labels `ready-for-agent` / `needs-human`; PRs close issues with `Closes #N`.

## Suggested skills
- `mattpocock-skills:implement` + `mattpocock-skills:tdd` to build #19
- `mattpocock-skills:code-review` before marking a PR ready
- `architect` if a ticket hits an unmade decision · `impeccable` for Phase 10
- `verification-before-completion` before claiming done

## Progress log (newest first: add one line per session at the top)
- 2026-11-05: Ashley approved the #18 email preview; reran lint, typecheck and 310 tests (all pass) and committed #18 locally (`Closes #18`). Not pushed. Next: #19 seams.
- 2026-10-31: Built #18 (branded HTML + text email, escaping, `<br>` line breaks, token-drift test) TDD on `feat/18-branded-email` after Ashley agreed four seams; two-axis review fixes applied (D-36 amended, U2 added, renames); manual PNG taken. Left uncommitted, waiting on Ashley's screenshot OK.
- 2026-10-31: Built #16 (send hook takes values, awaits `{ ok }`) and #17 (Resend server action with server-side hardening, sending/sent/failed states, e2e email guard), both TDD + two-axis review, committed locally on stacked branches (not pushed). Added D-36. Installed Playwright MCP. #18 seams proposed, awaiting Ashley.
- 2026-10-31: Phase 9 shipped (PR #15). Handoff moved into the repo (this file). Added Vocal/Dance/Acting reels, renamed Reel 2 0 to "Intro Video", published the real resume (D-35), re-audited decision statuses, created Resend tickets #16–#20.
