import { describe, expect, it } from "vitest";
import type { GalleryItem } from "@/types/content";
import { countByCategory, filterGallery, interleave } from "./gallery";

const photo = (id: string, category: GalleryItem["category"]): GalleryItem => ({
  id,
  category,
  kind: "photo",
  photo: { src: `/images/media/${id}.jpg`, alt: id, width: 100, height: 100 },
});

const items = [
  photo("a", "concerts"),
  photo("b", "modeling"),
  photo("c", "concerts"),
  photo("d", "staged"),
];

describe("filterGallery", () => {
  it("returns everything for 'all'", () => {
    expect(filterGallery(items, "all")).toEqual(items);
  });

  it("keeps only the chosen category, in the original order", () => {
    expect(filterGallery(items, "concerts").map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("returns an empty list for a category with no items", () => {
    expect(filterGallery(items, "other")).toEqual([]);
  });
});

describe("countByCategory", () => {
  it("counts items per category, plus the total under 'all'", () => {
    expect(countByCategory(items)).toEqual({
      all: 4,
      concerts: 2,
      recital: 0,
      modeling: 1,
      staged: 1,
      design: 0,
      other: 0,
    });
  });
});

describe("interleave", () => {
  it("takes one item from each list in turn, so every page mixes categories", () => {
    expect(interleave([["a1", "a2", "a3"], ["b1"], ["c1", "c2"]])).toEqual(["a1", "b1", "c1", "a2", "c2", "a3"]);
  });

  it("returns an empty list for no lists", () => {
    expect(interleave([])).toEqual([]);
  });
});
