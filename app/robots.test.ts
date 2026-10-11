import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site-url";
import robots from "./robots";

describe("robots.txt", () => {
  it("lets search engines crawl the whole site", () => {
    expect(robots().rules).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("points crawlers to the sitemap", () => {
    expect(robots().sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
  });
});
