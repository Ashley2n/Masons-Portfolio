// @vitest-environment node
// sharp needs Node's own Buffer; jsdom's would break it.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { optimizePhoto } from "./optimize-photo";

const dir = mkdtempSync(join(tmpdir(), "optimize-photo-"));

/** A landscape-stored photo with the "rotate 90°" flag phones write for portrait shots, plus EXIF to strip */
const phonePhoto = async (name: string, width: number, height: number) => {
  const path = join(dir, name);
  await sharp({ create: { width, height, channels: 3, background: "#808080" } })
    .jpeg()
    .withExif({ IFD0: { Make: "TestPhone" } })
    .withMetadata({ orientation: 6 })
    .toFile(path);
  return path;
};

describe("optimizePhoto", () => {
  it("applies the rotation flag so portrait photos stand upright", async () => {
    const result = await optimizePhoto(await phonePhoto("rotated.jpg", 3000, 1500), join(dir, "out-1.jpg"));
    expect(result.height).toBeGreaterThan(result.width);
  });

  it("fits the long edge within 2000 px and reports the real output size", async () => {
    const result = await optimizePhoto(await phonePhoto("big.jpg", 4000, 3000), join(dir, "out-2.jpg"));
    expect(result).toEqual({ width: 1500, height: 2000 });
    const meta = await sharp(join(dir, "out-2.jpg")).metadata();
    expect({ width: meta.width, height: meta.height }).toEqual(result);
  });

  it("never enlarges a small photo", async () => {
    const result = await optimizePhoto(await phonePhoto("small.jpg", 800, 600), join(dir, "out-3.jpg"));
    expect(result).toEqual({ width: 600, height: 800 });
  });

  it("strips EXIF, so no camera or GPS data reaches the site", async () => {
    await optimizePhoto(await phonePhoto("exif.jpg", 1000, 1000), join(dir, "out-4.jpg"));
    const meta = await sharp(join(dir, "out-4.jpg")).metadata();
    expect(meta.exif).toBeUndefined();
    expect(meta.orientation).toBeUndefined();
  });
});
