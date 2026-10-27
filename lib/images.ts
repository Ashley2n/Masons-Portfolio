// Pure helpers for scripts/import-photos.ts (D-25). No sharp or file system here, so they stay unit-testable.

/** Drive folder names (lowercase) → gallery category (D-23) */
export const folderCategories = {
  "concert performances": "concerts",
  "recital performances": "recital",
  "staged performances": "staged",
  modeling: "modeling",
  designs: "design",
} as const;

export type PhotoCategory = (typeof folderCategories)[keyof typeof folderCategories];

/** The import script appends new photos above this line in content/gallery-photos.ts */
export const galleryEntriesMarker = "// import-photos: new photos go above this line";

export const categoryForFolder = (folder: string): PhotoCategory => {
  const key = folder.trim().toLowerCase();
  if (key in folderCategories) return folderCategories[key as keyof typeof folderCategories];
  const known = Object.keys(folderCategories).map((name) => name.replace(/\b\w/g, (c) => c.toUpperCase()));
  throw new Error(`Unknown Drive folder "${folder.trim()}". Expected one of: ${known.join(", ")}`);
};

/** Notes and system files; everything else is handed to sharp, which reads the real type */
export const isSkippedFile = (name: string) => name.startsWith(".") || /\.(md|txt)$/i.test(name);

export const photoFileName = (category: PhotoCategory, n: number) =>
  `${category}-${String(n).padStart(2, "0")}.jpg`;

export const nextPhotoNumber = (existing: string[], category: PhotoCategory) => {
  const pattern = new RegExp(`^${category}-(\\d+)\\.jpg$`);
  const numbers = existing.map((name) => Number(pattern.exec(name)?.[1] ?? 0));
  return Math.max(0, ...numbers) + 1;
};

export const findDuplicates = (files: { path: string; hash: string }[]) => {
  const seen = new Set<string>();
  return files.flatMap(({ path, hash }) => {
    if (seen.has(hash)) return [path];
    seen.add(hash);
    return [];
  });
};

type NewPhoto = { category: PhotoCategory; src: string; width: number; height: number };

export const renderGalleryEntry = ({ category, src, width, height }: NewPhoto) => {
  const id = src.split("/").pop()!.replace(/\.jpg$/, "");
  return `{ id: "${id}", category: "${category}", src: "${src}", alt: "", width: ${width}, height: ${height} },`;
};

export const appendGalleryEntries = (source: string, entries: string[]) => {
  if (!source.includes(galleryEntriesMarker)) {
    throw new Error(`content/gallery-photos.ts is missing the marker line: ${galleryEntriesMarker}`);
  }
  const lines = entries.map((entry) => `  ${entry}\n`).join("");
  return source.replace(`  ${galleryEntriesMarker}`, `${lines}  ${galleryEntriesMarker}`);
};
