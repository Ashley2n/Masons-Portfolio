import type { Metadata } from "next";
import "./globals.css";
import { inter, playfairDisplay, signature, spaceMono } from "@/lib/fonts";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/content/site";
import { defaultTitle } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Lets Next.js turn smooth scrolling off during page navigations (keeps it for #links)
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceMono.variable} ${playfairDisplay.variable} ${signature.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
