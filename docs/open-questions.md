# Open Questions & Client Follow-ups

Questions to resolve with Mason (or internally). When something is answered, move it to **Resolved** with the date and the answer, and record any lasting decision in [decisions.md](decisions.md).

_Last updated: 2026-10-10_

## For the client demo meeting (Wed 10/14 – Sun 10/18, date TBD)

| # | Question | Why it matters | Proposed default if no answer |
|---|---|---|---|
| C1 | **Do you want to edit site content yourself after launch?** If so, how often, and what content (gallery, videos, journey, resume)? | Decides whether we add a headless CMS (e.g. Sanity) or keep content in code files. | Content stays in typed files under `content/`, structured so a CMS can be added later. |
| C2 | **How should the contact form deliver messages?** Options: email to your inbox via a service like Resend, a form service like Formspree, or a simple `mailto:` link. Which email address should receive them? | The form needs a backend. Some options need an account or API key owned by Mason. | `mailto:` fallback for the demo, then a real form backend once confirmed. |
| C4 | **Can you send the resume as a PDF?** Should the site show one resume, or separate ones (acting, music, design)? | Resume preview and download are in the MVP. | One PDF. |
| C5 | **Domain:** you don't have one yet. Do you want to buy one (e.g. `masonfarrington.com`, about $10–20/yr), and who should own the domain and hosting accounts? | Needed for a professional launch URL, email deliverability (Resend needs a verified domain), and SEO. | Launch on a free `*.vercel.app` URL and connect a domain whenever it's purchased. |
| C6 | **Videos:** which YouTube videos and Instagram Reels should be featured? Should they be ordered by **most recent** or **most viewed**? Is your Instagram a Business or Creator account? | Placeholders in mockup. The account type decides whether Reels can be pulled automatically later (see D-12). | Hand-picked list, newest first. |
| C7 | **Social links:** Instagram and YouTube URLs. Any others (TikTok, IMDb, Backstage, LinkedIn, Spotify)? | Footer and Contact page. | Instagram, YouTube and Email only. |
| C10 | **Photos of you:** the MVP uses free stock photos (Unsplash and similar). For launch, can you send real photos of yourself for the hero portrait and Model Shots? | A portfolio showing a stranger's face as Mason misrepresents him to casting directors and clients. Stock is fine for atmospheric images (stages, landscapes, textures). | Stock photos for the demo. Swap in Mason's own portraits before launch. |
| C11 | **Media categories:** are "Performances, Portraits, Behind the Scenes, Editorial, Other" final? | Gallery filtering and data model. | Use these five. |
| C13 | **Signature:** can you provide your signature (used on the About hero) as an image or SVG? | Asset needed. | Use a script font as a placeholder. |
| C14 | **Analytics:** confirm Vercel Analytics is OK. | Privacy. Vercel Analytics is cookieless, so no cookie banner is needed. | Enable Vercel Web Analytics at launch. |

## Internal (Ashley)

_None open._

## Resolved

| Date | Question | Answer |
|---|---|---|
| 2026-10-09 | Is resume in MVP? | Yes: preview **and** download. |
| 2026-10-09 | Is "Contact" a nav item? | Yes, on every page. |
| 2026-10-09 | How are videos hosted? | YouTube embeds, with custom card styling. Instagram Reels may also be included (see D-12). |
| 2026-10-09 | Are there mobile mockups? | No. Derive mobile layouts from desktop. |
| 2026-10-09 | Who owns the copy? | Content from Mason. Ashley has free rein to edit copy. |
| 2026-10-09 | Git workflow? | Feature branches with small, focused commits. |
| 2026-10-10 | C3: Is the mockup phone number real? | No. Ashley has the real number and will add it directly. |
| 2026-10-10 | C5 (part): Does Mason have a domain? | No. Purchase question remains open in C5. |
| 2026-10-10 | C8: Homepage stat labels? | Match the homepage mockup exactly. |
| 2026-10-10 | C9: Expertise wording conflict (About vs Home)? | Follow the homepage wording: Model, Designer, Singer, Actor with the homepage subtitles. Homepage mockup is the copy source of truth. |
| 2026-10-10 | C12: Demo vs launch timing? | Not a conflict. The demo is **one meeting with Mason sometime Wed 10/14 – Sun 10/18**, depending on his availability. The site must be demo-ready by Wed 10/14. |
| 2026-10-10 | C14 (part): Analytics? | Likely Vercel's built-in analytics. Confirm with Mason. |
| 2026-10-10 | I1: Mason's existing site? | https://sites.google.com/view/masonmfarrington-com/home (little content). |
| 2026-10-10 | I2: Source of truth for colors? | **The colors in the code** (`app/globals.css`), not the PNG mockup. |
| 2026-10-10 | I3: Fonts? | The design-system fonts as configured in code: Playfair Display, Inter, Space Mono. |
| 2026-10-10 | I4: Footer year? | Generated automatically. |
| 2026-10-10 | Image source? | Free photos from Unsplash and similar sites for the MVP, instead of extracting them from Mason's current site. |
