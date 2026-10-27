// @vitest-environment node
// Runs the real script on a tiny Drive folder in a temp directory.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import { galleryEntriesMarker } from "@/lib/images";

const script = join(process.cwd(), "scripts", "import-photos.ts");

const setup = async (folder: string) => {
  const root = mkdtempSync(join(tmpdir(), "import-photos-"));
  const photos = join(root, "05-Assets", folder);
  mkdirSync(photos, { recursive: true });
  mkdirSync(join(root, "content"));
  writeFileSync(
    join(root, "content", "gallery-photos.ts"),
    `export const galleryPhotos = [\n  ${galleryEntriesMarker}\n];\n`,
  );
  const jpeg = await sharp({
    create: { width: 400, height: 300, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 30 } },
  })
    .jpeg()
    .toBuffer();
  writeFileSync(join(photos, "a-photo.jpg"), jpeg);
  writeFileSync(join(photos, "b-photo-copy.jpg"), jpeg);
  // Cut off like an unfinished upload: the header reads fine, the full decode fails
  writeFileSync(join(photos, "c-broken.jpg"), jpeg.subarray(0, Math.floor(jpeg.length * 0.6)));
  writeFileSync(join(photos, "README.md"), "# notes");
  const run = spawnSync(
    "node",
    ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", script, join(root, "05-Assets")],
    { cwd: root, encoding: "utf8" },
  );
  return { root, run, content: readFileSync(join(root, "content", "gallery-photos.ts"), "utf8") };
};

describe("import-photos script", () => {
  let result: Awaited<ReturnType<typeof setup>>;
  beforeAll(async () => {
    result = await setup("Modeling");
  });

  it("finishes even when a photo is damaged", () => {
    expect(result.run.stderr).toBe("");
    expect(result.run.status).toBe(0);
  });

  it("imports the good photo once and adds it to the content file", () => {
    expect(readdirSync(join(result.root, "public", "images", "media", "modeling"))).toEqual(["modeling-01.jpg"]);
    expect(result.content).toContain('id: "modeling-01"');
    expect(result.content).not.toContain('id: "modeling-02"');
  });

  it("reports the duplicate and the damaged file by name", () => {
    expect(result.run.stdout).toMatch(/Skipped duplicates \(1\):\n\s+\S*(a-photo|b-photo-copy)\.jpg/);
    expect(result.run.stdout).toMatch(/Couldn't read[\s\S]*c-broken\.jpg/);
  });

  it("stops before writing anything when a folder has no category", async () => {
    const { root, run, content } = await setup("Vacation");
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('Unknown Drive folder "Vacation"');
    expect(readdirSync(root)).not.toContain("public");
    expect(content).not.toContain("id:");
  });
});
