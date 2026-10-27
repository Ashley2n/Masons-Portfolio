import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { aboutContent, milestones } from "./about";
import { expertiseItems, homeImages, modelShots, stats, videos } from "./home";
import { galleryCategoryIds, type Photo } from "@/types/content";
import { galleryCategories, galleryItems } from "./media";
import { pageSeo } from "./seo";
import { contactInfo, navLinks, socialLinks } from "./site";

const expectUniqueIds = (items: { id: string }[]) => {
  const ids = items.map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
};

describe("home content", () => {
  it.each([
    ["stats", stats],
    ["expertiseItems", expertiseItems],
    ["videos", videos],
    ["modelShots", modelShots],
  ])("%s have unique, non-empty ids", (_, items) => {
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => expect(item.id).toMatch(/^[a-z0-9-]+$/));
    expectUniqueIds(items);
  });

  it("every model shot is one of Mason's own photos, with alt text and no stock credit (D-24)", () => {
    modelShots.forEach((shot) => {
      expect(shot.src).toMatch(/^\/images\/media\/modeling\//);
      expect(existsSync(join(process.cwd(), "public", shot.src))).toBe(true);
      expect(shot.alt.trim()).not.toBe("");
      expect(shot.credit).toBeUndefined();
      // The carousel shows portrait photos whole on wide screens, so it needs the real size
      expect(shot.width).toBeGreaterThan(0);
      expect(shot.height).toBeGreaterThan(0);
    });
  });

  it("the Journey image is one of Mason's own photos, with no stock credit (D-24)", () => {
    expect(homeImages.journey.src).toMatch(/^\/images\/media\//);
    expect(existsSync(join(process.cwd(), "public", homeImages.journey.src))).toBe(true);
    expect(homeImages.journey.alt.trim()).not.toBe("");
    expect("credit" in homeImages.journey).toBe(false);
  });

  // Stock photos that stay until Mason's replacements arrive (D-24, C15)
  const photos: [string, Photo][] = [
    ["hero", homeImages.hero],
    ["about feature", aboutContent.feature.image],
    ...milestones.flatMap((m): [string, Photo][] => (m.image ? [[m.id, m.image]] : [])),
  ];

  it.each(photos)(
    "%s image exists in public/ and credits its photographer",
    (_, image) => {
      expect(existsSync(join(process.cwd(), "public", image.src))).toBe(true);
      expect(image.alt.trim()).not.toBe("");
      expect(image.credit).toMatch(/ \/ Unsplash$/);
    },
  );
});

describe("site content", () => {
  it("nav links point to About, Media and Contact (the resume opens in a modal instead)", () => {
    expect(navLinks).toEqual([
      { label: "About", href: "/about" },
      { label: "Media", href: "/media" },
      { label: "Contact", href: "/contact" },
    ]);
  });

  it("social links are absolute https or mailto URLs with unique ids", () => {
    expect(socialLinks.length).toBeGreaterThan(0);
    socialLinks.forEach((link) => expect(link.href).toMatch(/^(https:\/\/|mailto:)/));
    expectUniqueIds(socialLinks);
  });

  it("social links point to real profiles, not placeholder homepages", () => {
    socialLinks
      .filter((link) => link.href.startsWith("https://"))
      .forEach((link) => expect(new URL(link.href).pathname).not.toBe("/"));
  });

  it("contact info has a valid email and a location", () => {
    expect(contactInfo.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    expect(contactInfo.location.trim()).not.toBe("");
  });
});

describe("media gallery content", () => {
  it("has unique item ids", () => {
    expectUniqueIds(galleryItems);
  });

  it("every photo is Mason's own: it exists, has alt text and its real size, and no stock credit (D-24)", () => {
    galleryItems.forEach((item) => {
      if (item.kind !== "photo") return;
      expect(item.photo.src).toMatch(new RegExp(`^/images/media/${item.category}/`));
      expect(existsSync(join(process.cwd(), "public", item.photo.src))).toBe(true);
      expect(item.photo.alt.trim(), `alt text for ${item.id}`).not.toBe("");
      expect(item.photo.credit).toBeUndefined();
      expect(item.photo.width).toBeGreaterThan(0);
      expect(item.photo.height).toBeGreaterThan(0);
    });
  });

  it("labels the filters in Mason's order (D-22, D-23)", () => {
    expect(galleryCategories.map((c) => c.label)).toEqual([
      "All",
      "Concerts",
      "Recital",
      "Modeling",
      "Staged",
      "Design",
      "Other",
    ]);
  });

  it("uses every image file in public/images/media, so no stock leftovers ship", () => {
    const dir = join(process.cwd(), "public", "images", "media");
    const files = readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".jpg"))
      .map((file) => `/images/media/${file.split("\\").join("/")}`);
    const used = new Set(galleryItems.flatMap((item) => (item.kind === "photo" ? [item.photo.src] : [])));
    expect(files.filter((src) => !used.has(src))).toEqual([]);
  });

  it("offers a filter for every category, and every category has items", () => {
    expect(galleryCategories.map((c) => c.id)).toEqual(["all", ...galleryCategoryIds]);
    for (const id of galleryCategoryIds) {
      expect(galleryItems.some((item) => item.category === id)).toBe(true);
    }
  });
});

describe("SEO content", () => {
  const pages = Object.values(pageSeo);

  it("gives every page a unique description", () => {
    const descriptions = pages.map((page) => page.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps descriptions short enough that search results don't cut them off", () => {
    pages.forEach((page) => expect(page.description.length).toBeLessThanOrEqual(160));
  });

  it("covers every page in the nav", () => {
    const paths = pages.map((page) => page.path);
    navLinks.forEach((link) => expect(paths).toContain(link.href));
  });
});
