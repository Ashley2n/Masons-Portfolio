"use client";
import { useEffect, useState } from "react";
import NavLinks from "./NavLinks";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
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
          <NavLinks className="flex-col gap-6" onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
