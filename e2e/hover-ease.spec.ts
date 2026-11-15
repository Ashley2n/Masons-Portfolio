import { expect, test, type Locator, type Page } from "./fixtures";

// D-47: every clickable control changes its background and text colour with the same ease-in-out, 250ms.
// The browser reports the declared transition, so this reads it from the computed style (a hover itself is
// not reliable to measure mid-way, and the phone project has no hover).
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
  { label: "footer link", path: "/", find: (p) => p.getByRole("contentinfo").getByRole("link", { name: "About" }) },
  { label: "carousel arrow", path: "/", find: (p) => p.getByRole("button", { name: "Next photo" }) },
  { label: "gallery filter tab", path: "/media", find: (p) => p.getByRole("button", { name: "Concerts" }) },
  { label: "Load more", path: "/media", find: (p) => p.getByRole("button", { name: "Load more" }) },
  { label: "contact submit", path: "/contact", find: (p) => p.getByRole("button", { name: "Send message" }) },
  // Not by name: the contact card's rows show his number, which never goes in a test (D-35)
  { label: "contact card email link", path: "/contact", find: (p) => p.locator('a[href^="mailto:"]').first() },
  {
    label: "resume dialog close",
    path: "/",
    prepare: async (p) => {
      await p.getByRole("button", { name: "View resume" }).click();
    },
    find: (p) => p.getByRole("button", { name: "Close resume" }),
  },
];

test.describe("colour changes ease in and out", () => {
  for (const control of controls) {
    test(`${control.label} eases its colour in and out over 250ms`, async ({ page }) => {
      await page.goto(control.path);
      await control.prepare?.(page);
      const style = await control.find(page).evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          property: s.transitionProperty,
          duration: s.transitionDuration,
          timing: s.transitionTimingFunction,
        };
      });

      expect(style.property, "a colour is what changes").toMatch(/color/);
      for (const duration of style.duration.split(", ")) expect(duration).toBe("0.25s");
      for (const timing of style.timing.split(/,\s*(?![^(]*\))/)) expect(timing).toBe("ease-in-out");
    });
  }
});
