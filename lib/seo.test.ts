import { describe, expect, it } from "vitest";
import { shareImage } from "@/content/seo";
import { pageMetadata } from "./seo";

describe("pageMetadata", () => {
  const about = pageMetadata({
    title: "About",
    description: "Mason's story.",
    path: "/about",
  });

  it("sets the page title and description", () => {
    expect(about.title).toBe("About");
    expect(about.description).toBe("Mason's story.");
  });

  it("points the canonical URL at the page", () => {
    expect(about.alternates?.canonical).toBe("/about");
  });

  it("gives link previews the full title, description and URL", () => {
    expect(about.openGraph).toMatchObject({
      title: "About | Mason Farrington",
      description: "Mason's story.",
      url: "/about",
      siteName: "Mason Farrington",
      type: "website",
    });
  });

  it("uses the site's default title for a page without its own (the home page)", () => {
    const home = pageMetadata({ description: "Home.", path: "/" });

    expect(home.title).toBeUndefined();
    expect(home.openGraph?.title).toBe("Mason Farrington | Actor, Musician, Singer & Designer");
  });
});

describe("pageMetadata share image", () => {
  // A page's openGraph replaces the inherited one, image included, so sub-pages
  // shared without a picture until the image was set explicitly.
  const about = pageMetadata({ title: "About", description: "Mason's story.", path: "/about" });

  it("includes the share image in the link preview", () => {
    expect(about.openGraph?.images).toEqual([
      expect.objectContaining({ url: shareImage.path, width: 1200, height: 630, alt: shareImage.alt }),
    ]);
  });

  it("includes the share image for X/Twitter cards", () => {
    expect(about.twitter).toMatchObject({
      card: "summary_large_image",
      images: [expect.objectContaining({ url: shareImage.path })],
    });
  });
});
