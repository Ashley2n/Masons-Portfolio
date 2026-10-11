import type { MetadataRoute } from "next";
import { pageSeo } from "@/content/seo";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return Object.values(pageSeo).map(({ path }) => ({
    url: path === "/" ? base : `${base}${path}`,
  }));
}
