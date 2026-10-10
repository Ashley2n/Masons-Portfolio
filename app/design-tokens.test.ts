import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

const tokenValue = (name: string) =>
  globalsCss.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();

// Type scale from docs/design-system.md (px / line-height)
const typeScale = [
  ["hero", "6.25rem", "1.1"], // 100px, hero name (D-14)
  ["display", "4rem", "1.1"], // 64px
  ["h1", "3rem", "1.15"], // 48px
  ["h2", "1.75rem", "1.25"], // 28px
  ["h3", "1.25rem", "1.4"], // 20px
  ["body", "1rem", "1.7"], // 16px
  ["small", "0.875rem", "1.7"], // 14px
  ["caption", "0.75rem", "1.6"], // 12px
] as const;

describe("type scale tokens", () => {
  it.each(typeScale)("text-%s is %s with line-height %s", (name, size, lineHeight) => {
    expect(tokenValue(`--text-${name}`)).toBe(size);
    expect(tokenValue(`--text-${name}--line-height`)).toBe(lineHeight);
  });
});

describe("brand palette tokens", () => {
  it.each([
    ["100", "#F2E6FE"],
    ["200", "#E6CFFE"],
    ["300", "#D9B5FD"],
    ["400", "#C09CFD"],
    ["500", "#A78BFA"],
    ["600", "#8A2CF6"],
    ["700", "#7234E5"],
    ["800", "#4D3565"],
  ])("brand-%s is %s", (step, hex) => {
    expect(tokenValue(`--color-brand-${step}`)).toBe(hex);
  });
});
