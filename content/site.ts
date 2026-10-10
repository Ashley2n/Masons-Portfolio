import type { ContactInfo, NavLink, SocialLink } from "@/types/content";

export const siteConfig = {
  name: "Mason Farrington",
  tagline: "Actor, Musician, Singer & Designer",
  description:
    "Mason Farrington is a multidisciplinary artist creating meaningful experiences through performance and design.",
};

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Media", href: "/media" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export const contactInfo: ContactInfo = {
  email: "masonfarrington@gmail.com",
  location: "Los Angeles, CA",
};

export const socialLinks: SocialLink[] = [
  // TODO(Q C7): replace with Mason's real profile URLs
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
  { id: "email", label: "Email", href: `mailto:${contactInfo.email}` },
];

export const ctaBanner = {
  title: "Interested in working together?",
  buttonLabel: "Get in touch",
  href: "/contact",
};
