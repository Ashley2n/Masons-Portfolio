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

afterEach(() => {
  cleanup();
});
