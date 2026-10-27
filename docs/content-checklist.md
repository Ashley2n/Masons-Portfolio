# Content Checklist

Assets and copy needed to finish the site. Tick items off as they arrive, and note where each file lives in the repo.

_Last updated: 2026-10-10_

**Copy:** the homepage mockup is the source of truth. **Photos:** free stock (Unsplash, Pexels and similar) for the MVP. Record each photo's source URL and photographer next to it in `content/` so credits are easy to find. Mason's own portraits replace stock portraits before launch (Q C10).

**Legend:** ✅ received · ⏳ requested · ❌ not yet requested · 🔁 placeholder in use · 📷 free stock photo (Ashley sources)

## Global

| Item | Status | Notes / location |
|---|---|---|
| Logo / monogram "MF" | 🔁 | Currently styled text (Playfair italic). Confirm whether an SVG logo exists. |
| Favicon and app icon | ❌ | Can be generated from the MF monogram. |
| Social share image (Open Graph, 1200×630) | ❌ | Can be generated from the hero photo. |
| Email address for the site | ✅ | `masonfarrington@gmail.com` (from mockup). Confirm it's the public one. |
| Phone number | ⏳ | Ashley adds it as `phone` in `contactInfo` (`content/site.ts`); the contact card shows it automatically once set. |
| Location | ✅ | Los Angeles, CA |
| Social links (Instagram, YouTube, others) | ⏳ | YouTube only (Q C7, D-20). Hidden until Mason sends the URL (F4); add it to `socialLinks` in `content/site.ts`. |
| Existing site (content reference) | ✅ | https://sites.google.com/view/masonmfarrington-com/home |
| Domain | ❌ | None for now (Q C5); launch on `*.vercel.app` (D-21). |

## Home (`/`)

| Item | Status | Notes |
|---|---|---|
| Hero portrait (high-res, dark background) | 📷 → ⏳ | Stock (`hero-portrait.jpg`, Parthiv Sailesh / Unsplash) for the demo; Mason's real portrait for launch (Q C10). |
| Hero copy (roles + tagline) | ✅ | Match mockup: "Actor • Musician • Singer • Designer" / "A multidisciplinary artist creating meaningful experiences through performance and design." |
| Journey stats (3) | ✅ | Match mockup: 10+ theatrical/musical shows · 12+ concerts, competitions & live events · 4+ theatrical/musical shows. |
| Journey image (spotlight on stage) | 📷 | `journey-spotlight.jpg` (Luis Morera / Unsplash) |
| Expertise cards | ✅ | Match mockup: Model (Stage & Screen Work) · Designer (Branding & Digital Design) · Singer (Live Vocals & Studio) · Actor (Theatre & On Camera). Proposed link: `/media`. |
| Recent Work: featured video | 🔁 | Mock: Blender open movie "Spring" (CC). Replace with Mason's most recent or most viewed video / Reel (Q C6). |
| Other Work: 3 videos (title, date, link) | 🔁 | Mock: Blender open movies and Blender Studio Shorts (CC) with real upload dates in `content/home.ts`. Replace with Mason's hand-picked YouTube videos, newest first (F3, D-20). |
| Model Shots: 5+ portrait photos | 📷 → ⏳ | Five Unsplash portraits (`model-shot-1..5.jpg`, credits in `content/home.ts`) for the demo; Mason's real photos for launch (Q C10). |

## About (`/about`)

| Item | Status | Notes |
|---|---|---|
| Intro copy (2 paragraphs) | ✅ | From mockup. |
| Signature image / SVG | 🔁 | "Mason F." in a script font (Mrs Saint Delafield). Final per Q C13. |
| Hero feature image + caption | 📷 | `about/feature-peaks.jpg` (Kai Oberhäuser / Unsplash). Caption follows homepage wording: "Designer / Branding & Digital Design". |
| Journey milestones 01–06 (title + description) | ✅ | From mockup: Found the Stage · First Role, First Spark · Went All In · Joined American Gothic Performing Arts · Americas got Talent · Movie Actor. Copy-edit needed (e.g. "America's Got Talent"). |
| Journey images (4) | 📷 | `about/journey-*.jpg`, credits in `content/about.ts`. |

## Media (`/media`)

| Item | Status | Notes |
|---|---|---|
| Hero copy ("Moments. Stories. Vision.") | ✅ | |
| Gallery photos (12+), each with category and alt text | 📷 | 18 Unsplash photos in `public/images/media/` + reused home photos; credits in `content/media.ts`. Categories change to Concerts, Modeling, Staged, Design, Other (D-22). |
| Gallery videos (YouTube / Reel links + category) | 🔁 | Mock Blender videos and Shorts. Replace via F3 (YouTube only, D-20). |

## Resume (`/resume`)

| Item | Status | Notes |
|---|---|---|
| Resume PDF | 🔁 | Placeholder (watermarked SAMPLE) at `public/resume/mason-farrington-resume.pdf`. Replace the file with Mason's PDF, same name (Q C4). |

## Contact (`/contact`)

| Item | Status | Notes |
|---|---|---|
| Heading and intro copy | ✅ | From mockup. |
| Side card image (coastline at dusk) | 📷 | `contact/coast-dusk.jpg` (JIWON KANG / Unsplash) |
| Quote ("Good art starts with a conversation.") | ✅ | |
| Footer tagline ("Creating a more expressive tomorrow.") | ✅ | |
| Form delivery method and recipient | 🔁 | Demo uses a prefilled `mailto:` to `contactInfo.email`. See Q C2. |

## Image guidelines (share with Mason when requesting his own photos)

- Send **original, full-resolution** files (JPG, PNG or HEIC). We optimize them for the web.
- Landscape images should be at least **2400px** on the long edge; portraits at least **1600px**.
- Include a short description of each photo (what, where, when). We use it for alt text and captions.
- Only send images he owns or has the rights to use (photographer credit if required).
