import { siteConfig } from "./site";

/** Search and link-preview copy for each page. Also the list of pages in the sitemap. */
export const pageSeo = {
  home: {
    path: "/",
    description: siteConfig.description,
  },
  about: {
    title: "About",
    path: "/about",
    description:
      "Mason Farrington's journey from his first school stage to film: training, performances and the milestones along the way.",
  },
  media: {
    title: "Media",
    path: "/media",
    description:
      "Photos and videos of Mason Farrington's work as an actor, model, singer and designer.",
  },
  resume: {
    title: "Resume",
    path: "/resume",
    description:
      "Mason Farrington's resume: training, credits and experience across stage, screen, music and design.",
  },
  contact: {
    title: "Contact",
    path: "/contact",
    description:
      "Get in touch with Mason Farrington about acting, modeling, music or design work.",
  },
};

/** The link-preview image (app/opengraph-image.tsx) */
export const shareImage = {
  path: "/opengraph-image",
  alt: `${siteConfig.name}: ${siteConfig.tagline}`,
  width: 1200,
  height: 630,
};
