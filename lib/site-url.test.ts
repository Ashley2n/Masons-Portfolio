import { describe, expect, it } from "vitest";
import { getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  it("prefers an explicitly configured site URL (for a custom domain)", () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://masonfarrington.com",
        VERCEL_PROJECT_PRODUCTION_URL: "mason-farrington.vercel.app",
      }),
    ).toBe("https://masonfarrington.com");
  });

  it("drops a trailing slash from the configured URL", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://masonfarrington.com/" })).toBe(
      "https://masonfarrington.com",
    );
  });

  it("falls back to Vercel's production domain, which has no protocol", () => {
    expect(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "mason-farrington.vercel.app" })).toBe(
      "https://mason-farrington.vercel.app",
    );
  });

  it("uses the local dev server when nothing is configured", () => {
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });
});

describe("getSiteUrl with a domain entered without a protocol", () => {
  it("adds https:// so building absolute URLs doesn't fail", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "masonfarrington.com" })).toBe(
      "https://masonfarrington.com",
    );
    expect(() => new URL(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "masonfarrington.com" }))).not.toThrow();
  });
});
