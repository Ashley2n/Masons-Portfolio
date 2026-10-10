import { Inter, Playfair_Display, Space_Mono } from "next/font/google";

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
  weight: ["400", "700"],
  style: ["italic", "normal"],
  variable: "--next-font-space-mono",
});
