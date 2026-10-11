import type { Metadata } from "next";
import { shareImage } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { readSharePhoto, shareImageText, shareImageVersion } from "./share-image";

type PageSeo = {
  /** Omit for the home page, which uses the site's default title */
  title?: string;
  description: string;
  path: string;
};

export const defaultTitle = `${siteConfig.name} | ${siteConfig.tagline}`;

const image = {
  url: `${shareImage.path}?v=${shareImageVersion(readSharePhoto(), shareImageText)}`,
  width: shareImage.width,
  height: shareImage.height,
  alt: shareImage.alt,
};

/** Title, description, canonical URL and link-preview tags for one page. */
export const pageMetadata = ({ title, description, path }: PageSeo): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  // A page's openGraph and twitter replace the inherited ones instead of merging (the
  // share image included), so every page repeats the shared fields
  openGraph: {
    title: title ? `${title} | ${siteConfig.name}` : defaultTitle,
    description,
    url: path,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [image],
  },
  twitter: { card: "summary_large_image", images: [image] },
});
