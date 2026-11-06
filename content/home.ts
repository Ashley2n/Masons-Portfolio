import type { ExpertiseItem, ModelShot, Photo, Stat, Video } from "@/types/content";
import { galleryPhotos } from "./gallery-photos";

/** One of Mason's gallery photos by id; alt text and size come from the gallery entry, so they're written once */
const galleryPhoto = (id: string) => {
  const photo = galleryPhotos.find((p) => p.id === id);
  if (!photo) throw new Error(`Unknown gallery photo "${id}" on the homepage`);
  const { src, alt, width, height } = photo;
  return { src, alt, width, height };
};

export const heroContent = {
  roles: ["Actor", "Musician", "Singer", "Designer"],
  firstName: "Mason",
  lastName: "Farrington",
  tagline:
    "A multidisciplinary artist creating meaningful experiences through performance and design.",
  cta: { label: "View work", href: "/media" },
};

export const stats: Stat[] = [
  { id: "theatrical-shows", value: "10", label: "theatrical/musical shows" },
  { id: "live-events", value: "12", label: "concerts, competitions & live events" },
  { id: "musical-shows", value: "4", label: "theatrical/musical shows" },
];

// Each card shows one of Mason's gallery photos, cropped to fit (D-33)
export const expertiseItems: ExpertiseItem[] = [
  { id: "model", title: "Model", description: "Stage & Screen Work", image: galleryPhoto("modeling-11"), imagePosition: "object-[50%_20%]" },
  { id: "designer", title: "Designer", description: "Branding & Digital Design", image: galleryPhoto("design-03"), imagePosition: "object-center" },
  { id: "singer", title: "Singer", description: "Live Vocals & Studio", image: galleryPhoto("concerts-07"), imagePosition: "object-[50%_30%]" },
  { id: "actor", title: "Actor", description: "Theatre & On Camera", image: galleryPhoto("staged-07"), imagePosition: "object-[50%_35%]" },
];

// Mason's real videos only (D-32). The date is the YouTube upload date.
export const videos: Video[] = [
  {
    id: "intro-video",
    platform: "youtube",
    youtubeId: "1BnBTdARUHk",
    title: "Mason Farrington Intro Video",
    date: "2026-03-31",
    orientation: "landscape",
    featured: true,
  },
  // Sent by Mason 2026-10-31 (F3), all unlisted with embedding on; their thumbnail is his
  // contact card (D-35). Same upload day, so the order he sent them is the Other Work order.
  {
    id: "vocal-reel",
    platform: "youtube",
    youtubeId: "sK9xduGWTaQ",
    title: "Mason Farrington Vocal Reel",
    date: "2026-10-31",
    orientation: "landscape",
  },
  {
    id: "dance-reel",
    platform: "youtube",
    youtubeId: "3yPWsqxpAa8",
    title: "Mason Farrington Dance Reel",
    date: "2026-10-31",
    orientation: "landscape",
  },
  {
    id: "acting-reel",
    platform: "youtube",
    youtubeId: "VdFlh2DAS20",
    title: "Mason Farrington Acting Reel",
    date: "2026-10-31",
    orientation: "landscape",
  },
];

// Free Unsplash photos for the demo (D-11). Replace with Mason's own before launch (Q C10).
export const homeImages = {
  // Mason's portrait: AI-edited to low-key black and white, then mirrored to face the headline (docs/hero-portrait-prompt.md)
  hero: {
    src: "/images/home/mason-hero.jpg",
    alt: "Black-and-white portrait of Mason smiling and looking up to the left against a black background",
  },
  // Mason's photo in the purple stage light of the brand theme (D-24)
  journey: galleryPhoto("staged-11"),
} satisfies Record<string, Photo>;

/** Mason's photos chosen for the homepage (F5) */
const modelShotIds = ["modeling-02", "modeling-08", "modeling-10", "modeling-01", "modeling-06"];

export const modelShots: ModelShot[] = modelShotIds.map((id) => ({ id, ...galleryPhoto(id) }));

export const sectionHeadings = {
  journey: {
    eyebrow: "About Me",
    title: "The Journey So Far",
    description: "Years of training, stages, and performances that shaped where I am today.",
  },
  expertise: { eyebrow: "Expertise", title: "What I Do" },
  recentWork: { eyebrow: "Media", title: "Recent Work", viewMore: "View More", otherWork: "Other Work" },
  modelShots: { title: "Model Shots" },
};
