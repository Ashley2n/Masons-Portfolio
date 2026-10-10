import { describe, expect, it } from "vitest";
import type { GalleryItem } from "@/types/content";
import { countByCategory, filterGallery } from "./gallery";

const photo = (id: string, category: GalleryItem["category"]): GalleryItem => ({
  id,
  category,
  kind: "photo",
  photo: { src: `/images/media/${id}.jpg`, alt: id, width: 100, height: 100 },
});

const items = [
  photo("a", "performances"),
  photo("b", "portraits"),
  photo("c", "performances"),
  photo("d", "editorial"),
];

describe("filterGallery", () => {
  it("returns everything for 'all'", () => {
    expect(filterGallery(items, "all")).toEqual(items);
  });

  it("keeps only the chosen category, in the original order", () => {
    expect(filterGallery(items, "performances").map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("returns an empty list for a category with no items", () => {
    expect(filterGallery(items, "other")).toEqual([]);
  });
});

describe("countByCategory", () => {
  it("counts items per category, plus the total under 'all'", () => {
    expect(countByCategory(items)).toEqual({
      all: 4,
      performances: 2,
      portraits: 1,
      "behind-the-scenes": 0,
      editorial: 1,
      other: 0,
    });
  });
});
