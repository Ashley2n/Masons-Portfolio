import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { heroContent, homeImages } from "@/content/home";

// Helpers for the link-preview image (app/opengraph-image.tsx). Server-only: they read files.

/**
 * Short hash of everything drawn on the image. It goes in the image URL (?v=…), so sites
 * that cache previews by URL (iMessage, Slack, Facebook) fetch the new image when it changes.
 */
export const shareImageVersion = (photo: Buffer, text: string) =>
  createHash("sha256").update(photo).update(text).digest("hex").slice(0, 8);

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/** Embeds a photo for ImageResponse, which only reads JPEG and PNG. */
export const imageDataUrl = (photo: Buffer, src: string) => {
  const type = mimeTypes[extname(src).toLowerCase()];
  if (!type) {
    throw new Error(`The share image needs a JPEG or PNG photo, but got ${src}. Convert it first.`);
  }
  return `data:${type};base64,${photo.toString("base64")}`;
};

/** The hero photo and text drawn on the share image */
export const sharePhotoSrc = homeImages.hero.src;
export const readSharePhoto = () => readFileSync(join(process.cwd(), "public", sharePhotoSrc));
export const shareImageText = JSON.stringify(heroContent);
