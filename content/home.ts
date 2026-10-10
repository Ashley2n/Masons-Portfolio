import type { ExpertiseItem, ModelShot, Stat, Video } from "@/types/content";

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

export const modelShots: ModelShot[] = [
  {
    id: "arindam-mondal",
    src: "/images/home/arindam-mondal-j1C4ZVwQ5UQ-unsplash.jpg",
    alt: "Something",
    credit: "Arindam Mondal / Unsplash",
  },
  {
    id: "joseph-malone",
    src: "/images/home/joseph-malone-DtJ7BJyez9E-unsplash.jpg",
    alt: "Something 2",
    credit: "Joseph Malone / Unsplash",
  },
  {
    id: "mike-hindle",
    src: "/images/home/mike-hindle-fw93NEMCq6c-unsplash.jpg",
    alt: "Something 3",
    credit: "Mike Hindle / Unsplash",
  },
  {
    id: "thorium",
    src: "/images/home/thorium-o_IcRyN_Bo0-unsplash.jpg",
    alt: "Something 4",
    credit: "Thorium / Unsplash",
  },
  {
    id: "joseph-malone-2",
    src: "/images/home/joseph-malone-DtJ7BJyez9E-unsplash.jpg",
    alt: "Something 5",
    credit: "Joseph Malone / Unsplash",
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
