import { expect, test, type Locator, type Page } from "./fixtures";

// Press feedback (D-42). A press is :active, which only a real browser computes, so these are e2e.
// Every control gets a small scale-down; visitors who ask for reduced motion get no movement but
// still see the control change (filter), so a press is never silent.
type Control = {
  label: string;
  path: string;
  /** Steps that must happen before the control exists (e.g. opening the resume dialog) */
  prepare?: (page: Page) => Promise<void>;
  find: (page: Page) => Locator;
};

const controls: Control[] = [
  { label: "primary button", path: "/", find: (p) => p.getByRole("button", { name: "View resume" }) },
  { label: "outline link button", path: "/", find: (p) => p.getByRole("link", { name: "View work" }) },
  { label: "carousel arrow", path: "/", find: (p) => p.getByRole("button", { name: "Next photo" }) },
  { label: "carousel thumbnail", path: "/", find: (p) => p.getByRole("button", { name: /^Show photo 2 of/ }) },
  { label: "gallery filter tab", path: "/media", find: (p) => p.getByRole("button", { name: "Concerts" }) },
  { label: "Load more", path: "/media", find: (p) => p.getByRole("button", { name: "Load more" }) },
  { label: "contact submit", path: "/contact", find: (p) => p.getByRole("button", { name: "Send message" }) },
  {
    label: "resume dialog close",
    path: "/",
    prepare: async (p) => {
      await p.getByRole("button", { name: "View resume" }).click();
    },
    find: (p) => p.getByRole("button", { name: "Close resume" }),
  },
];

/** The rendered width: Tailwind v4 scales with the `scale` property, which never shows in `transform`, but always shows here */
const width = (el: Locator) => el.evaluate((node) => node.getBoundingClientRect().width);

/** What a visitor could see change besides movement */
const look = (el: Locator) =>
  el.evaluate((node) => {
    const s = getComputedStyle(node);
    return [s.backgroundColor, s.color, s.opacity, s.filter].join("|");
  });

/** Hover first (hover has its own effects), then hold the mouse down: only the press is measured */
const press = async (page: Page, control: Locator) => {
  await control.scrollIntoViewIfNeeded();
  await control.hover();
  // Let hover transitions and the smooth scroll settle, so the next change is the press
  await page.waitForTimeout(500);
  const before = { width: await width(control), look: await look(control) };
  await page.mouse.down();
  return before;
};

test.describe("press feedback (D-42)", () => {
  for (const { label, path, prepare, find } of controls) {
    test(`${path}: the ${label} shrinks a little while pressed`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(path);
      await prepare?.(page);

      const control = find(page);
      const before = await press(page, control);

      // Smaller, but not far smaller: a nudge, not a collapse
      await expect.poll(async () => (await width(control)) / before.width).toBeLessThan(1);
      expect((await width(control)) / before.width).toBeGreaterThan(0.9);
      await page.mouse.up();
    });

    test(`${path}: the ${label} does not move when pressed with reduced motion, but still changes look`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await prepare?.(page);

      const control = find(page);
      const before = await press(page, control);

      await expect.poll(() => look(control)).not.toBe(before.look);
      expect(await width(control)).toBe(before.width);
      await page.mouse.up();
    });
  }
});
