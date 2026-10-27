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

export const expertiseItems: ExpertiseItem[] = [
  { id: "model", title: "Model", description: "Stage & Screen Work", href: "/media", colorClass: "bg-brand-400" },
  { id: "designer", title: "Designer", description: "Branding & Digital Design", href: "/media", colorClass: "bg-brand-600" },
  { id: "singer", title: "Singer", description: "Live Vocals & Studio", href: "/media", colorClass: "bg-brand-500" },
  { id: "actor", title: "Actor", description: "Theatre & On Camera", href: "/media", colorClass: "bg-brand-700" },
];

// Mock videos for the demo: Blender open movies and Blender Studio Shorts (Creative Commons),
// with their real YouTube upload dates. Replace with Mason's videos (Q C6).
export const videos: Video[] = [
  {
    id: "spring",
    platform: "youtube",
    youtubeId: "WhWc3b3KhnY",
    title: "Spring",
    date: "2019-04-04",
    orientation: "landscape",
    featured: true,
  },
  {
    id: "agent-327",
    platform: "youtube",
    youtubeId: "mN0zPOpADL4",
    title: "Agent 327: Operation Barbershop",
    date: "2017-05-15",
    orientation: "landscape",
  },
  {
    id: "cosmos-laundromat",
    platform: "youtube",
    youtubeId: "Y-rmzh0PI3c",
    title: "Cosmos Laundromat",
    date: "2015-08-10",
    orientation: "landscape",
  },
  {
    id: "big-buck-bunny",
    platform: "youtube",
    youtubeId: "aqz-KE-bpKQ",
    title: "Big Buck Bunny",
    date: "2014-11-10",
    orientation: "landscape",
  },
  {
    id: "tears-of-steel",
    platform: "youtube",
    youtubeId: "R6MlUcmOul8",
    title: "Tears of Steel",
    date: "2012-09-26",
    orientation: "landscape",
  },
  {
    id: "sintel",
    platform: "youtube",
    youtubeId: "eRsGyueVLvQ",
    title: "Sintel",
    date: "2010-09-30",
    orientation: "landscape",
  },
  {
    id: "singularity-bts",
    platform: "youtube",
    youtubeId: "66KvZ_P1BL4",
    title: "Singularity: Behind the Scenes",
    date: "2026-07-07",
    orientation: "portrait",
  },
  {
    id: "lighting-rigs-bts",
    platform: "youtube",
    youtubeId: "5PRpneyquqw",
    title: "Setting Up Lighting Rigs",
    date: "2024-09-12",
    orientation: "portrait",
  },
];

// Free Unsplash photos for the demo (D-11). Replace with Mason's own before launch (Q C10).
export const homeImages = {
  hero: {
    src: "/images/home/hero-portrait.jpg",
    alt: "Black-and-white portrait of a man looking upward into the light",
    credit: "Parthiv Sailesh / Unsplash",
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
