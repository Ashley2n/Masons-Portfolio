import { galleryCategoryIds, type GalleryCategory, type GalleryItem } from "@/types/content";

export type GalleryFilter = GalleryCategory | "all";

export const filterGallery = (items: GalleryItem[], filter: GalleryFilter) =>
  filter === "all" ? items : items.filter((item) => item.category === filter);

/** Round-robin across lists: one from each in turn, so every page of the gallery mixes categories */
export const interleave = <T,>(lists: T[][]): T[] =>
  Array.from({ length: Math.max(0, ...lists.map((list) => list.length)) }, (_, i) =>
    lists.flatMap((list) => (i < list.length ? [list[i]] : [])),
  ).flat();

export const countByCategory = (items: GalleryItem[]) => {
  const counts = { all: items.length } as Record<GalleryFilter, number>;
  for (const id of galleryCategoryIds) counts[id] = filterGallery(items, id).length;
  return counts;
};
