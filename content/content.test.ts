import { describe, expect, it } from "vitest";
import { expertiseItems, modelShots, stats, videos } from "./home";
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

  it("every model shot has alt text and a local image path", () => {
    modelShots.forEach((shot) => {
      expect(shot.alt.trim()).not.toBe("");
      expect(shot.src).toMatch(/^\/images\//);
    });
  });
});

describe("site content", () => {
  it("nav links point to the four MVP pages, in mockup order", () => {
    expect(navLinks).toEqual([
      { label: "About", href: "/about" },
      { label: "Media", href: "/media" },
      { label: "Resume", href: "/resume" },
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
