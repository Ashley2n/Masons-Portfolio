import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import { contactInfo, footerContent, navLinks, siteConfig, socialLinks } from "@/content/site";

const linkClass = "transition-colors duration-300 hover:text-neutral-100";

const FooterColumn = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-4">
    <h2 className="font-inter text-small font-semibold uppercase text-neutral-100">{title}</h2>
    {children}
  </div>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 text-small">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-playfair text-3xl italic text-neutral-100">MF</p>
          <p>
            © {year} {siteConfig.name}.
            <br />
            {footerContent.rightsReserved}
          </p>
        </div>

        <FooterColumn title={footerContent.columns.navigation}>
          <nav aria-label="Footer">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </FooterColumn>

        <FooterColumn title={footerContent.columns.connect}>
          <ul className="space-y-2">
            {socialLinks.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className={linkClass}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </FooterColumn>

        <FooterColumn title={footerContent.columns.contact}>
          <ul className="space-y-2">
            <li>
              <a href={`mailto:${contactInfo.email}`} className={linkClass}>
                {contactInfo.email}
              </a>
            </li>
            <li>{contactInfo.location}</li>
          </ul>
        </FooterColumn>
      </Container>
    </footer>
  );
}
