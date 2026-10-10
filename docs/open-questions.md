# Open Questions & Client Follow-ups

Questions to resolve with Mason (or internally). When something is answered, move it to **Resolved** with the date and the answer, and record any lasting decision in [decisions.md](decisions.md).

_Last updated: 2026-10-09_

## For the next client meeting

| # | Question | Why it matters | Proposed default if no answer |
|---|---|---|---|
| C1 | **Do you want to edit site content yourself after launch?** If so, how often, and what content (gallery, videos, journey, resume)? | Decides whether we add a headless CMS (e.g. Sanity) or keep content in code files. | Content stays in typed files under `content/`, structured so a CMS can be added later. |
| C2 | **How should the contact form deliver messages?** Options: email to your inbox via a service like Resend, a form service like Formspree, or a simple `mailto:` link. Which email address should receive them? | The form needs a backend. Some options need an account or API key owned by Mason. | Ship a `mailto:` fallback for the demo and add a real form backend once the client confirms. |
| C3 | **Is the phone number `+1 (234) 567 8902` on the Contact mockup real?** Do you want a phone number public at all? | It looks like a placeholder, and publishing a phone number invites spam. | Hide the phone number. |
| C4 | **Can you send the resume as a PDF?** Should the site show one resume, or separate ones (acting, music, design)? | Resume preview and download are in the MVP. | One PDF. |
| C5 | **What is the domain**, and do you already own it? Who should own the hosting account? | Needed for launch and for metadata/SEO. | Deploy to a Vercel preview URL, then connect the domain at launch. |
| C6 | **Which YouTube videos** go in "Recent Work", "Other Work" and the Media gallery? Please send the links. | The mockup uses placeholders ("My First Video"). | Use placeholders until links arrive. |
| C7 | **Social links:** Instagram and YouTube URLs. Any others (TikTok, IMDb, Backstage, LinkedIn, Spotify)? | Footer and Contact page. | Instagram, YouTube and Email only. |
| C8 | **Stats on the homepage:** "10+ theatrical/musical shows" and "4+ theatrical/musical shows" use the same label. What should each stat say? | Looks like a copy error in the mockup. | Fix in copy once confirmed. |
| C9 | **Expertise wording:** the About hero card says "Designer / Stage & Screen Work", but on the homepage "Stage & Screen Work" belongs to "Model". Which is correct? | Inconsistent copy. | Follow the homepage. |
| C10 | **Photos:** are all images in the mockups yours or licensed to you? Several (cat, mountain, architecture, flower) look like stock images. Please send the original high-resolution photos. | Copyright and image quality. | Use only photos Mason confirms. |
| C11 | **Media categories:** are "Performances, Portraits, Behind the Scenes, Editorial, Other" final? | Gallery filtering and data model. | Use these five. |
| C12 | **Demo and launch timing:** the demo window (Wed 10/14 → Sun 10/18) extends past the Friday 10/16 deadline. Is Friday the launch date or the demo-ready date? | Planning. | Demo-ready by Wed 10/14, launch-ready by Fri 10/16, feedback through Sun 10/18. |
| C13 | **Signature:** can you provide your signature (used on the About hero) as an image or SVG? | Asset needed. | Use a script font as a placeholder. |
| C14 | **Analytics:** do you want visitor analytics (e.g. Vercel Analytics)? | Privacy and cookie notice considerations. | Vercel Analytics, which is cookieless. |

## Internal (Ashley)

| # | Question | Notes |
|---|---|---|
| I1 | What's the URL of Mason's existing website (content source)? | Add it to [project-brief.md](project-brief.md). |
| I2 | Is there a Figma (or other) source file for the mockups? | Needed to confirm exact hex values. The brand 600 color reads as `#8A5CF6` in the mockup but `#8A2CF6` in code, and the neutral scale is missing a 600 step. See [design-system.md](design-system.md). |
| I3 | The Contact mockup uses a different serif and body font from the design system (Playfair Display / Inter). Intentional? | Default: use the design-system fonts everywhere. |
| I4 | Footer year: Homepage mockup says © 2024, others say © 2026. | Default: generate the current year automatically. |

## Resolved

| Date | Question | Answer |
|---|---|---|
| 2026-10-09 | Is resume in MVP? | Yes: preview **and** download. |
| 2026-10-09 | Is "Contact" a nav item? | Yes, on every page. |
| 2026-10-09 | How are videos hosted? | YouTube embeds, with custom card styling. |
| 2026-10-09 | Are there mobile mockups? | No. Derive mobile layouts from desktop. |
| 2026-10-09 | Who owns the copy? | Content from Mason. Ashley has free rein to edit copy. |
| 2026-10-09 | Git workflow? | Feature branches with small, focused commits. |
