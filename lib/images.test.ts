import { describe, expect, it } from "vitest";
import {
  appendGalleryEntries,
  categoryForFolder,
  findDuplicates,
  galleryEntriesMarker,
  isSkippedFile,
  nextPhotoNumber,
  photoFileName,
  renderGalleryEntry,
} from "./images";

describe("categoryForFolder", () => {
  it.each([
    ["Concert Performances", "concerts"],
    ["Recital Performances", "recital"],
    ["Staged Performances", "staged"],
    ["Modeling", "modeling"],
    ["Designs", "design"],
  ])("maps the Drive folder %s to %s", (folder, category) => {
    expect(categoryForFolder(folder)).toBe(category);
  });

  it("ignores case and the trailing spaces Drive leaves on folder names", () => {
    expect(categoryForFolder("concert performances ")).toBe("concerts");
  });

  it("names the known folders when it meets an unknown one", () => {
    expect(() => categoryForFolder("Vacation")).toThrow(/Vacation.*Concert Performances/);
  });
});

describe("isSkippedFile", () => {
  it.each(["README.md", "notes.txt", ".DS_Store", "._IMG_0001.JPG"])("skips %s", (name) => {
    expect(isSkippedFile(name)).toBe(true);
  });

  // The file type comes from the contents: Mason's .heif files are really JPEGs (D-25)
  it.each(["IMG_9555.JPG", "DSCN7709.jpeg", "IMG_1465.heif", "photo.png"])("keeps %s", (name) => {
    expect(isSkippedFile(name)).toBe(false);
  });
});

describe("photoFileName", () => {
  it("pads the number to two digits", () => {
    expect(photoFileName("staged", 3)).toBe("staged-03.jpg");
  });

  it("keeps numbers past 99 whole", () => {
    expect(photoFileName("staged", 100)).toBe("staged-100.jpg");
  });
});

describe("nextPhotoNumber", () => {
  it("starts at 1 when the category has no photos yet", () => {
    expect(nextPhotoNumber([], "concerts")).toBe(1);
  });

  it("continues after the highest number in that category only", () => {
    const existing = ["concerts-01.jpg", "concerts-07.jpg", "staged-12.jpg", ".DS_Store"];
    expect(nextPhotoNumber(existing, "concerts")).toBe(8);
  });
});

describe("findDuplicates", () => {
  it("returns every file whose contents match an earlier file", () => {
    const files = [
      { path: "IMG_7442.jpeg", hash: "a" },
      { path: "IMG_7543.jpeg", hash: "b" },
      { path: "IMG_7442(1).jpeg", hash: "a" },
      { path: "IMG_7442(2).jpeg", hash: "a" },
    ];
    expect(findDuplicates(files)).toEqual(["IMG_7442(1).jpeg", "IMG_7442(2).jpeg"]);
  });
});

describe("renderGalleryEntry", () => {
  const entry = renderGalleryEntry({
    category: "concerts",
    src: "/images/media/concerts/concerts-01.jpg",
    width: 2000,
    height: 1333,
  });

  it("uses the file name as the id and keeps the real size", () => {
    expect(entry).toContain('id: "concerts-01"');
    expect(entry).toContain('src: "/images/media/concerts/concerts-01.jpg"');
    expect(entry).toContain("width: 2000");
    expect(entry).toContain("height: 1333");
  });

  it("leaves the alt text empty for Ashley to write (D-18)", () => {
    expect(entry).toContain('alt: ""');
  });
});

describe("appendGalleryEntries", () => {
  const source = `export const galleryPhotos = [\n  { id: "old" },\n  ${galleryEntriesMarker}\n];\n`;

  it("adds new entries above the marker and keeps the existing ones", () => {
    const result = appendGalleryEntries(source, ['{ id: "new" },']);
    expect(result.indexOf('{ id: "old" }')).toBeLessThan(result.indexOf('{ id: "new" }'));
    expect(result.indexOf('{ id: "new" }')).toBeLessThan(result.indexOf(galleryEntriesMarker));
  });

  it("refuses a file without the marker instead of guessing where to write", () => {
    expect(() => appendGalleryEntries("export const galleryPhotos = [];", [])).toThrow(/marker/);
  });
});
