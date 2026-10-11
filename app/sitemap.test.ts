import { describe, expect, it } from "vitest";
import { navLinks } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";
import sitemap from "./sitemap";

describe("sitemap.xml", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the home page, every nav page and the resume as absolute URLs", () => {
    const base = getSiteUrl();
    expect(urls).toEqual(
      expect.arrayContaining([
        base,
        ...navLinks.map((link) => `${base}${link.href}`),
        `${base}/resume`,
      ]),
    );
  });

  it("lists each page once", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});
