"use client";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavLinks from "./NavLinks";

export default function MobileMenu() {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // The page the menu was opened on. Navigating anywhere else closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = () => setOpenedOn(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenedOn(null);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpenedOn(open ? null : pathname)}
        className="relative z-50 -mr-1.5 grid size-11 place-items-center text-neutral-100"
      >
        {open ? (
          <X aria-hidden="true" className="size-6" />
        ) : (
          <Menu aria-hidden="true" className="size-6" />
        )}
        <span className="sr-only">Menu</span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          // Fills the screen under the logo and Menu button (both z-50); the page behind it is locked in globals.css
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-neutral-900 pt-(--header-height)"
        >
          {/* onNavigate also closes the menu when the link is the current page */}
          <NavLinks
            className="flex-col items-center gap-2"
            linkClassName="inline-flex min-h-11 items-center justify-center text-small"
            onNavigate={close}
          />
        </nav>
      )}
    </div>
  );
}
