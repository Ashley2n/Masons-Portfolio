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
  // phone: "+1 (___) ___-____", // Ashley adds Mason's real number here (Q C3)
  location: "Los Angeles, CA",
};

export const socialLinks: SocialLink[] = [
  // Hidden until Mason sends his profile URLs (Q C7). Add them back like:
  // { id: "instagram", label: "Instagram", href: "https://www.instagram.com/<handle>/" },
  // { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@<handle>" },
  { id: "email", label: "Email", href: `mailto:${contactInfo.email}` },
];

export const ctaBanner = {
  title: "Interested in working together?",
  buttonLabel: "Get in touch",
  href: "/contact",
};

export const footerContent = {
  rightsReserved: "All rights reserved.",
  columns: { navigation: "Navigation", connect: "Connect", contact: "Contact" },
};
