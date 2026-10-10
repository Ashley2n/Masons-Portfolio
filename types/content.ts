export type NavLink = {
  label: string;
  href: string;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export type ExpertiseItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Tailwind background class for the card */
  colorClass: string;
};

export type Video = {
  id: string;
  title: string;
  date: string;
  href: string;
};

export type ModelShot = {
  id: string;
  src: string;
  alt: string;
  /** Photographer and source, for stock photos (D-11) */
  credit?: string;
};
