# Mason's feedback

What Mason (via Ashley) asked for, newest first, with what became of each item. Mason's wording is kept as sent (typos and all); the status lines are ours. Tests and decisions cite the section names below, so keep the headings. Images are in `docs/feedback-images/`. Open questions for Mason live in `docs/open-questions.md`.

## 2026-11-19: Thumbnails

> Need a thumbnail template; use the existing thumbnails that were mocked up by you.

- Dance Reel: `feedback-images/image-5.png`. Acting Reel: `feedback-images/image-7.png`. Vocal Reel: `feedback-images/image-10.png`.
- **Status:** template and three 1280x720 renders made in `docs/thumbnails/` (`node docs/thumbnails/render.mjs`). Not sent to Mason yet (F10). They are for his YouTube thumbnails, not used by the site (D-49). The Dance photo is only 640 px wide, so its render is soft.

## 2026-11-15: Homepage, thumbnails, Intro Video, new resume

> If you added thumnails your self please remove them. Just provided the templeted example we mocked for Mason for him to do so on youtube. Please also remove the Video titled. `Mason Farrignton Intro Video`, that is confirmed by Mason.

- **Journey So Far:** his photo is the picture in `feedback-images/image-5.png` (640x360).
- **New Resume:** a new two-page PDF.
- **Status:** all done in D-49 (`306b073`, PR #43, merged 2026-11-16): our thumbnails removed (YouTube's show now), Intro Video removed, Acting Reel leads, the photo is `public/images/home/journey.jpg` (soft on large screens: F9), the resume is published as sent (`public/resume/mason-farrington-resume.pdf`, D-35).

## 2026-11-14: Home page, Journey image

> The Jorney so far. Image: `image-9.png`

- **Status:** answered by the 2026-11-15 feedback above. `image-9.png` is byte-identical to `image-5.png`, so it was the same photo.

## 2026-11-08 and 2026-11-14: About Image Sections

Mason sent a photo and copy for each timeline entry (his wording is in `content/about.ts`, typos fixed and approved by Ashley on the issues).

| Entry | Image | Status |
|---|---|---|
| Found the Stage | `81B64667-9444-4110-B844-CFE51D2CAC29.JPEG` | Built in #38 (`04cfaab`, D-45) |
| First Role, First Spark | `image-6.png` | Built in #38 |
| Went All In | `IMG_1122.JPG` | Built in #38 |
| Join American Gothic, then First Regional Contract | `image-8.png` | Built in #38 |
| American Got Talent, then Broadway | none | Built in #41 (`1e8396b`), ongoing, no photo |
| Movie Actor | none | Built in #41, ongoing, no photo |

Show titles are *starred* in the copy so they render in italics.

## Issues

- "Clicking 'Load more' resets the user to the top of the page (this creates a bad UX)." **Fixed** in `8358e4e` ("keep the page in place when Load more adds photos"); `e2e/media.spec.ts` checks the scroll position stays put.
