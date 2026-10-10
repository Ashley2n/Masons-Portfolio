import type { ExpertiseItem, ModelShot, Photo, Stat, Video } from "@/types/content";

export const stats: Stat[] = [
  { id: "theatrical-shows", value: "10", label: "theatrical shows" },
  { id: "live-events", value: "12", label: "concerts, competitions, and live events" },
  { id: "musical-shows", value: "4", label: "theatrical/musical show" },
];

export const expertiseItems: ExpertiseItem[] = [
  { id: "model", title: "Model", description: "Stage & Screen Work", href: "/", colorClass: "bg-brand-400" },
  { id: "designer", title: "Designer", description: "Branding & Digital Design", href: "/", colorClass: "bg-brand-600" },
  { id: "singer", title: "Singer", description: "Live Vocals & Studio", href: "/", colorClass: "bg-brand-500" },
  { id: "actor", title: "Actor", description: "Theate & On Camera", href: "/", colorClass: "bg-brand-700" },
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
  journey: {
    src: "/images/home/journey-spotlight.jpg",
    alt: "A performer standing alone in a spotlight on a dark stage",
    credit: "Luis Morera / Unsplash",
  },
} satisfies Record<string, Photo>;

export const modelShots: ModelShot[] = [
  {
    id: "studio-portrait",
    src: "/images/home/model-shot-1.jpg",
    alt: "Black-and-white studio portrait, looking straight into the camera",
    credit: "Matheus Farias / Unsplash",
  },
  {
    id: "turtleneck-portrait",
    src: "/images/home/model-shot-2.jpg",
    alt: "Black-and-white portrait in a dark sweater, glancing to the side",
    credit: "mohammad kashkooli / Unsplash",
  },
  {
    id: "low-key-portrait",
    src: "/images/home/model-shot-3.jpg",
    alt: "Low-key portrait with one hand raised to the chin",
    credit: "omid armin / Unsplash",
  },
  {
    id: "shadow-portrait",
    src: "/images/home/model-shot-4.jpg",
    alt: "Portrait half in shadow against a black background",
    credit: "Nartan Büyükyıldız / Unsplash",
  },
  {
    id: "seated-portrait",
    src: "/images/home/model-shot-5.jpg",
    alt: "Black-and-white portrait in a dark t-shirt",
    credit: "Lukas Kaufmann / Unsplash",
  },
];

export const sectionHeadings = {
  journey: {
    eyebrow: "About Me",
    title: "The Journey So Far",
    description: "Years of training, stages, and performances that shaped where I am today",
  },
  expertise: { eyebrow: "Expertise", title: "What I Do" },
  recentWork: { eyebrow: "Media", title: "Recent Work", viewMore: "View More", otherWork: "Other Work" },
};
