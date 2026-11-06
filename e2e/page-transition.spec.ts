import { expect, test, type Page } from "./fixtures";

// Page changes crossfade the page content only (D-41). The crossfade is the browser's View Transitions
// API driven by React's <ViewTransition>, so only a real browser can show it. The init script wraps
// document.startViewTransition and records what the transition animates once it is ready.
type Recorded = {
  calls: number;
  /** Every view-transition-name in use at the moment the transition was ready */
  names: string[];
  animations: { target: string; duration: number; properties: string[] }[];
};

async function watchViewTransitions(page: Page) {
  await page.addInitScript(() => {
    const record: Recorded = { calls: 0, names: [], animations: [] };
    (window as unknown as { __vt: Recorded }).__vt = record;
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((callback?: ViewTransitionUpdateCallback) => {
      record.calls += 1;
      const transition = original(callback);
      transition.ready.then(() => {
        for (const element of document.querySelectorAll("*")) {
          const name = getComputedStyle(element).viewTransitionName;
          if (name !== "none") record.names.push(name);
        }
        for (const animation of document.getAnimations()) {
          const effect = animation.effect as KeyframeEffect;
          if (!effect.pseudoElement?.startsWith("::view-transition")) continue;
          const properties = new Set<string>();
          for (const frame of effect.getKeyframes()) {
            for (const name of Object.keys(frame)) {
              if (!["offset", "easing", "composite", "computedOffset"].includes(name)) properties.add(name);
            }
          }
          record.animations.push({
            target: effect.pseudoElement,
            duration: Number(effect.getTiming().duration),
            properties: [...properties],
          });
        }
      }, () => {});
      return transition;
    }) as typeof document.startViewTransition;
  });
}

const recorded = (page: Page) =>
  page.evaluate(() => (window as unknown as { __vt: Recorded }).__vt);

test.describe("page crossfade (D-41)", () => {
  // The nav links sit behind the Menu button on phones; the crossfade is the same code either way
  test.skip(({ isMobile }) => isMobile, "uses the desktop nav links");

  test("choosing About in the menu starts exactly one view transition", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await watchViewTransitions(page);
    await page.goto("/");

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);

    await expect.poll(async () => (await recorded(page)).calls).toBe(1);
  });

  test("the page content crossfades in 150 to 300 ms and the header and footer are not part of it", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await watchViewTransitions(page);
    await page.goto("/");

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect.poll(async () => (await recorded(page)).animations.length).toBeGreaterThan(0);

    const { animations, names } = await recorded(page);
    // The header and footer are pinned out of the page snapshot, and their groups get no animation
    expect(names).toEqual(expect.arrayContaining(["site-header", "site-footer"]));
    for (const animation of animations) {
      // Opacity fades only (mix-blend-mode is the browser's own way to keep a crossfade from dimming); nothing moves or resizes
      expect(animation.properties, animation.target).not.toEqual(expect.arrayContaining(["transform"]));
      expect(animation.properties, animation.target).not.toEqual(expect.arrayContaining(["width"]));
      expect(animation.duration, animation.target).toBeGreaterThanOrEqual(150);
      expect(animation.duration, animation.target).toBeLessThanOrEqual(300);
      expect(animation.target).not.toMatch(/site-header|site-footer/);
    }
    expect(animations.some((animation) => animation.properties.includes("opacity"))).toBe(true);
  });

  test("nothing animates when the visitor asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await watchViewTransitions(page);
    await page.goto("/");

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    // Give a transition time to start and be recorded, if one were going to animate
    await page.waitForTimeout(600);

    // Zero-length animations are the browser's own bookkeeping on the groups and move nothing; they appear on some runs
    const { animations } = await recorded(page);
    expect(animations.filter((animation) => animation.duration > 0)).toEqual([]);
  });
});
