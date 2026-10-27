// Imports Mason's photos from an unzipped Drive folder into the gallery (D-25).
// Usage: npm run import-photos -- "<path to unzipped 05-Assets folder>"
// Then write the alt text for every new entry in content/gallery-photos.ts (D-18).
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  appendGalleryEntries,
  categoryForFolder,
  findDuplicates,
  isSkippedFile,
  nextPhotoNumber,
  photoFileName,
  renderGalleryEntry,
} from "../lib/images.ts";
import { optimizePhoto } from "./optimize-photo.ts";

const source = process.argv[2];
if (!source) {
  console.error('Usage: npm run import-photos -- "<unzipped Drive folder>"');
  process.exit(1);
}

const contentFile = join(process.cwd(), "content", "gallery-photos.ts");
/** Photos smaller than this on their long edge look soft in large slots; flag them to Mason (D-24) */
const smallEdge = 1200;

// Map every folder first, so an unknown folder stops the run before anything is written.
const folders = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ dir: join(source, entry.name), category: categoryForFolder(entry.name) }))
  .sort((a, b) => a.dir.localeCompare(b.dir));

const files = folders.flatMap(({ dir, category }) =>
  readdirSync(dir)
    .filter((name) => !isSkippedFile(name))
    .sort()
    .map((name) => {
      const path = join(dir, name);
      return { path, category, hash: createHash("sha256").update(readFileSync(path)).digest("hex") };
    }),
);

const duplicates = new Set(findDuplicates(files));
const unreadable: string[] = [];
const small: string[] = [];
const entries: string[] = [];

for (const file of files.filter((f) => !duplicates.has(f.path))) {
  const outDir = join(process.cwd(), "public", "images", "media", file.category);
  mkdirSync(outDir, { recursive: true });
  const name = photoFileName(file.category, nextPhotoNumber(readdirSync(outDir), file.category));
  let size: { width: number; height: number };
  try {
    size = await optimizePhoto(file.path, join(outDir, name));
  } catch {
    // Not an image sharp can read (e.g. HEIC), or damaged: a header can read fine and the full decode still fail
    rmSync(join(outDir, name), { force: true });
    unreadable.push(file.path);
    continue;
  }
  const { width, height } = size;
  const src = `/images/media/${file.category}/${name}`;
  entries.push(renderGalleryEntry({ category: file.category, src, width, height }));
  if (Math.max(width, height) < smallEdge) small.push(`${src} (${width}×${height})`);
  console.log(`${file.path} → ${src}`);
}

writeFileSync(contentFile, appendGalleryEntries(readFileSync(contentFile, "utf8"), entries));

const list = (title: string, items: Iterable<string>) => {
  const all = [...items];
  if (all.length) console.log(`\n${title} (${all.length}):\n  ${all.join("\n  ")}`);
};
console.log(`\nImported ${entries.length} photos into content/gallery-photos.ts.`);
list("Skipped duplicates", duplicates);
list("Couldn't read (damaged: ask Mason to re-upload; HEIC: convert first, e.g. `sips -s format jpeg`)", unreadable);
list(`Small, under ${smallEdge} px: mention to Mason`, small);
console.log("\nNext: write the alt text for each new entry (empty alt fails the content tests).");
