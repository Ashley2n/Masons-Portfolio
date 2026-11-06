import { contrastRatio, toRgb } from "./color";
import { expect, test } from "./fixtures";

test.describe("buttons (D-39)", () => {
  // Pages where View resume is the one primary action
  for (const path of ["/", "/about"]) {
    test(`${path}: the primary button is filled brand purple and passes AA`, async ({ page }) => {
      await page.goto(path);

      const primary = page.getByRole("button", { name: "View resume" });
      const [background, text] = await Promise.all([
        primary.evaluate((el) => getComputedStyle(el).backgroundColor),
        primary.evaluate((el) => getComputedStyle(el).color),
      ]);
      const [backgroundRgb, textRgb] = [await toRgb(page, background), await toRgb(page, text)];

      // brand-600 #8A2CF6 from docs/design-system.md, written out on purpose so a token change fails here
      expect(backgroundRgb).toBe("rgb(138, 44, 246)");
      expect(contrastRatio(textRgb, backgroundRgb)).toBeGreaterThanOrEqual(4.5); // WCAG AA, small text
    });
  }
});
