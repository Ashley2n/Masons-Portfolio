"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/content/site";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function NavLinks({ className, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={cn("caption-text flex", className)}>
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "border-b-2 pb-1 transition-colors duration-300 hover:text-neutral-100",
                active
                  ? "border-brand-600 text-neutral-100"
                  : "border-transparent text-neutral-300",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
