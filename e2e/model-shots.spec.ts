import { expect, test } from "./fixtures";

// The swipe test sends real touch events; Desktop Chrome has no touch unless asked
test.use({ hasTouch: true });

// Model Shots carousel (D-39, 3.3). Floors are written out in px on purpose: they are the decision.
test.describe("Model Shots carousel (D-39)", () => {
  const thumbnailSizes = [
    { width: 1280, height: 800, minPx: 96 },
    { width: 390, height: 844, minPx: 56 },
  ];

  for (const { width, height, minPx } of thumbnailSizes) {
    test(`thumbnails are at least ${minPx}px and all fit at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");

      const thumbnails = page.getByRole("button", { name: /^Show photo \d+ of \d+$/ });
      const count = await thumbnails.count();
      expect(count).toBeGreaterThan(1);
      for (let i = 0; i < count; i++) {
        const box = (await thumbnails.nth(i).boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(minPx);
        expect(box.height).toBeGreaterThanOrEqual(minPx);
        // nothing pushed off the right edge of the screen
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
    });
  }

  test("swiping left on the photo moves to the next photo and keeps the thumbnails in sync", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const section = page.getByRole("region", { name: "Model Shots" });
    await section.scrollIntoViewIfNeeded();
    const total = await section.getByRole("button", { name: /^Show photo \d+ of \d+$/ }).count();
    await expect(section.getByText(`Photo 1 of ${total}`)).toBeAttached();

    // A real finger swipe: touch events through the Chrome DevTools Protocol, right to left across the photo.
    // (The page's smooth scrolling must settle first or the photo is not where we measured it.)
    await page.waitForTimeout(800);
    const box = (await section.getByRole("img").first().boundingBox())!;
    const y = box.y + box.height / 2;
    const [from, to] = [box.x + box.width * 0.8, box.x + box.width * 0.2];
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: "touchStart" | "touchMove" | "touchEnd", x?: number) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: x === undefined ? [] : [{ x, y }],
      });
    await touch("touchStart", from);
    for (let step = 1; step <= 10; step++) await touch("touchMove", from + ((to - from) * step) / 10);
    await touch("touchEnd");

    await expect(section.getByText(`Photo 2 of ${total}`)).toBeAttached();
    await expect(section.getByRole("button", { name: `Show photo 2 of ${total}` })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("the photo track snaps: a half-finished swipe settles on a whole photo", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const section = page.getByRole("region", { name: "Model Shots" });
    await section.scrollIntoViewIfNeeded();
    const photo = section.getByRole("img").first();

    // The photo's nearest horizontally scrollable ancestor is the track
    const snapType = await photo.evaluate((el) => {
      let node = el.parentElement;
      while (node && !["auto", "scroll"].includes(getComputedStyle(node).overflowX)) {
        node = node.parentElement;
      }
      return node ? getComputedStyle(node).scrollSnapType : null;
    });
    expect(snapType).toMatch(/^x mandatory/);

    // Drag 60% of the way to the next photo; it must settle exactly on photo 2, not stay between
    await photo.evaluate((el) => {
      let node = el.parentElement!;
      while (!["auto", "scroll"].includes(getComputedStyle(node).overflowX)) node = node.parentElement!;
      node.scrollTo({ left: node.clientWidth * 0.6, behavior: "instant" });
    });
    await expect
      .poll(() =>
        photo.evaluate((el) => {
          let node = el.parentElement!;
          while (!["auto", "scroll"].includes(getComputedStyle(node).overflowX)) node = node.parentElement!;
          return Math.abs(node.scrollLeft - node.clientWidth) < 1;
        }),
      )
      .toBe(true);
  });
});
