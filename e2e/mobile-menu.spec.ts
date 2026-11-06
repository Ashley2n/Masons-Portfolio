import { expect, test } from "./fixtures";

// jsdom can't measure layout, so the open panel's shape is checked in a real browser (D-39, spec 3.1)
test.describe("mobile menu at 390px", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await page.getByRole("button", { name: "Menu" }).click();
  });

  test("covers the whole viewport without scrolling sideways", async ({ page }) => {
    const box = await page.getByRole("navigation", { name: "Mobile" }).boundingBox();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(box).toMatchObject({ x: 0, y: 0, width: 390, height: 844 });
    expect(overflows).toBe(false);
  });

  test("keeps the page behind it from scrolling", async ({ page }) => {
    await page.mouse.move(195, 600);
    await page.mouse.wheel(0, 600);
    // The page scrolls smoothly, so give a scroll that was not blocked time to start
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("keeps the Menu button on top so it can close the menu", async ({ page }) => {
    // Playwright refuses to click an element another element covers
    await page.getByRole("button", { name: "Menu" }).click();

    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("centres every link in the panel", async ({ page }) => {
    const panel = page.getByRole("navigation", { name: "Mobile" });
    const panelBox = await panel.boundingBox();
    const links = panel.getByRole("link");

    for (const name of ["About", "Media", "Contact"]) {
      const box = await links.filter({ hasText: name }).boundingBox();
      const linkCentre = box!.x + box!.width / 2;
      expect(Math.abs(linkCentre - (panelBox!.x + panelBox!.width / 2)), name).toBeLessThanOrEqual(4);
    }
  });

  test("gives every link a tap target at least 44px tall", async ({ page }) => {
    const links = page.getByRole("navigation", { name: "Mobile" }).getByRole("link");

    for (const name of ["About", "Media", "Contact"]) {
      const box = await links.filter({ hasText: name }).boundingBox();
      expect(box!.height, name).toBeGreaterThanOrEqual(44);
    }
  });
});
