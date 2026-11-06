import { expect, test } from "./fixtures";

// jsdom can't measure layout, so the open panel's shape is checked in a real browser (D-39, spec 3.1)
test.describe("mobile menu at 390px", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await page.getByRole("button", { name: "Menu" }).click();
    // The panel slides up as it opens (D-41); measure it once it has settled
    await page
      .getByRole("navigation", { name: "Mobile" })
      .evaluate((panel) => Promise.all(panel.getAnimations().map((animation) => animation.finished)));
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

// The menu fades in and out (D-41). Opacity only; the exit is quicker than the entrance. The panel stays
// in the page until its fade ends, and the page behind it scrolls again only once it is gone.
test.describe("mobile menu fade at 390px", () => {
  type CloseResult = { ms: number; overflowAfter: string; midway: { present: boolean; overflow: string } | null };

  // Clicks the Menu button inside the page so the timing has no test-runner round trips in it
  const closeAndMeasure = (page: import("./fixtures").Page) =>
    page.evaluate(
      () =>
        new Promise<CloseResult>((resolve) => {
          const html = document.documentElement;
          const button = document.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]')!;
          let midway: CloseResult["midway"] = null;
          const started = performance.now();
          const observer = new MutationObserver(() => {
            if (document.getElementById("mobile-menu")) return;
            observer.disconnect();
            resolve({ ms: performance.now() - started, overflowAfter: getComputedStyle(html).overflow, midway });
          });
          observer.observe(document.body, { childList: true, subtree: true });
          setTimeout(() => {
            midway = {
              present: document.getElementById("mobile-menu") !== null,
              overflow: getComputedStyle(html).overflow,
            };
          }, 50);
          button.click();
        }),
    );

  const toMs = (value: string) => parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
  });

  // Clicks Menu inside the page, then reads the animation the panel and the button's icon just started
  const openAndInspect = (page: import("./fixtures").Page) =>
    page.evaluate(async () => {
      const button = document.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]')!;
      button.click();
      // One frame for React to commit; every animation here lasts longer than that
      await new Promise(requestAnimationFrame);
      const describe = (element: Element | null) =>
        (element?.getAnimations() ?? []).map((animation) => {
          const effect = animation.effect as KeyframeEffect;
          const properties = new Set<string>();
          for (const frame of effect.getKeyframes()) {
            for (const name of Object.keys(frame)) {
              if (!["offset", "easing", "composite", "computedOffset"].includes(name)) properties.add(name);
            }
          }
          return { duration: Number(effect.getTiming().duration), properties: [...properties] };
        });
      return {
        panel: describe(document.getElementById("mobile-menu")),
        icon: describe(button.querySelector("svg")),
      };
    });

  test("opening slides the panel up while it fades in, over 150 to 300 ms", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });

    const { panel } = await openAndInspect(page);

    expect(panel).toHaveLength(1);
    expect(panel[0].properties).toEqual(expect.arrayContaining(["opacity", "transform"]));
    expect(panel[0].duration).toBeGreaterThanOrEqual(150);
    expect(panel[0].duration).toBeLessThanOrEqual(300);
  });

  test("the Menu button's icon turns into place each time it swaps, in under 300 ms", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });

    const opened = await openAndInspect(page);
    const closed = await openAndInspect(page);

    for (const { icon } of [opened, closed]) {
      expect(icon).toHaveLength(1);
      expect(icon[0].properties).toEqual(expect.arrayContaining(["transform"]));
      expect(icon[0].duration).toBeLessThanOrEqual(300);
    }
  });

  test("closing keeps the panel for 100 to 200 ms, quicker than opening, and the page stays locked until it is gone", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "Menu" }).click();
    const panel = page.getByRole("navigation", { name: "Mobile" });
    await expect(panel).toBeVisible();
    const openDuration = toMs(await panel.evaluate((el) => getComputedStyle(el).animationDuration));

    const result = await closeAndMeasure(page);

    expect(result.midway).toEqual({ present: true, overflow: "hidden" });
    expect(result.ms).toBeGreaterThanOrEqual(100);
    expect(result.ms).toBeLessThanOrEqual(200);
    expect(result.ms).toBeLessThan(openDuration);
    expect(result.overflowAfter).not.toBe("hidden");
  });

  test("nothing animates, and opening, closing and unlocking the page are immediate, when the visitor asks for reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Menu" }).click();
    const panel = page.getByRole("navigation", { name: "Mobile" });
    await expect(panel).toHaveCSS("animation-name", "none");
    await expect(page.getByRole("button", { name: "Menu" }).locator("svg")).toHaveCSS("animation-name", "none");

    const result = await closeAndMeasure(page);

    expect(result.ms).toBeLessThan(50);
    expect(result.overflowAfter).not.toBe("hidden");
  });
});
