import { contrastRatio, toRgb } from "./color";
import { expect, test } from "./fixtures";

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
