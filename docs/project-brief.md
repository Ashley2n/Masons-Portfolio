# Project Brief — Mason Farrington Portfolio

_Last updated: 2026-10-09_

## Overview

A personal portfolio website for **Mason Farrington**, a multidisciplinary artist (actor, musician, singer, designer, model). The site presents his work, his story and his media, and gives collaborators, casting directors and clients a clear way to get in touch.

| Role | Person |
|---|---|
| Client | Mason Farrington |
| Developer / designer | Ashley (Ashley2n) |

## Goals

1. Present Mason as a professional, multidisciplinary artist with a distinctive, cinematic, dark visual identity.
2. Showcase his media (photos, performances, video) in an easy-to-browse gallery.
3. Make his resume easy to preview and download.
4. Turn visitors into contacts through a clear "Get in touch" path on every page.

## Audience

- Casting directors, agents and producers
- Event organizers and venues
- Brands and design clients
- Fans and collaborators

## MVP scope

| Page | Route | Source | Notes |
|---|---|---|---|
| Home | `/` | `docs/Mockups/Homepage.png` | Hero, Journey stats, Expertise, Recent Work, Other Work, Model Shots carousel, CTA, footer |
| About | `/about` | `docs/Mockups/About.png` | About hero, "My Journey" timeline (6 milestones), CTA |
| Media | `/media` | `docs/Mockups/Gallery.png` | Category tabs, photo + YouTube video grid, "Load more" |
| Resume | `/resume` | _No mockup_ | **Preview and download** of a PDF resume |
| Contact | `/contact` | `docs/Mockups/Contact.png` | Contact form, contact info card, social links |

**Shared across all pages:** header nav (About, Media, Resume, Contact) with an active state, the "Interested in working together?" CTA banner, and the footer.

**Responsive:** there are no mobile mockups, so mobile and tablet layouts are derived from the desktop designs (see [design-system.md](design-system.md#responsive)).

## Out of scope for MVP

- CMS or client self-editing (being discussed; see [open-questions.md](open-questions.md))
- Blog or news
- E-commerce or booking
- Multi-language support

## Content

- All content shown in the mockups was provided by Mason.
- Ashley has **free rein to edit copy** (typos, tone, clarity).
- Mason also has an existing website that can be used as a content source (URL to be added in [open-questions.md](open-questions.md)).
- Videos are **YouTube embeds**, shown in custom-styled cards.
- Everything still needed from Mason is tracked in [content-checklist.md](content-checklist.md).

## Timeline

| Milestone | Date |
|---|---|
| Project docs and plan | Fri 2026-10-09 |
| **Demo window** (client preview) | **Wed 2026-10-14 → Sun 2026-10-18** |
| **Launch deadline** | **Fri 2026-10-16** |

Note that the demo window extends past the launch deadline. This needs to be confirmed; see [open-questions.md](open-questions.md).

The detailed plan is in [roadmap.md](roadmap.md).

## Related docs

- [roadmap.md](roadmap.md): phased plan and progress
- [architecture.md](architecture.md): tech stack, folder structure, conventions
- [design-system.md](design-system.md): colors, type, spacing, components
- [decisions.md](decisions.md): log of technical and product decisions
- [content-checklist.md](content-checklist.md): assets and copy needed from the client
- [open-questions.md](open-questions.md): questions for the next client meeting
