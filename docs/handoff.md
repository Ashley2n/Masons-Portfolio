# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. Update it at the end of each session.

GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-06

## Where things stand
- **Phase 9 (10/29 meeting fixes): done.** PR #15 merged 2026-10-31.
- **Contact form via Resend: shipped to `main` 2026-11-06.** PRs #22 to #25 merged in order (closed #16 to #19); the real form sends through Resend with a branded HTML + plain-text email and a honeypot + minimum-time spam check (D-36, D-37 record every choice). **#20 live check done by Ashley and closed** on the PR #25 preview; it first failed because `RESEND_API_KEY` was Production-only in Vercel, now Preview too. The Resend dashboard is Mason's account, so Ashley can't see it. **PR #26** (docs for #20) is open and also edits this file, so expect a merge conflict here.
  - **Review verdicts to keep:** the email test's hand-written neutral hex list is deliberate (an independent source; deriving it from `EMAIL_COLORS` would be tautological), as are the two tag-based assertions (`script, img, b` and `br`). The honeypot test uses `querySelector` because the field is `aria-hidden`. `startedAt` starts at `0` until the mount effect runs, which can't matter because the submit handler only exists after hydration. Not run by anyone: axe on the `aria-hidden` honeypot wrapper.
  - **Email copy is a placeholder (U2)** until Mason weighs in.
- **Phase 10 redesign, round 1: PR #27 open on `feat/redesign`, not merged** (D-33, D-38; its Vercel preview is the "after" for Mason, **nothing ships until he has seen before/after, U1**). Ashley chose a fresh look on every page inside the locked system (palette, fonts, copy stay), "editorial cinematic". Done: photo-card expertise tiles (not links), larger headings, Journey stats beside the heading, dark AA CTA banner, button arrow nudge, CSS scroll reveal (off for reduced motion and print, `e2e/motion.spec.ts`), larger About timeline and hero tagline, a poster when a YouTube thumbnail 404s, and the small labels above headings removed. Ashley kept the Journey stats, the About stock photos and the reel thumbnails. Clean on 2026-11-06: unit tests (332), build, full e2e (79 passed, 1 skipped), Impeccable detector. Before screenshots: `.playwright-mcp/before-*.png` (local, gitignored).
- **Round 2: spec written, no code yet.** `docs/specs/2026-11-06-site-refresh-round-2.md` (D-39, Proposed) holds Ashley's notes from 2026-11-06 plus an audit:
  - **Agreed, no decision needed (do first, TDD, one commit each):** remove the Media hero "Explore the gallery" button (same page); change the location to "Iowa, US" in the one source `content/site.ts:20` (feeds footer and Contact card); fix the About timeline's last entry sitting in the wrong column (`Timeline.tsx:45`, add `md:col-start-2` when it has no image; e2e test).
  - **Ashley must choose options first** (each block has a recommendation): navbar (3.1), buttons (3.2, redesign), homepage rhythm/hero/Model Shots (3.3), Contact card hierarchy (3.4), footer (3.5). Show options in the browser with `impeccable generate`, one question at a time.
  - **Also open:** what the About hero "Designer" card is for (F8). Confirm with Mason that "Iowa, US" is what he wants shown. Ashley should check that the Singer card photo (`concerts-07`) and the Vocal Reel thumbnail variants show Mason (photos were picked by alt text; the alternative thumbnails are `.playwright-mcp/vocal-reel-thumbnail-A.jpg` and `-B.jpg`, local).
- **Launch on `*.vercel.app`:** not done (roadmap Phase 8). The milestone dates in the roadmap are stale; re-plan once round 1 and 2 are settled.

## Open decisions (don't guess, ask Ashley)
- Round 2 option choices (spec section 3, I7) and F8 (About "Designer" card).
- U1: show Mason the refresh before/after. U2: contact email wording (placeholder). I5: should portrait videos (Shorts) count for Other Work? (`docs/open-questions.md`)
- Mason: is "Iowa, US" right to show publicly? (Ashley's call 2026-11-06; Los Angeles came from the mockup.)

## How Ashley wants the work done (2026-10-31, updated 2026-11-06)
- Use `mattpocock-skills:tdd` before and during each change. Agree the **list of test seams** with Ashley before writing a test (one line each on what it catches and misses), after agreeing the design; one question at a time with a recommendation.
- Red → green → refactor each cycle (project rule D-13 wins over the TDD skill's "no refactor in the loop"; Ashley chose this).
- After each ticket: `mattpocock-skills:code-review` (Standards + Spec sub-agents), verify findings before fixing (a "violation" can be wrong), then commit with `Closes #N`.
- For design work, give Ashley **options or drafts to choose from**, and check the rendered result at 1280 and 390 px, not just the code.
- Ask before pushing, opening PRs or merging.

## Gotchas
- Windows. Bash and PowerShell both work. Python writes CRLF unless you open files with `newline=""`.
- Agent worktrees under `.claude/worktrees/` get picked up by Vitest and ESLint: remove them when done. A fresh checkout or worktree needs `npm ci`.
- e2e: `CI=1 npx playwright test` (builds and serves; uses installed Chrome, D-15). Specs must import `test`/`expect` from `e2e/fixtures.ts` (ESLint enforces it): its auto fixture aborts the contact server action so no e2e test can email Mason. On 2026-11-06 the dev server was stopped before running it (a precaution; not tested whether that is needed).
- `.env.local` holds the **real** `RESEND_API_KEY`, and local e2e reuses a running `npm run dev`. Never submit a valid form outside the fixture or against the real action. Never print the key.
- Vitest aliases `server-only` to its no-op (`vitest.config.mts`); Next's build still enforces it.
- Git Bash rewrites `/c` to `C:/` in arguments (e.g. `cmd /c`); run those from PowerShell.
- Playwright MCP (`@playwright/mcp@0.0.83`, Chrome) blocks `file:` URLs and only saves files inside the repo in `.playwright-mcp/`, now **gitignored** (commit `9870d92` on `feat/redesign`). A first screenshot can predate Tailwind's rebuild on the dev server: wait, then reshoot.
- **Scroll reveal and screenshots:** the `.reveal` blocks sit hidden until scrolled into view, so a full-page screenshot without scrolling shows blank sections. Capture with `page.emulateMedia({ reducedMotion: "reduce" })` (that is how the "after" images were taken). Lazy images also stay unloaded in unscrolled captures.
- `next dev` writes an untracked `AGENTS.md` in the repo root ("Generated AGENTS.md for AI agents"). Don't commit it. Specs live in `docs/specs/` (created 2026-11-06; the repo had none); this file is the pointer to them, because that `AGENTS.md` is generated.
- Public repo: only Mason's resume PDF and reel thumbnails show his phone number (D-35). Never put it in code, tests, docs, issues or commits. Never commit `.env.local`.
- Tickets use labels `ready-for-agent` / `needs-human`; PRs close issues with `Closes #N`.

## Suggested skills
- `impeccable` for round 2 (`generate` to show options in the browser, `critique`/`polish` after; run `impeccable context` once per session; the Windows launcher is `.claude/skills/impeccable/scripts/impeccable.cmd`; run `detect` on the changed UI files once at the end)
- `mattpocock-skills:tdd` for any new behavior · `verification-before-completion` before committing and before claiming done
- `mattpocock-skills:code-review` (Standards + Spec) before marking a PR ready · `architect` if a ticket hits an unmade decision
- `dev-workflow:review-me` or `dev-workflow:teach-back` if Ashley wants to practice reviewing or explaining the contact form work before it goes to her lead

## Progress log (newest first: add one line per session at the top)
- 2026-11-06: Audited round 2 and wrote `docs/specs/2026-11-06-site-refresh-round-2.md` (D-39 Proposed): three agreed fixes plus options for navbar, buttons, homepage, Contact card, footer. Rewrote this handoff for a fresh session. No code changes. Not pushed.
- 2026-11-06: #20 live check done by Ashley on the PR #25 preview (fixed Preview env var); PRs #22 to #25 merged to `main`. Updated handoff, roadmap and open-questions. #20 closed on GitHub.
- 2026-11-06: Started the Phase 10 refresh on `feat/redesign` (D-38): expertise photo cards, headings, Journey, CTA banner, scroll reveal, timeline, video poster fallback. All checks clean. Pushed as PR #27 (not merged); waiting on Mason's before/after (U1).
- 2026-11-06: Pushed #16 to #19 and opened stacked PRs #22 to #25 after Ashley said yes. Nothing merged. Next: #20 by hand, then merges in order.
- 2026-11-06: Two-axis code review of #19 (no blocking findings), reran lint, typecheck and 328 tests (pass), committed #19 locally (`Closes #19`). Not pushed. Next: #20 by hand.
- 2026-11-06: Refreshed this handoff so a new session can pick up #19 at the code review. No code changes.
- 2026-11-05: Built #19 (honeypot + minimum-time check, pure `isSpamSubmission`, hidden `website` field, `startedAt`) TDD on `feat/19-contact-spam-protection` after Ashley agreed six seams; D-37 added. Left uncommitted, code review next.
- 2026-11-05: Ashley approved the #18 email preview; reran lint, typecheck and 310 tests (all pass) and committed #18 locally (`Closes #18`). Not pushed. Next: #19 seams.
- 2026-10-31: Built #18 (branded HTML + text email, escaping, `<br>` line breaks, token-drift test) TDD on `feat/18-branded-email` after Ashley agreed four seams; two-axis review fixes applied (D-36 amended, U2 added, renames); manual PNG taken. Left uncommitted, waiting on Ashley's screenshot OK.
- 2026-10-31: Built #16 (send hook takes values, awaits `{ ok }`) and #17 (Resend server action with server-side hardening, sending/sent/failed states, e2e email guard), both TDD + two-axis review, committed locally on stacked branches (not pushed). Added D-36. Installed Playwright MCP. #18 seams proposed, awaiting Ashley.
- 2026-10-31: Phase 9 shipped (PR #15). Handoff moved into the repo (this file). Added Vocal/Dance/Acting reels, renamed Reel 2 0 to "Intro Video", published the real resume (D-35), re-audited decision statuses, created Resend tickets #16–#20.
