import type { Metadata } from "next";
import "./globals.css";
import { inter, playfairDisplay, spaceMono } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col dark:bg-neutral-950">
        <Header/>
        {children}
        </body>
    </html>
  );
}
