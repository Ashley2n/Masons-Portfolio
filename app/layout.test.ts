import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site-url";
import { metadata } from "./layout";

describe("site metadata", () => {
  it("uses Mason's name as the default title", () => {
    expect(metadata.title).toMatchObject({
      default: expect.stringContaining("Mason Farrington"),
    });
  });

  it("titles sub-pages as 'Page | Mason Farrington'", () => {
    expect(metadata.title).toMatchObject({ template: "%s | Mason Farrington" });
  });

  it("describes Mason, not the Next.js starter", () => {
    expect(metadata.description).toMatch(/multidisciplinary artist/i);
    expect(metadata.description).not.toMatch(/create next app/i);
  });
});

describe("site-wide SEO", () => {
  it("resolves relative URLs (canonical, link previews) against the site URL", () => {
    expect(metadata.metadataBase?.toString()).toBe(`${getSiteUrl()}/`);
  });

  it("shows a large image when the link is shared", () => {
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
