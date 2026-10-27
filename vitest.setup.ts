import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font is compiled by Next.js at build time and can't run in Vitest.
// Each font loader returns a stub with the same shape. Add new fonts here.
vi.mock("next/font/google", () => {
  const loader = (options: { variable?: string } = {}) => ({
    className: "font-stub",
    variable: options.variable ?? "",
    style: { fontFamily: "stub" },
  });
  return { Inter: loader, Mrs_Saint_Delafield: loader, Playfair_Display: loader, Space_Mono: loader };
});

// jsdom doesn't implement <dialog>'s showModal()/close(). Minimal stand-ins: real browsers
// (and the Playwright tests) provide the full behavior, e.g. Escape and focus trapping.
// Skipped in `@vitest-environment node` files (scripts/), which have no DOM.
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

afterEach(() => {
  cleanup();
});
