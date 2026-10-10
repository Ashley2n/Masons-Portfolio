import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { inter, playfairDisplay, spaceMono } from "./fonts";

const globalsCss = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

describe("font variables", () => {
  it.each([
    ["playfair", playfairDisplay],
    ["inter", inter],
    ["space", spaceMono],
  ])("maps the next/font variable to the font-%s theme token", (token, font) => {
    expect(font.variable).not.toBe(`--font-${token}`);
    expect(globalsCss).toContain(`--font-${token}: var(${font.variable})`);
  });

  it("has no theme token that references itself", () => {
    const selfReferences = [...globalsCss.matchAll(/(--[\w-]+):\s*var\(\1\)/g)];
    expect(selfReferences.map(([match]) => match)).toEqual([]);
  });
});
