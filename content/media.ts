import { interleave } from "@/lib/gallery";
import { galleryCategoryIds, type GalleryCategory, type GalleryItem, type Video } from "@/types/content";
import { galleryPhotos } from "./gallery-photos";
import { videos } from "./home";

const video = (category: GalleryCategory, id: string): GalleryItem => {
  const found = videos.find((v: Video) => v.id === id);
  if (!found) throw new Error(`Unknown video "${id}" in the media gallery`);
  return { id: `video-${id}`, kind: "video", category, video: found };
};

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
  { id: "concerts", label: "Concerts" },
  { id: "recital", label: "Recital" },
  { id: "modeling", label: "Modeling" },
  { id: "staged", label: "Staged" },
  { id: "design", label: "Design" },
  { id: "other", label: "Other" },
];

// Mason's photos (D-24) and the mock videos from content/home.ts, mapped to the D-22 categories.
const photoItems = galleryPhotos.map(({ id, category, src, alt, width, height }): GalleryItem => ({
  id,
  kind: "photo",
  category,
  photo: { src, alt, width, height },
}));

const videoItems = [
  video("concerts", "spring"),
  video("other", "singularity-bts"),
  video("other", "agent-327"),
  video("concerts", "tears-of-steel"),
  video("other", "lighting-rigs-bts"),
  video("other", "cosmos-laundromat"),
  video("concerts", "sintel"),
  video("other", "big-buck-bunny"),
];

/** Gallery order: one item from each category in turn, so every page of results has variety, like the mockup. */
export const galleryItems: GalleryItem[] = interleave([
  ...galleryCategoryIds.map((category) => photoItems.filter((item) => item.category === category)),
  videoItems,
]);
