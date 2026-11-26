# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. At the end of a session, update the sections below and add one line to the progress log; when a section is finished, move it to `docs/archive/` instead of letting it pile up here.


GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-19 (PRs #42 and #43 are merged; docs tidy and reel thumbnails on `docs/reel-thumbnails-and-tidy`, not pushed)

## Where things stand
- **On `main` (`origin/main` at `a0b5f37`):** everything built so far: Phase 9 fixes (PR #15), the Resend contact form (PRs #22 to #25), the Phase 10 redesign (PR #27, 2026-11-06), motion pass 3 and round 3 (PR #42, merged 2026-11-15: D-44 to D-48, About timeline D-45) and Mason's 2026-11-15 feedback (PR #43, merged 2026-11-16, D-49: Intro Video removed, Acting Reel featured, our reel thumbnails removed, his photo on the Journey banner, new resume).
- **Branch `docs/reel-thumbnails-and-tidy`** (from `feat/motion-everywhere`, which is `origin/main` plus the local commit `f3db3be`): not pushed, no PR. It holds the reel thumbnail template for Mason (`docs/thumbnails/`, for his YouTube thumbnails, not used by the site), the 11 loose feedback images moved to `docs/feedback-images/` (outside `public/`: nothing in the app uses them, one is 31 MB), and this handoff with its merge-conflict markers removed. `f3db3be` ("Fix merge") had committed conflict markers into `docs/handoff.md` and `docs/feedback.md`.
- **Checks on the last full run (2026-11-15, before PR #43):** lint and typecheck clean, `CI=1` production e2e 337 passed, 7 skipped; Lighthouse (13.6.0) at or above 90 on every measured page (lowest: About and Media mobile 91). Unit tests on this branch: 367 passed (2026-11-19). Numbers in `docs/roadmap.md` Phase 8.
- **Waiting on Mason:** F9 (full-size Journey photo), F10 (his YouTube thumbnails; the template is ready to send), U5 (Acting Reel as the featured video), U1 (has not seen before/after) (`docs/open-questions.md`).
- **Not done:** launch on `*.vercel.app` (roadmap Phase 8; its milestone dates are stale and no new date is set), remove Instagram code (D-20; still in `content/site.ts` and `VideoCard.tsx`), "Get in touch" near the top on mobile (C26), D-42 slices 2 and 3 (form feedback, resume dialog; unbuilt), a stronger mobile-menu effect (needs a reference).
- **Where the history went:** see "More detail" at the bottom.

## Next session (start here): the open items, one at a time
**Prompt for the next session (copy it as the first message; open the terminal and editor at the `D:` path):**
```text
Continue Mason's portfolio (D:\01-Projects\Client-Projects\Masons-Portfolio). Open the terminal and editor at the D: path, never through the C:\Users\aa\Documents junction (the dev server breaks there; see docs/gotchas.md). Start with docs/handoff.md, especially "Next session (start here)" and "Open items", then follow CLAUDE.md. Read docs/gotchas.md too.

State: PRs #42 and #43 are merged into main. I am on docs/reel-thumbnails-and-tidy (docs only, not pushed, no PR). Start new code work on a new branch from origin/main, not from this one.

Goal for this session: go through the open items with me, one question at a time, with your recommended answer, every decision sourced or marked "unsourced". Do not start any of them before I answer. In this order, unless I say otherwise: (1) what to do with the docs branch (push and PR, or merge locally), and when Mason sees before/after (U1) and the thumbnail template (F10); (2) the flaky "exactly one view transition" test (e2e/page-transition.spec.ts:56, 2 startViewTransition calls for one click, about 4 of 60 runs; find the cause, it may be a real double crossfade); (3) what to ask Mason (Vocal Reel thumbnail 404, alt text that names him, the alt text of the four timeline photos, the phone crop of the Went All In collage, whether "Iowa, US" is right); (4) the roadmap leftovers: Vercel launch and a new date, Instagram removal (D-20), C26.

Rules: never push, open a PR, merge or close issues without asking me. Never commit without asking. Port 3000 must be free for CI=1 npx playwright test: check it and ask before stopping anything (stop only a process you started yourself, by its PID). Never put a phone number in code, tests, docs, issues or commits (D-35); look at every new image before it goes in the repo; keep screenshots in .playwright-mcp (gitignored). Update docs/handoff.md and add one line to its progress log at the end of the session.
```

## Open items (don't guess, ask Ashley)
- **YouTube thumbnails (D-52, built 2026-11-26):** full-size first, 1h image cache, no tint. Not checked against live YouTube from the cloud sandbox: ask Mason to confirm his new thumbnails show, and whether the old one still appears after a few hours.
- **The docs branch:** `docs/reel-thumbnails-and-tidy` is local only. Pushing, a PR and merging are Ashley's call. So are showing Mason before/after (U1) and sending him the thumbnail template (F10). Issue #36 ("Final checks and Lighthouse gate") is still open; closing it is hers.
- **About mobile Lighthouse:** 88 to 91 between runs, observed LCP 254ms (details in `docs/archive/2026-11-timeline-and-round-3.md`). Recommendation: accept; Ashley decides. ⚠ the simulated-vs-observed reading is mine, not from a Lighthouse doc.
- **Flaky view-transition test (not caused by round 3):** `e2e/page-transition.spec.ts:56` "choosing About in the menu starts exactly one view transition" sees 2 `startViewTransition` calls: 4 of 60 at `HEAD`, 6 of 60 with round 3 (`docs/gotchas.md`). Cause not investigated; the assertion was left strict on purpose. It is probably the unidentified flaky in the first full run of 2026-11-15.
- **⚠ unsourced picks from round 3 (D-46 to D-48):** 250ms, 400ms and the grey `neutral-400` were chosen by the assistant. The assistant checked the rendered result at 1280 and 390px; Ashley has not said whether she approves the look.
- Ask Mason, one at a time: the alt text that names him, the alt text of the four timeline photos (written by the assistant, ⚠ unsourced).
- Mason questions still open: is "Iowa, US" right to show; contact email wording (U2); portrait videos for Other Work (I5, `docs/open-questions.md`); "Staged" and "Recital" vs "Stages" and "Recitals", and whether "Other" stays after Design (D-43, unsourced).
- Rules that always apply: never push, open a PR, merge, close issues or contact Mason without asking; never put a phone number anywhere (D-35); port 3000 must be free for `CI=1 npx playwright test`.
- Machine state (2026-11-19): `npm run dev` was started from this session, so port 3000 may be taken (check before `CI=1 npx playwright test`). `stash@{0}` (an old stash from `feat/motion-everywhere`, mostly the conflicted docs) is kept on purpose. Lighthouse reports from 2026-11-15 are in `.playwright-mcp/lh/` (gitignored).

## How Ashley wants the work done (2026-10-31, updated 2026-11-06)
- Use `mattpocock-skills:tdd` before and during each change. Agree the **list of test seams** with Ashley before writing a test (one line each on what it catches and misses), after agreeing the design; one question at a time with a recommendation.
- Red → green → refactor each cycle (project rule D-13 wins over the TDD skill's "no refactor in the loop"; Ashley chose this).
- After each ticket: `mattpocock-skills:code-review` (Standards + Spec sub-agents), verify findings before fixing (a "violation" can be wrong), then commit with `Closes #N`.
- For design work, give Ashley **options or drafts to choose from**, and check the rendered result at 1280 and 390 px, not just the code.
- Ask before pushing, opening PRs or merging. (2026-11-15: she asked for "commit and push, make a PR" once, for round 3; that is not a standing permission.)
- **Motion tests stay thin (Ashley, 2026-11-08):** "not too worried about motion tests, they really don't do nothing with the app logic". Agreed reading: one table-driven e2e per ticket, seen red once, one or a few mutations, no timing windows unless the ticket is about timing (the Home hero's timing is pinned in #30). It still follows `CLAUDE.md` D-13 (a test first, seen failing); do not drop tests to zero without asking. If she invokes `mattpocock-skills:implement-spec` again: it wants worktrees, subagents, merger agents and a draft PR; she has only wanted the next ticket done inline on `feat/motion-everywhere` with no PR and no push, and her "wait for my OK between tickets" rule still wins.

## Suggested skills
- `impeccable` for round 2 (`generate` to show options in the browser, `critique`/`polish` after; run `impeccable context` once per session; the Windows launcher is `.claude/skills/impeccable/scripts/impeccable.cmd`; run `detect` on the changed UI files once at the end)
- `mattpocock-skills:tdd` for any new behavior · `verification-before-completion` before committing and before claiming done
- `mattpocock-skills:code-review` (Standards + Spec) before marking a PR ready · `architect` if a ticket hits an unmade decision
- `dev-workflow:review-me` or `dev-workflow:teach-back` if Ashley wants to practice reviewing or explaining the contact form work before it goes to her lead

## Progress log (newest first: add one line per session at the top; keep about three, move older ones to `docs/archive/progress-log.md`)
- 2026-11-26 (cloud): the three reels were no longer available on YouTube, so Vocal, Acting and Dance now use the new links Mason sent (D-53); Acting Reel still featured; date 2026-11-26 is the day added, not read from YouTube. Open: confirm Mason's upload dates and that the Acting Reel should lead (U5).
- 2026-11-26 (cloud): D-52 thumbnail fix test-first: `maxresdefault` then `hqdefault` then poster, `minimumCacheTTL` 3600, tint off the frame.
- 2026-11-25 (cloud): D-51 built test-first on `claude/website-ui-thumbnails-refresh-4h8fao`: pill "View More" with arrow, gallery count + progress bar + "Load N more", hero pulse-ring scroll cue centred. Unit 369 passed, lint, typecheck, build clean; e2e selectors updated but not run. Thumbnail staleness diagnosed, fix waiting on Ashley.
- 2026-11-19: reel thumbnail template and renders for Mason (`docs/thumbnails/`, 1280x720, `node docs/thumbnails/render.mjs`); the 11 loose images in `docs/` moved to `docs/feedback-images/` (not `public/`: nothing in the app uses them); handoff rewritten (it had two versions interleaved, and conflict markers were committed in `f3db3be`); `docs/feeback.md` renamed `docs/feedback.md` and rewritten as a feedback log with sourced statuses (I8 resolved and removed); old stash dropped; merged and squash-merged local branches removed. Docs branch `docs/reel-thumbnails-and-tidy`, unit 367 passed, not pushed.
- 2026-11-15 (evening, Mac): Mason's feedback applied test-first on `feat/mason-feedback-nov-15` (from `origin/main`): Intro Video removed, Acting Reel featured, our reel thumbnails removed, his 640px photo on the Journey banner (`object-top`), new two-page resume (D-49). Follow-ups for Mason: F9 (full-size photo), F10 (his YouTube thumbnails), U5 (confirm Acting Reel). Unit 367 passed; `CI=1` e2e for media/resume 34 passed; checked at 1280 and 390. `npm ci` was needed on this Mac (`motion` was missing). Committed, pushed, PR #43.
- 2026-11-15 (later): round 3 motion built test-first, committed, pushed, PR #42 opened: timeline checkpoints pulse and the last two are dull grey (D-46), one 250ms ease-in-out for colour changes (D-47), new gallery photos fade in (D-48); roadmap ticked for Apply demo feedback, real resume and links, accessibility pass, Lighthouse and motion; old "already in view" test narrowed, crossfade test fixed. Full e2e 337 passed / 7 skipped on the last run; two pre-existing view-transition flakes recorded in `docs/gotchas.md`. Pushed.

## More detail
- `docs/gotchas.md`: Windows, Playwright, Motion and tooling gotchas (still active; add new ones there).
- `docs/archive/2026-11-motion-pass-3.md`: how #30 to #37, #39, #40 and the #36 gate were built (commits, tests, mutations, measured numbers, review verdicts).
- `docs/archive/2026-11-redesign-and-round-2.md`: Phase 10 redesign, round 2 (buttons, navbar, mobile menu, homepage, motion pass 1), the Resend contact form, and the old "After that" and D-42 plans.
- `docs/archive/2026-11-timeline-and-round-3.md`: how #38 was built (with the image recipe for the four timeline crops), and round 3 (flaky test, hydration, focus, Lighthouse numbers, D-46 to D-48).
- `docs/archive/progress-log.md`: progress log before 2026-11-15 (evening).
- Decisions: `docs/decisions.md` (D-44 is the motion recipe; D-46 to D-48 are round 3). Specs: `docs/specs/`. Phase status and Lighthouse scores: `docs/roadmap.md` (Phase 8).
