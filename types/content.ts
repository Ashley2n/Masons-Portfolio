export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type ContactInfo = {
  email: string;
  /** Optional: shown on the contact page only when set, e.g. "+1 (310) 555-0100" */
  phone?: string;
  location: string;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export type ExpertiseItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Tailwind background class for the card */
  colorClass: string;
};

type VideoBase = {
  id: string;
  title: string;
  /** Publish date, ISO "YYYY-MM-DD" */
  date: string;
  /** "portrait" for Shorts and Reels (9:16) */
  orientation: "landscape" | "portrait";
  /** Shown large in "Recent Work" on the homepage */
  featured?: boolean;
};

/** YouTube videos and Shorts play inline after a click (D-12). */
export type YouTubeVideo = VideoBase & { platform: "youtube"; youtubeId: string };

/** Instagram has no styleable player, so Reels use our own thumbnail and open on Instagram (D-12). */
export type InstagramVideo = VideoBase & {
  platform: "instagram";
  url: string;
  thumbnail: Photo;
};

export type Video = YouTubeVideo | InstagramVideo;

export type Photo = {
  /** Path under public/, e.g. /images/home/hero-portrait.jpg */
  src: string;
  alt: string;
  /** Photographer and source, for stock photos (D-11) */
  credit?: string;
  /** Intrinsic size, needed where the image keeps its own aspect ratio (gallery) */
  width?: number;
  height?: number;
};

export type ModelShot = Photo & { id: string };

export type Milestone = {
  id: string;
  title: string;
  description: string;
  image?: Photo;
  /** Achieved milestones get a check mark; ongoing ones a plain dot */
  status: "complete" | "ongoing";
};

export const galleryCategoryIds = [
  "performances",
  "portraits",
  "behind-the-scenes",
  "editorial",
  "other",
] as const;

export type GalleryCategory = (typeof galleryCategoryIds)[number];

export type GalleryItem = { id: string; category: GalleryCategory } & (
  | { kind: "photo"; photo: Photo & { width: number; height: number } }
  | { kind: "video"; video: Video }
);
