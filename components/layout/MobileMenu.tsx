"use client";
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
        className="caption-text text-neutral-100 focus-visible:outline-2 focus-visible:outline-brand-400"
      >
        Menu
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full z-50 border-b border-neutral-800 bg-neutral-950 px-4 py-6"
        >
          {/* onNavigate also closes the menu when the link is the current page */}
          <NavLinks className="flex-col gap-6" onNavigate={close} />
        </nav>
      )}
    </div>
  );
}
