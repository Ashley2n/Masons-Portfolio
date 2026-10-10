import { Inter, Mrs_Saint_Delafield, Playfair_Display, Space_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--next-font-inter",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--next-font-playfair",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--next-font-space-mono",
});

// Placeholder for Mason's handwritten signature on the About page (Q C13)
export const signature = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--next-font-signature",
  preload: false,
});
