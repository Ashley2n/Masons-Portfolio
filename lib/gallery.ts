import { galleryCategoryIds, type GalleryCategory, type GalleryItem } from "@/types/content";

export type GalleryFilter = GalleryCategory | "all";

export const filterGallery = (items: GalleryItem[], filter: GalleryFilter) =>
  filter === "all" ? items : items.filter((item) => item.category === filter);

export const countByCategory = (items: GalleryItem[]) => {
  const counts = { all: items.length } as Record<GalleryFilter, number>;
  for (const id of galleryCategoryIds) counts[id] = filterGallery(items, id).length;
  return counts;
};
