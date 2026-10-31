# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. Update it at the end of each session.

GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-10-31

## Where things stand
- **Phase 9 (10/29 meeting fixes): done.** PR #15 merged 2026-10-31; closed #8–#14 (email, no social links, real videos, Model Shots order, real resume, Resend key in Vercel).
- **Contact form via Resend: next.** Tickets #16 → #17 → (#18, #19 in parallel) → #20 (`needs-human`). Start with #16. Blocking links are set on GitHub.
- **Phase 10 redesign (D-33): not started.** Needs designs before a spec.
- **Launch on `*.vercel.app`:** not done (roadmap Phase 8). The milestone dates in the roadmap are stale.

## Open decisions (don't guess, ask Ashley)
- I5: should portrait videos (Shorts) count for Other Work? (`docs/open-questions.md`)
- U1: show Mason the redesign before/after.

## Gotchas
- Windows. Bash and PowerShell both work. Python writes CRLF unless you open files with `newline=""`.
- Agent worktrees under `.claude/worktrees/` get picked up by Vitest and ESLint: remove them when done. A fresh checkout or worktree needs `npm ci`.
- e2e: `CI=1 npx playwright test` (builds and serves; uses installed Chrome, D-15).
- Public repo: only Mason's resume PDF and reel thumbnails show his phone number (D-35). Never put it in code, tests, docs, issues or commits. Never commit `.env.local`.
- Tickets use labels `ready-for-agent` / `needs-human`; PRs close issues with `Closes #N`.

## Suggested skills
- `mattpocock-skills:implement-spec` or `mattpocock-skills:tdd` to build #16–#19
- `mattpocock-skills:code-review` before marking a PR ready
- `architect` if a ticket hits an unmade decision · `impeccable` for Phase 10
- `verification-before-completion` before claiming done

## Progress log (newest first: add one line per session at the top)
- 2026-10-31: Phase 9 shipped (PR #15). Handoff moved into the repo (this file). Added Vocal/Dance/Acting reels, renamed Reel 2 0 to "Intro Video", published the real resume (D-35), re-audited decision statuses, created Resend tickets #16–#20.
