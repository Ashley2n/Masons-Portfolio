import { contrastRatio, toRgb } from "./color";
import { expect, test } from "./fixtures";

test.describe("buttons (D-39)", () => {
  // The one primary action on each page
  const primaries = [
    { path: "/", role: "button", name: "View resume" },
    { path: "/about", role: "button", name: "View resume" },
    { path: "/contact", role: "button", name: "Send message" },
    { path: "/resume", role: "link", name: "Download PDF" },
  ] as const;

  for (const { path, role, name } of primaries) {
    test(`${path}: the primary ${role} "${name}" is filled brand purple and passes AA`, async ({
      page,
    }) => {
      await page.goto(path);

      const primary = page.getByRole(role, { name });
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

// D-50: the primary and outline buttons are lit from above (a light top edge inside, a soft coloured glow
// outside) and share one 12px corner. The values are written out on purpose so a token change fails here.
test.describe("button surface (D-50)", () => {
  const buttons = [
    { label: "primary", find: (p: import("@playwright/test").Page) => p.getByRole("button", { name: "View resume" }) },
    { label: "outline", find: (p: import("@playwright/test").Page) => p.getByRole("link", { name: "View work" }) },
  ];

  for (const { label, find } of buttons) {
    test(`the ${label} button has a 12px corner and a light top edge inside`, async ({ page }) => {
      await page.goto("/");

      const style = await find(page).evaluate((el) => {
        const s = getComputedStyle(el);
        return { radius: s.borderTopLeftRadius, shadow: s.boxShadow };
      });

      expect(style.radius).toBe("12px");
      expect(style.shadow, "an inset highlight along the top edge").toMatch(/inset/);
    });
  }

  for (const { label, find } of buttons) {
    test(`the light layer on the ${label} button rises on hover`, async ({ page, isMobile }) => {
      test.skip(isMobile, "the phone project has no hover");
      await page.goto("/");
      const button = find(page);
      const layer = () => button.evaluate((el) => Number(getComputedStyle(el, "::before").opacity));
      const rest = await layer();

      await button.hover();

      await expect.poll(layer, { timeout: 2000 }).toBeGreaterThan(rest);
    });
  }

  test("the primary glow grows on hover", async ({ page, isMobile }) => {
    test.skip(isMobile, "the phone project has no hover");
    await page.goto("/");
    const primary = page.getByRole("button", { name: "View resume" });
    const rest = await primary.evaluate((el) => getComputedStyle(el).boxShadow);

    await primary.hover();

    await expect
      .poll(() => primary.evaluate((el) => getComputedStyle(el).boxShadow), { timeout: 2000 })
      .not.toBe(rest);
  });
});
