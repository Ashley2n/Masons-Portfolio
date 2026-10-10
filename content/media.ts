import type { GalleryCategory, GalleryItem, Photo, Video } from "@/types/content";
import { homeImages, modelShots, videos } from "./home";

type SizedPhoto = Photo & { width: number; height: number };

const photo = (category: GalleryCategory, image: SizedPhoto) => ({ category, image });

const video = (category: GalleryCategory, id: string): GalleryItem => {
  const found = videos.find((v: Video) => v.id === id);
  if (!found) throw new Error(`Unknown video "${id}" in the media gallery`);
  return { id: `video-${id}`, kind: "video", category, video: found };
};

const shot = (index: number) => modelShots[index];

export const mediaContent = {
  eyebrow: "Media",
  title: "Moments. Stories. Vision.",
  description:
    "A collection of visuals from my creative journey — performances, projects, and everything in between.",
  cta: { label: "Explore the gallery", href: "#gallery" },
  loadMore: "Load more",
  /** Items shown at first and added per "Load more" */
  pageSize: 12,
};

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "performances", label: "Performances" },
  { id: "portraits", label: "Portraits" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
  { id: "editorial", label: "Editorial" },
  { id: "other", label: "Other" },
];

// Free Unsplash photos (D-11) and the mock videos from content/home.ts.
const photos = {
  "singer-purple-light": photo("performances", {
    src: "/images/media/singer-purple-light.jpg",
    alt: "A singer silhouetted against a ring of purple stage lights",
    credit: "Noah F / Unsplash",
    width: 1600,
    height: 2133,
  }),
  "singer-smoke": photo("performances", {
    src: "/images/media/singer-smoke.jpg",
    alt: "A singer performing into a microphone through stage haze",
    credit: "Mohd Zuber saifi / Unsplash",
    width: 1600,
    height: 2276,
  }),
  "concert-guitar": photo("performances", {
    src: "/images/media/concert-guitar.jpg",
    alt: "A fan with raised arms in front of a guitarist on a lit stage",
    credit: "Tijs van Leur / Unsplash",
    width: 1600,
    height: 2397,
  }),
  "dancer-red-light": photo("performances", {
    src: "/images/media/dancer-red-light.jpg",
    alt: "A dancer mid-move in red and blue stage light",
    credit: "Michael Afonso / Unsplash",
    width: 1600,
    height: 1067,
  }),
  "dancer-motion": photo("performances", {
    src: "/images/media/dancer-motion.jpg",
    alt: "A dancer in motion, blurred under a soft spotlight",
    credit: "Ahmad Odeh / Unsplash",
    width: 1600,
    height: 1067,
  }),
  "backstage-mirror": photo("behind-the-scenes", {
    src: "/images/media/backstage-mirror.jpg",
    alt: "Getting ready at a lit dressing-room mirror",
    credit: "Oleg Sergeichik / Unsplash",
    width: 1600,
    height: 1063,
  }),
  "dressing-room-lights": photo("behind-the-scenes", {
    src: "/images/media/dressing-room-lights.jpg",
    alt: "A dressing-room mirror lined with light bulbs",
    credit: "Annie V / Unsplash",
    width: 1600,
    height: 2400,
  }),
  "studio-microphone": photo("behind-the-scenes", {
    src: "/images/media/studio-microphone.jpg",
    alt: "A condenser microphone with a pop filter in a dark studio",
    credit: "Leo Wieling / Unsplash",
    width: 1600,
    height: 2400,
  }),
  "empty-stage": photo("behind-the-scenes", {
    src: "/images/media/empty-stage.jpg",
    alt: "An empty stage under a row of lights",
    credit: "Mark Thompson / Unsplash",
    width: 1600,
    height: 1200,
  }),
  "stage-blue-light": photo("behind-the-scenes", {
    src: "/images/media/stage-blue-light.jpg",
    alt: "A stage set lit with blue light",
    credit: "stefano stacchini / Unsplash",
    width: 1600,
    height: 911,
  }),
  "editorial-coat": photo("editorial", {
    src: "/images/media/editorial-coat.jpg",
    alt: "A figure in an oversized black coat against a white backdrop",
    credit: "Malicki M Beser / Unsplash",
    width: 1600,
    height: 1200,
  }),
  "editorial-seated": photo("editorial", {
    src: "/images/media/editorial-seated.jpg",
    alt: "A man in a blue shirt seated against a grey wall",
    credit: "Victor Melo / Unsplash",
    width: 1600,
    height: 2404,
  }),
  "editorial-white-shirt": photo("editorial", {
    src: "/images/media/editorial-white-shirt.jpg",
    alt: "Portrait in a white polo shirt",
    credit: "Luiz Rogério Nunes / Unsplash",
    width: 1600,
    height: 1067,
  }),
  "editorial-garage": photo("editorial", {
    src: "/images/media/editorial-garage.jpg",
    alt: "A man standing in a dim parking garage",
    credit: "Shannon VanDenHeuvel / Unsplash",
    width: 1600,
    height: 2400,
  }),
  "curved-architecture": photo("other", {
    src: "/images/media/curved-architecture.jpg",
    alt: "Flowing white curved architecture at dusk",
    credit: "İltun Huseynli / Unsplash",
    width: 1600,
    height: 2133,
  }),
  "architecture-water": photo("other", {
    src: "/images/media/architecture-water.jpg",
    alt: "A curved building on the water at sunset",
    credit: "Sandro Katalina / Unsplash",
    width: 1600,
    height: 1068,
  }),
  "violet-mountains": photo("other", {
    src: "/images/media/violet-mountains.jpg",
    alt: "Violet mountain ridges at dusk",
    credit: "Victor Dittiere / Unsplash",
    width: 1600,
    height: 900,
  }),
  "theatre-interior": photo("other", {
    src: "/images/media/theatre-interior.jpg",
    alt: "An ornate theatre auditorium facing the stage",
    credit: "Liam McGarry / Unsplash",
    width: 1600,
    height: 1068,
  }),
  "hero-portrait": photo("portraits", { ...homeImages.hero, width: 1600, height: 2133 }),
  "journey-spotlight": photo("performances", { ...homeImages.journey, width: 2400, height: 1600 }),
  "studio-portrait": photo("portraits", { ...shot(0), width: 1600, height: 2400 }),
  "turtleneck-portrait": photo("portraits", { ...shot(1), width: 1600, height: 2400 }),
  "low-key-portrait": photo("portraits", { ...shot(2), width: 1600, height: 2454 }),
  "shadow-portrait": photo("portraits", { ...shot(3), width: 1600, height: 2400 }),
  "seated-portrait": photo("portraits", { ...shot(4), width: 1600, height: 2400 }),
};

const photoItem = (id: keyof typeof photos): GalleryItem => {
  const { category, image } = photos[id];
  const { src, alt, credit, width, height } = image;
  return { id, kind: "photo", category, photo: { src, alt, credit, width, height } };
};

/** Gallery order: mixed so every page of results has variety, like the mockup. */
export const galleryItems: GalleryItem[] = [
  photoItem("singer-purple-light"),
  photoItem("hero-portrait"),
  photoItem("curved-architecture"),
  video("performances", "spring"),
  photoItem("architecture-water"),
  photoItem("violet-mountains"),
  photoItem("studio-portrait"),
  video("behind-the-scenes", "singularity-bts"),
  photoItem("backstage-mirror"),
  photoItem("journey-spotlight"),
  photoItem("editorial-coat"),
  photoItem("dancer-red-light"),
  photoItem("turtleneck-portrait"),
  video("other", "agent-327"),
  photoItem("singer-smoke"),
  photoItem("dressing-room-lights"),
  photoItem("editorial-seated"),
  photoItem("theatre-interior"),
  video("performances", "tears-of-steel"),
  photoItem("low-key-portrait"),
  photoItem("studio-microphone"),
  photoItem("concert-guitar"),
  video("behind-the-scenes", "lighting-rigs-bts"),
  photoItem("editorial-white-shirt"),
  photoItem("shadow-portrait"),
  photoItem("empty-stage"),
  video("other", "cosmos-laundromat"),
  photoItem("dancer-motion"),
  photoItem("editorial-garage"),
  photoItem("stage-blue-light"),
  video("performances", "sintel"),
  photoItem("seated-portrait"),
  video("other", "big-buck-bunny"),
];
