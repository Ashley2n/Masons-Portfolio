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

export const videos: Video[] = [
  { id: "video-1", title: "My first Video", date: "01/12/2024", href: "/" },
  { id: "video-2", title: "My first Video", date: "01/14/2024", href: "/" },
  { id: "video-3", title: "My first Video", date: "01/16/2024", href: "/" },
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
};
