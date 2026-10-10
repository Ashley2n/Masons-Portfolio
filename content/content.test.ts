import { describe, expect, it } from "vitest";
import { expertiseItems, modelShots, stats, videos } from "./home";
import { navLinks } from "./site";

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

  it("every model shot has alt text and a local image path", () => {
    modelShots.forEach((shot) => {
      expect(shot.alt.trim()).not.toBe("");
      expect(shot.src).toMatch(/^\/images\//);
    });
  });
});

describe("site content", () => {
  it("nav links are internal and unique", () => {
    navLinks.forEach((link) => expect(link.href).toMatch(/^\//));
    expect(new Set(navLinks.map((link) => link.label)).size).toBe(navLinks.length);
  });
});
