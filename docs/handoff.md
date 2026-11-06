# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. Update it at the end of each session.

GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-06

## Where things stand
- **Phase 9 (10/29 meeting fixes): done.** PR #15 merged 2026-10-31; closed #8–#14 (email, no social links, real videos, Model Shots order, real resume, Resend key in Vercel).
- **Contact form via Resend: shipped to `main` 2026-11-06.** PRs #22 to #25 merged in order (closed #16 to #19). The real form sends through Resend with a branded HTML + plain-text email and a honeypot + minimum-time spam check (D-36, D-37 record every choice).
  - **#20 live check: done by Ashley 2026-11-06** on the PR #25 preview: the real message sent and she reports everything checked out (not itemized; see I6 in `docs/open-questions.md`). The first try failed because `RESEND_API_KEY` was Production-only in Vercel; it now covers Preview too. The Resend dashboard is Mason's account, so Ashley can't see it.
  - **Review verdicts to keep:** the email test's hand-written neutral hex list is deliberate (an independent source; deriving it from `EMAIL_COLORS` would be tautological), as are the two tag-based assertions (`script, img, b` and `br`). The honeypot test uses `querySelector` because the field is `aria-hidden`. `startedAt` starts at `0` until the mount effect runs, which can't matter because the submit handler only exists after hydration. Optional tidy-ups left alone: `MIN_FILL_MS` is exported but unused elsewhere; `isSpamSubmission` narrows `startedAt` through `||` short-circuiting.
  - **Not run by anyone:** axe on the `aria-hidden` wrapper around the focusable honeypot (`tabIndex={-1}` should keep `aria-hidden-focus` quiet). The existing a11y tests pass.
  - **Email copy is a placeholder (U2)** until Mason weighs in. Per-IP rate limiting is out of scope per #19 (worst case is flooding Mason's own inbox, because the onboarding sender can only deliver to him).
- **Next:** close #20 (needs Ashley's OK), then launch on `*.vercel.app` (roadmap Phase 8), then the open decisions below. Ask Mason about U2 and the Resend dashboard in the next update.
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
- `mattpocock-skills:code-review` (Standards + Spec sub-agents) before marking a PR ready
- `verification-before-completion` before committing and before claiming done
- `dev-workflow:review-me` or `dev-workflow:teach-back` if Ashley wants to practice reviewing or explaining the contact form work (#16 to #19) before it goes to her lead
- `mattpocock-skills:tdd` for any new behavior · `architect` if a ticket hits an unmade decision · `impeccable` for Phase 10

## Progress log (newest first: add one line per session at the top)
- 2026-11-06: #20 live check done by Ashley on the PR #25 preview (fixed Preview env var); PRs #22 to #25 merged to `main`. Updated handoff, roadmap and open-questions. #20 still open on GitHub.
- 2026-11-06: Pushed #16 to #19 and opened stacked PRs #22 to #25 after Ashley said yes. Nothing merged. Next: #20 by hand, then merges in order.
- 2026-11-06: Two-axis code review of #19 (no blocking findings), reran lint, typecheck and 328 tests (pass), committed #19 locally (`Closes #19`). Not pushed. Next: #20 by hand.
- 2026-11-06: Refreshed this handoff so a new session can pick up #19 at the code review. No code changes.
- 2026-11-05: Built #19 (honeypot + minimum-time check, pure `isSpamSubmission`, hidden `website` field, `startedAt`) TDD on `feat/19-contact-spam-protection` after Ashley agreed six seams; D-37 added. Left uncommitted, code review next.
- 2026-11-05: Ashley approved the #18 email preview; reran lint, typecheck and 310 tests (all pass) and committed #18 locally (`Closes #18`). Not pushed. Next: #19 seams.
- 2026-10-31: Built #18 (branded HTML + text email, escaping, `<br>` line breaks, token-drift test) TDD on `feat/18-branded-email` after Ashley agreed four seams; two-axis review fixes applied (D-36 amended, U2 added, renames); manual PNG taken. Left uncommitted, waiting on Ashley's screenshot OK.
- 2026-10-31: Built #16 (send hook takes values, awaits `{ ok }`) and #17 (Resend server action with server-side hardening, sending/sent/failed states, e2e email guard), both TDD + two-axis review, committed locally on stacked branches (not pushed). Added D-36. Installed Playwright MCP. #18 seams proposed, awaiting Ashley.
- 2026-10-31: Phase 9 shipped (PR #15). Handoff moved into the repo (this file). Added Vocal/Dance/Acting reels, renamed Reel 2 0 to "Intro Video", published the real resume (D-35), re-audited decision statuses, created Resend tickets #16–#20.
