import { expect, test } from "@playwright/test";

// Pages whose hero has a decorative glow that could spill over the footer
const pagesWithGlows = ["/about", "/contact", "/this-page-does-not-exist"];

test.describe("footer", () => {
  for (const path of pagesWithGlows) {
    test(`every footer link on ${path} can be clicked (the hero glow doesn't block it)`, async ({ page }) => {
      await page.goto(path);
      const links = page.getByRole("contentinfo").getByRole("link");

      for (const name of await links.allTextContents()) {
        // `trial` runs the actionability checks (incl. "another element would receive
        // the click") without navigating away
        await links.filter({ hasText: name }).click({ trial: true, timeout: 5_000 });
      }
    });
  }

  test("has no empty column on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "the footer stacks into one column on phones");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const grid = page.getByRole("contentinfo").locator(":scope > div");
    const { tracks, columns } = await grid.evaluate((element) => ({
      tracks: getComputedStyle(element).gridTemplateColumns.split(" ").length,
      columns: element.children.length,
    }));
    expect(tracks).toBe(columns);
  });
});
