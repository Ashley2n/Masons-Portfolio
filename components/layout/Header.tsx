import Link from "next/link";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/content/site";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="relative">
      <Container className="flex items-center justify-between py-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="font-playfair text-3xl italic text-neutral-100"
        >
          MF
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <NavLinks className="gap-12" />
        </nav>

        <MobileMenu />
      </Container>
    </header>
  );
}
