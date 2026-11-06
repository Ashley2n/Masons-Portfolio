# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. Update it at the end of each session.

GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-06

## Where things stand
- **Phase 9 (10/29 meeting fixes): done.** PR #15 merged 2026-10-31; closed #8–#14 (email, no social links, real videos, Model Shots order, real resume, Resend key in Vercel).
- **Contact form via Resend: in progress.** #16 and #17 are done and committed **locally, not pushed, no PR yet** (ask Ashley before pushing or opening PRs). Stacked branches: `refactor/16-contact-send-hook` (`d4ed514`) → `feat/17-resend-contact` (`3b8b6f1`, contains both) → `feat/18-branded-email` (`8b12fea`) → `feat/19-contact-spam-protection` (working tree). Merge or retarget in that order, or a PR for a later ticket also shows the earlier ones. The real form now sends through Resend (D-36 records every choice).
- **#18 branded email: done and committed locally (`8b12fea`), not pushed, no PR yet** on `feat/18-branded-email` (stacked on `feat/17-resend-contact`). Ashley approved the email preview 2026-11-05; lint, typecheck and all 310 tests passed the same day. Don't push or open a PR without asking.
  - **Choices are in D-36** (the "Branded email" line, `docs/decisions.md`): extend `buildContactEmail` to `{ subject, text, html }`, token-drift test in `lib/contact.test.ts`, the send test only checks `html` is sent, manual screenshot instead of a visual test. Email copy is a placeholder (U2).
  - **Review verdicts to keep:** the test's hand-written neutral hex list is deliberate (an independent source; deriving it from `EMAIL_COLORS` would make the test tautological). The two tag-based assertions (`script, img, b` and `br`) are deliberate and commented.
- **#19 spam protection: done and committed locally** on `feat/19-contact-spam-protection` (branched from `feat/18-branded-email`), `Closes #19`, **not pushed, no PR yet**. Seams and every choice agreed with Ashley 2026-11-05 and recorded in D-37. Lint, typecheck and 328 unit tests passed 2026-11-06; the contact e2e spec (8) passed 2026-11-05. Don't push or open a PR without asking.
  - **Code review (2026-11-06, Standards + Spec): no blocking findings.** Kept on purpose: the honeypot test uses `querySelector` because the field is `aria-hidden` (no role query can reach it); `startedAt` starts at `0` until the mount effect runs, which can't matter because the submit handler only exists after hydration. Optional tidy-ups left alone: `MIN_FILL_MS` is exported but unused elsewhere; `isSpamSubmission` narrows `startedAt` through `||` short-circuiting.
  - **Not run by anyone:** axe on the `aria-hidden` wrapper around the focusable honeypot (`tabIndex={-1}` should keep `aria-hidden-focus` quiet). The existing a11y tests pass.
  - **The PR should say** per-IP rate limiting is out of scope per #19's text (worst case is flooding Mason's own inbox, because the onboarding sender can only deliver to him).
  - **Check by hand in #20:** Chrome autofill leaves the hidden `website` field empty (D-37 consequences).
- **Next: #20** (`needs-human`) after #19 is committed.
  - **#20:** Ashley sends a few real messages labelled "Test by Ashley" by hand (agreed 2026-10-31). No automated test may send email.
- **Phase 10 redesign (D-33): not started.** Needs designs before a spec.
- **Launch on `*.vercel.app`:** not done (roadmap Phase 8). The milestone dates in the roadmap are stale.

## Open decisions (don't guess, ask Ashley)
- U2: contact email wording (placeholder copy until Mason weighs in).
- I5: should portrait videos (Shorts) count for Other Work? (`docs/open-questions.md`)
- U1: show Mason the redesign before/after.

## How Ashley wants the work done (2026-10-31)
- Use `mattpocock-skills:tdd` before and during each ticket (`mattpocock-skills:implement` and `implement-spec` are not in the installed skill list as of 2026-11-05). Agree the **list of test seams** with Ashley before writing a test (one line each on what it catches and misses), after agreeing the design; one question at a time with a recommendation. #19 went design questions first, then seams, then tests, and she approved it.
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
- `mattpocock-skills:code-review` now, on #19 (Standards + Spec sub-agents), then again before marking a PR ready
- `verification-before-completion` before committing #19 and before claiming done
- `dev-workflow:review-me` or `dev-workflow:teach-back` if Ashley wants to practice reviewing or explaining #19 before it goes to her lead
- `mattpocock-skills:tdd` for any new behavior · `architect` if a ticket hits an unmade decision · `impeccable` for Phase 10

## Progress log (newest first: add one line per session at the top)
- 2026-11-06: Two-axis code review of #19 (no blocking findings), reran lint, typecheck and 328 tests (pass), committed #19 locally (`Closes #19`). Not pushed. Next: #20 by hand.
- 2026-11-06: Refreshed this handoff so a new session can pick up #19 at the code review. No code changes.
- 2026-11-05: Built #19 (honeypot + minimum-time check, pure `isSpamSubmission`, hidden `website` field, `startedAt`) TDD on `feat/19-contact-spam-protection` after Ashley agreed six seams; D-37 added. Left uncommitted, code review next.
- 2026-11-05: Ashley approved the #18 email preview; reran lint, typecheck and 310 tests (all pass) and committed #18 locally (`Closes #18`). Not pushed. Next: #19 seams.
- 2026-10-31: Built #18 (branded HTML + text email, escaping, `<br>` line breaks, token-drift test) TDD on `feat/18-branded-email` after Ashley agreed four seams; two-axis review fixes applied (D-36 amended, U2 added, renames); manual PNG taken. Left uncommitted, waiting on Ashley's screenshot OK.
- 2026-10-31: Built #16 (send hook takes values, awaits `{ ok }`) and #17 (Resend server action with server-side hardening, sending/sent/failed states, e2e email guard), both TDD + two-axis review, committed locally on stacked branches (not pushed). Added D-36. Installed Playwright MCP. #18 seams proposed, awaiting Ashley.
- 2026-10-31: Phase 9 shipped (PR #15). Handoff moved into the repo (this file). Added Vocal/Dance/Acting reels, renamed Reel 2 0 to "Intro Video", published the real resume (D-35), re-audited decision statuses, created Resend tickets #16–#20.
