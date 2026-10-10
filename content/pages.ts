import type { PageIntro } from "@/types/content";

/** Page headings. Copy is from the mockups, except Resume, which has none. */
export const pageIntros = {
  resume: {
    eyebrow: "Resume",
    title: "Resume",
    description: "Training, credits and experience across stage, screen, music and design.",
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Let's create something great.",
    description:
      "Have a project, opportunity, or idea in mind? Whether it's a performance, creative collaboration, or just a conversation — I'd love to hear from you.",
  },
} satisfies Record<string, PageIntro>;
