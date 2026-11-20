# Handoff: Mason's Portfolio

Where the project is and what's next, for Ashley and any agent picking it up. `CLAUDE.md` lists the other docs to read. Keep this file short: link to issues, decisions and the roadmap instead of copying them. At the end of a session, update the sections below and add one line to the progress log; when a section is finished, move it to `docs/archive/` instead of letting it pile up here.

<<<<<<< Updated upstream
GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-15 (PR #42 merged; Mason's 2026-11-15 feedback on `feat/mason-feedback-nov-15`, PR #43 open)

## Where things stand
- **Branch `feat/mason-feedback-nov-15`** (from `origin/main`, 2026-11-15): Mason's 2026-11-15 feedback (D-49): Intro Video removed, Acting Reel featured, our reel thumbnails removed, his photo on the Journey banner, new two-page resume. Committed (`306b073`), pushed, **PR #43** open against `main`. Waiting on Mason: F9, F10, U5 (`docs/open-questions.md`). The bullets below are from before PR #42 merged.
- **Branch `feat/motion-everywhere`**, pushed 2026-11-15, **PR #42 open against `main`** (not merged; Mason has not seen before/after, U1). Latest commits: `1e8396b` (#41, `Closes #41`), `04cfaab` (#38, `Closes #38`), `4bb05d7` (handoff), `b632384` (#37). **Committed 2026-11-15 on top (`5c26240`, `d152c9c`, then the round 3 commits to `eb04694`):** `e2e/media.spec.ts` (flaky "Load more" fix), `components/motion/` (`suppressHydrationWarning` on `LoadItem` and `Reveal`, focus rests a `Reveal`, `hydration.test.tsx`, `Reveal.test.tsx`, two comments corrected). Full `CI=1` production e2e with those: 307 passed, 7 skipped, 0 failed, 0 flaky; unit 365 passed; lint and typecheck clean.
=======
GitHub: `Ashley2n/Masons-Portfolio` (public) · Last updated: 2026-11-15 (end of the round 3 session; everything committed and pushed; PR #42 open)

## Where things stand
- **Branch `feat/motion-everywhere`**, in sync with origin, **PR #42 open against `main`** (`https://github.com/Ashley2n/Masons-Portfolio/pull/42`, mergeable, not merged; the body has the before/after evidence and the merge danger). 30 commits ahead of `origin/main`. Latest code commits: `feb393b` (gallery fade, D-48), `22a7c21` (hover ease, D-47), `85588ac` (timeline pulse, D-46), `d152c9c` and `5c26240` (hydration, focus, flaky test), `1e8396b` (#41), `04cfaab` (#38).
- **Checks on the last run:** lint and typecheck clean, 365 unit tests, full `CI=1` production e2e 337 passed, 7 skipped (one earlier run had a flaky: see Open items). Lighthouse (13.6.0, 2026-11-15): every measured page is at or above 90 on mobile and desktop (lowest: About and Media mobile 91, Resume desktop 95); the 404 cannot be audited. Numbers in `docs/roadmap.md` Phase 8.
>>>>>>> Stashed changes
- **On `main` already:** Phase 9 fixes (PR #15), the Resend contact form (PRs #22 to #25) and the Phase 10 redesign (PR #27, merged 2026-11-06, `890eb29`). Mason has **not** yet seen before/after (U1).
- **In PR #42, not merged:** motion pass 3 (#30 to #35, D-44), #36 (`Refs #36`; the PR body leaves it for Ashley to close), #37 (reel thumbnails), #38 and #41 (About timeline, D-45), #39 and #40 (bug fixes), and round 3: timeline pulse and dull last two (D-46), 250ms ease-in-out for colour changes (D-47), gallery fade-in (D-48). The PR body closes #30 to #35 and #37 to #41 on merge.
- **Next up:** Ashley decides on the PR and on showing Mason. No ticket is planned.
- **Not done:** launch on `*.vercel.app` (roadmap Phase 8; its milestone dates are stale and no new date is set), remove Instagram code (D-20; still in `content/site.ts` and `VideoCard.tsx`), "Get in touch" near the top on mobile (C26), D-42 slices 2 and 3 (form feedback, resume dialog; unbuilt; the media slice is now D-48), a stronger mobile-menu effect (needs a reference).
- **Where the history went:** see "More detail" at the bottom.

## Next session (start here): the open items, one at a time
**Prompt for the next session (copy it as the first message; open the terminal and editor at the `D:` path):**
```text
Continue Mason's portfolio (D:\01-Projects\Client-Projects\Masons-Portfolio). Open the terminal and editor at the D: path, never through the C:\Users\aa\Documents junction (the dev server breaks there; see docs/gotchas.md). Start with docs/handoff.md, especially "Next session (start here)" and "Open items", then follow CLAUDE.md. Read docs/gotchas.md too.

State: on the branch feat/motion-everywhere (do not create another branch), pushed, PR #42 open against main and not merged. Last full CI=1 production e2e: 337 passed, 7 skipped. docs/feeback.md, docs/open-questions.md (I8) and the images in docs/ are uncommitted on purpose (commit them only if I say so). Everything else, including docs/gotchas.md and docs/archive/, is committed.

Goal for this session: go through the open items with me, one question at a time, with your recommended answer, every decision sourced or marked "unsourced". Do not start any of them before I answer. In this order, unless I say otherwise: (1) the PR: review it, then merge or not (my call), and when Mason sees before/after (U1); (2) the originals in docs/ (sources of the four timeline crops) can move to docs/feedback-images/, outside public/, with the links in docs/feeback.md fixed (image-9.png is a duplicate of image-5.png); (3) the flaky "exactly one view transition" test (e2e/page-transition.spec.ts:56, 2 startViewTransition calls for one click, about 4 of 60 runs; find the cause, it may be a real double crossfade); (4) what to ask Mason (Vocal Reel thumbnail 404, alt text that names him, the play button on his face in the Acting thumbnail, I8: which image for "The Journey So Far", the alt text of the four timeline photos, the phone crop of the Went All In collage, whether "Iowa, US" is right); (5) the roadmap leftovers: Vercel launch and a new date, Instagram removal (D-20), C26, AGENTS.md.

Rules: never push, open a PR, merge or close issues without asking me (I said "commit and push, make a PR" for round 3 only). Never commit without asking. Port 3000 must be free for CI=1 npx playwright test: check it and ask before stopping anything (no server of mine is running now; stop only a process you started yourself, by its PID). Never put a phone number in code, tests, docs, issues or commits (D-35); look at every new image before it goes in the repo; keep screenshots in .playwright-mcp (gitignored). Update docs/handoff.md and add one line to its progress log at the end of the session.
```

## Open items (don't guess, ask Ashley)
- **PR #42:** review and merge are Ashley's call; so is showing Mason before/after (U1). #36 stays open until she closes it.
- **About mobile Lighthouse:** 88 to 91 between runs, observed LCP 254ms (details in `docs/archive/2026-11-timeline-and-round-3.md`). Recommendation: accept; Ashley decides. ⚠ the simulated-vs-observed reading is mine, not from a Lighthouse doc.
- **Flaky view-transition test (not caused by round 3):** `e2e/page-transition.spec.ts:56` "choosing About in the menu starts exactly one view transition" sees 2 `startViewTransition` calls: 4 of 60 at `HEAD`, 6 of 60 with round 3 (`docs/gotchas.md`). Cause not investigated; the assertion was left strict on purpose. It is probably the unidentified flaky in the first full run of 2026-11-15.
- **⚠ unsourced picks from round 3 (D-46 to D-48):** 250ms, 400ms and the grey `neutral-400` were chosen by the assistant. The assistant checked the rendered result at 1280 and 390px; Ashley has not said whether she approves the look.
- Ask Mason, one at a time: Vocal Reel thumbnail 404 (`sK9xduGWTaQ`; the dev log shows it), the alt text that names him, the play button sitting on his face in the Acting thumbnail, **I8** in `docs/open-questions.md` (which image for Home "The Journey So Far"; Mason's `image-9.png` is a copy of the Dance Reel thumbnail), the alt text of the four timeline photos (written by the assistant, ⚠ unsourced).
- Mason questions still open: is "Iowa, US" right to show; contact email wording (U2); portrait videos for Other Work (I5, `docs/open-questions.md`); "Staged" and "Recital" vs "Stages" and "Recitals", and whether "Other" stays after Design (D-43, unsourced).
- `AGENTS.md` was committed in `acd5aa3` though the standing rule is not to commit it (`next dev` regenerates it): decide whether to remove it.
- Rules that always apply: never push, open a PR, merge, close issues or contact Mason without asking; never put a phone number anywhere (D-35); port 3000 must be free for `CI=1 npx playwright test`.
- Machine state (2026-11-15): no server of mine is running, port 3000 free, branch in sync with origin. Uncommitted on purpose: `docs/feeback.md`, `docs/open-questions.md` and the images in `docs/`. Lighthouse reports from this session are in `.playwright-mcp/lh/` (gitignored).

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
<<<<<<< Updated upstream
- 2026-11-15 (evening, Mac): Mason's feedback applied test-first on `feat/mason-feedback-nov-15` (from `origin/main`): Intro Video removed, Acting Reel featured, our reel thumbnails removed, his 640px photo on the Journey banner (`object-top`), new two-page resume (D-49). Follow-ups for Mason: F9 (full-size photo), F10 (his YouTube thumbnails), U5 (confirm Acting Reel). Unit 367 passed; `CI=1` e2e for media/resume 34 passed; checked at 1280 and 390. `npm ci` was needed on this Mac (`motion` was missing). Committed, pushed, PR #43.
- 2026-11-15 (later): round 3 motion built test-first, committed, pushed, PR #42 opened: timeline checkpoints pulse and the last two are dull grey (D-46), one 250ms ease-in-out for colour changes (D-47), new gallery photos fade in (D-48); roadmap ticked for Apply demo feedback, real resume and links, accessibility pass, Lighthouse and motion; old "already in view" test narrowed, crossfade test fixed. Full e2e 337 passed / 7 skipped on the last run; two pre-existing view-transition flakes recorded in `docs/gotchas.md`. Pushed.
- 2026-11-15: fixed, test-first, all uncommitted: flaky mobile "Load more" test (cause: Playwright re-scrolls after a 0.1px "not stable" wobble; now reads scrollY in the page at click time), reduced-motion hydration warning (dev-only; `suppressHydrationWarning` + `hydration.test.tsx`), focus-reveal gap (`Reveal` rests on focus, D-44 note updated). Lighthouse About mobile measured, no code change (see Open items). Full e2e 307 / 7 skipped / 0 failed. Not pushed.
- 2026-11-14: #41 built and committed (`1e8396b`, `Closes #41`): "Broadway" (id `broadway`) and "Movie Actor" take Mason's copy with typos fixed, both ongoing and without a photo; three seams seen red then green (content, page, e2e), checked by eye at 1280 and 390px. Review and the full e2e skipped on purpose (content strings only). Not pushed.
- 2026-11-14: #38 built and committed (`04cfaab`, `Closes #38`): Mason's photos and copy on four About entries, tint removed, `*em*` helper, D-45; five test seams seen red then green, review clean (no hard findings), full `CI=1` e2e 306 passed / 7 skipped / 1 flaky / 0 failed. New items from Mason's feedback: #41 (last two entries, confirmations ticked) and I8 (Journey image). Not pushed.
=======
- 2026-11-15: fixed and built test-first, all committed and pushed, PR #42 opened: flaky mobile "Load more" test (Playwright's retry-scroll; 3 of 30 failed before, 0 of 120 after), dev-only reduced-motion hydration warning, focus-reveal gap, timeline pulse with dull last two (D-46), 250ms ease-in-out for colour changes (D-47), gallery fade-in for new photos (D-48), crossfade test ignores zero-length animations. Lighthouse re-measured on every page (all at or above 90; About mobile 88 to 91, no change made). Roadmap brought up to date. Full e2e 337 passed / 7 skipped. One pre-existing view-transition flake left open (see Open items).
- 2026-11-14: #41 built and committed (`1e8396b`, `Closes #41`): "Broadway" (id `broadway`) and "Movie Actor" take Mason's copy with typos fixed, both ongoing and without a photo; three seams seen red then green (content, page, e2e), checked by eye at 1280 and 390px. Review and the full e2e skipped on purpose (content strings only).
- 2026-11-14: #38 built and committed (`04cfaab`, `Closes #38`): Mason's photos and copy on four About entries, tint removed, `*em*` helper, D-45; five test seams seen red then green, review clean (no hard findings), full `CI=1` e2e 306 passed / 7 skipped / 1 flaky / 0 failed. New items from Mason's feedback: #41 (last two entries, confirmations ticked) and I8 (Journey image).
>>>>>>> Stashed changes

## More detail
- `docs/gotchas.md`: Windows, Playwright, Motion and tooling gotchas (still active; add new ones there).
- `docs/archive/2026-11-motion-pass-3.md`: how #30 to #37, #39, #40 and the #36 gate were built (commits, tests, mutations, measured numbers, review verdicts).
- `docs/archive/2026-11-redesign-and-round-2.md`: Phase 10 redesign, round 2 (buttons, navbar, mobile menu, homepage, motion pass 1), the Resend contact form, and the old "After that" and D-42 plans.
- `docs/archive/2026-11-timeline-and-round-3.md`: how #38 was built (with the image recipe for the four timeline crops), and round 3 (flaky test, hydration, focus, Lighthouse numbers, D-46 to D-48).
- `docs/archive/progress-log.md`: progress log before 2026-11-14.
- Decisions: `docs/decisions.md` (D-44 is the motion recipe; D-46 to D-48 are round 3). Specs: `docs/specs/`. Phase status and Lighthouse scores: `docs/roadmap.md` (Phase 8).
