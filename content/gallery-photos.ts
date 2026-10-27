import type { PhotoCategory } from "@/lib/images";

export type GalleryPhoto = {
  id: string;
  category: PhotoCategory;
  src: string;
  /** Written by Ashley for every photo (D-18); the import script leaves it empty */
  alt: string;
  width: number;
  height: number;
};

// Mason's photos, added by `npm run import-photos` (D-25). Edit the alt text by hand; leave the marker.
export const galleryPhotos: GalleryPhoto[] = [
  // import-photos: new photos go above this line
];
