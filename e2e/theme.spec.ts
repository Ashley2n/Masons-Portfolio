import { expect, test, type Page } from "@playwright/test";

// Relative luminance (WCAG) of a computed "rgb(r, g, b)" color.
const luminance = (rgb: string) => {
  const [r, g, b] = rgb
    .match(/\d+(\.\d+)?/g)!
    .slice(0, 3)
    .map((value) => {
      const channel = Number(value) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

// Computed colors can be in lab()/oklch(); a canvas converts them to rgb.
const toRgb = (page: Page, color: string) =>
  page.evaluate((value) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, color);

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`with a ${colorScheme} OS theme`, () => {
    test.use({ colorScheme });

    test("the hero name is readable on the dark background", async ({ page }) => {
      await page.goto("/");

      const name = page.getByText(/Mason\s*Farrington/).first();
      const textColor = await name.evaluate((el) => getComputedStyle(el).color);
      // The visible background is the nearest ancestor with a non-transparent
      // background; if there is none, browsers show white.
      const background = await name.evaluate((el) => {
        for (let node: Element | null = el; node; node = node.parentElement) {
          const color = getComputedStyle(node).backgroundColor;
          if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") return color;
        }
        return "rgb(255, 255, 255)";
      });

      const ratio = contrastRatio(
        await toRgb(page, textColor),
        await toRgb(page, background),
      );
      expect(ratio).toBeGreaterThan(4.5); // WCAG AA
    });
  });
}
