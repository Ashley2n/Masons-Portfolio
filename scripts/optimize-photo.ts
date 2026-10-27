import sharp from "sharp";

/** Long edge of every imported photo; next/image serves smaller sizes from this (D-25) */
export const maxEdge = 2000;

/**
 * Rotates, resizes and re-encodes one photo. sharp drops all metadata (EXIF, GPS) unless asked
 * to keep it, so `rotate()` must run first: it bakes the orientation flag into the pixels.
 */
export const optimizePhoto = async (input: string, output: string) => {
  const { width, height } = await sharp(input)
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);
  return { width, height };
};
