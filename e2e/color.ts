import type { Page } from "./fixtures";

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

/** WCAG contrast ratio between two "rgb(r, g, b)" colors. */
export const contrastRatio = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

/** Computed colors can be in lab()/oklch(); a canvas converts them to rgb. */
export const toRgb = (page: Page, color: string) =>
  page.evaluate((value) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, color);
