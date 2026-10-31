# Open Questions & Client Follow-ups

Questions to resolve with Mason (or internally). When something is answered, move it to **Resolved** with the date and the answer, and record any lasting decision in [decisions.md](decisions.md).

_Last updated: 2026-10-31_

## For the client demo meeting

_All answered at the 2026-10-19 meeting; see **Resolved**._

## Waiting on Mason

Answered in principle; the asset or account is still to come.

| # | Item | Notes |
|---|---|---|
| F1 | **Resend account** (C2) | API key received 2026-10-29 and stored in `.env.local` as `RESEND_API_KEY` (gitignored). Still to do: add it in Vercel env vars, and **confirm the account is under `mason.13.farrington@gmail.com`** before building the form (D-31: with no domain, Resend only delivers to the account's own address). |
| F3 | **More video links** (C6) | One received 2026-10-29: "Reel 2 0" (`1BnBTdARUHk`, D-32). More coming; add each newest first, and Other Work reappears on its own. |
| F5 | **Real photos** (C10) | Received 2026-10-26 (101 files in the Drive folder; 97 imported, D-25). Done: gallery, Model Shots, Journey image and hero use his photos (C15 approved). |

## For the next update to Mason

| # | Item | Notes |
|---|---|---|
| U1 | **Redesign before/after** (D-33) | Show the redesigned banner, buttons, Contact card, footer, expertise cards and animations before they ship. |
| U2 | **Reel title** (D-32) | The site shows the YouTube title "Mason Farrington Reel 2 0". Should it read "Reel 2.0"? If so, change the title on YouTube too, or only on the site? |

## Internal (Ashley)

| # | Question | Notes |
|---|---|---|
| I1 | **Should portrait videos count for Other Work?** | `selectHomeVideos` in `lib/video.ts` only picks landscape videos for Other Work. If Mason's next video is a portrait Short, Other Work stays hidden, which isn't what D-32 expects ("Other Work comes back on its own"). Behaviour unchanged until decided. |

## Resolved

| Date | Question | Answer |
|---|---|---|
| 2026-10-29 | F2: Real resume? | Received. Publish it with the phone line removed from the file (D-31). |
| 2026-10-29 | Which contact email? | `mason.13.farrington@gmail.com`, as on his resume. No phone number anywhere public (D-31). |
| 2026-10-29 | F3: Videos? | One so far, "Reel 2 0"; it's featured, Blender videos come out, Other Work hides until more arrive (D-32). |
| 2026-10-29 | F4: YouTube channel link? | No. No social links at all; footer Connect and Contact Follow hide when empty (D-30). |
| 2026-10-29 | C17: Sharper versions of 13 small photos? | None available; the current ones stay. |
| 2026-10-29 | C18: "Recital" filter? | Approved; it was Mason's suggestion. |
| 2026-10-29 | C19: CTA banner contrast? | Replaced by the Impeccable redesign of the banner (D-33). |
| 2026-10-29 | C20: Model/Singer card contrast? | Folded into the redesign of the expertise cards; text must pass AA (D-33). |
| 2026-10-29 | C21: Duplicate "theatrical/musical shows" label? | Keep as is. |
| 2026-10-29 | C22: Approve the new Contact card? | Replaced by the redesign of the Contact card; the current one stays live until then (D-33). |
| 2026-10-29 | C23: Move Model Shots up? | Yes, right after the hero. |
| 2026-10-29 | C24: Photos on the Expertise tiles? | Tiles don't link anywhere. Photos are tried in the redesign (D-33). |
| 2026-10-29 | C25: Hide video sections until real videos arrive? | Other Work hides while empty; Recent Work shows "Reel 2 0" (D-32). |
| 2026-10-29 | C26: Get in touch near the top? | Try options in the redesign and review (D-33). |
| 2026-10-26 | C15: AI-edited hero portrait? | OK, as long as the edit doesn't alter his face (Mason, relayed by Ashley). The live hero is the edit mirrored to face the headline; show him `mason-hero.jpg` itself, since mirroring shows his face flipped (earring in the other ear). Don't AI-upscale it: upscalers redraw facial detail. |
| 2026-10-26 | C16: Re-upload two damaged photos? | Not needed. `IMG_0217` and `IMG_0224` stay out of the gallery (Mason, relayed by Ashley). |
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
| 2026-10-19 | C1: Will Mason edit content himself? | No CMS. Mason adds or removes photos every 3–6 months by dropping them (with a category and caption) into a shared Google Drive folder that Ashley already set up; Ashley adds them to the site (D-18). |
| 2026-10-19 | C2: Contact form delivery? | Resend with a branded HTML email to Mason, reply-to set to the visitor. Mason owns the Resend account (D-19). |
| 2026-10-19 | C4: Resume? | One PDF. Ashley has it; checking whether Mason has an updated version (F2). |
| 2026-10-19 | C5: Domain and hosting? | No domain for now; launch on `*.vercel.app`. Hosted on Ashley's Vercel account (D-21). |
| 2026-10-19 | C6: Videos? | Hand-picked list, newest first. Mason will send the links (F3). |
| 2026-10-19 | C7: Social links? | YouTube only for now. Instagram Reels are dropped from the video section too (D-20). |
| 2026-10-19 | C10: Real photos? | Yes, via the shared folder. Swapping out stock faces is a launch blocker (F5). |
| 2026-10-19 | C11: Media categories? | All (default), Concerts, Modeling, Staged, Design, Other. "Staged" is theater/stage acting (D-22). |
| 2026-10-19 | C13: Signature? | Keep the script font permanently. |
| 2026-10-19 | C14: Analytics? | No analytics (D-21). |
