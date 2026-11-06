import { contrastRatio, toRgb } from "./color";
import { expect, test } from "./fixtures";

// Homepage section rhythm (D-39, 3.3): light and dark bands alternate, top to bottom.
// The literals are neutral-100 and neutral-950 from docs/design-system.md, written out on
// purpose so a token change fails here.
const surfaces = {
  light: "rgb(245, 245, 245)",
  dark: "rgb(10, 10, 10)",
} as const;

const rhythm = [
  { heading: "Model Shots", mode: "light" },
  { heading: "The Journey So Far", mode: "dark" },
  { heading: "What I Do", mode: "light" },
  { heading: "Recent Work", mode: "dark" },
] as const;

test.describe("homepage section rhythm (D-39)", () => {
  for (const { heading, mode } of rhythm) {
    test(`"${heading}" is a ${mode} band and its text passes AA`, async ({ page }) => {
      await page.goto("/");

      const section = page
        .getByRole("heading", { name: heading, exact: true, level: 2 })
        .locator("xpath=ancestor::section[1]");
      const background = await toRgb(
        page,
        await section.evaluate((el) => getComputedStyle(el).backgroundColor),
      );
      expect(background).toBe(surfaces[mode]);

      // Every piece of text that sits directly on the band. Text over photos has its own
      // overlay (expertise cards, video frames, the carousel) and is not part of this check.
      const colors = await section.evaluate((root) => {
        const out: { text: string; color: string }[] = [];
        for (const el of root.querySelectorAll<HTMLElement>("*")) {
          const own = [...el.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent?.trim() ?? "")
            .join("");
          if (!own) continue;
          if (el.closest("[class*='bg-neutral-800'], ul[aria-label='Expertise']")) continue;
          const box = el.getBoundingClientRect();
          if (box.width < 2 || box.height < 2) continue; // screen-reader-only text
          out.push({ text: own, color: getComputedStyle(el).color });
        }
        return out;
      });

      expect(colors.length).toBeGreaterThan(0);
      for (const { text, color } of colors) {
        const ratio = contrastRatio(await toRgb(page, color), background);
        expect(ratio, `"${text}" (${color}) on the ${mode} band`).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  test("the four bands appear top to bottom in that order", async ({ page }) => {
    await page.goto("/");

    const tops: number[] = [];
    for (const { heading } of rhythm) {
      const box = await page
        .getByRole("heading", { name: heading, exact: true, level: 2 })
        .boundingBox();
      tops.push(box!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
  });
});

// Hero roles line (D-39, 3.3): "slightly larger" than the old 12px caption.
// The floors are written out in px on purpose: they are the decision, not a token.
test.describe("hero roles line (D-39)", () => {
  const sizes = [
    { width: 1280, height: 800, minPx: 16 },
    { width: 390, height: 844, minPx: 14 },
  ];

  for (const { width, height, minPx } of sizes) {
    test(`is at least ${minPx}px at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");

      const fontSize = await page
        .getByRole("list", { name: "Roles" })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(minPx);
    });
  }
});
