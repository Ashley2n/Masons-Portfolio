export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type ContactInfo = {
  email: string;
  location: string;
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

export type Photo = {
  /** Path under public/, e.g. /images/home/hero-portrait.jpg */
  src: string;
  alt: string;
  /** Photographer and source, for stock photos (D-11) */
  credit?: string;
};

export type ModelShot = Photo & { id: string };

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
};
