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
// outside) and share the original 6px corner. The values are written out on purpose so a token change fails here.
test.describe("button surface (D-50)", () => {
  const buttons = [
    { label: "primary", find: (p: import("@playwright/test").Page) => p.getByRole("button", { name: "View resume" }) },
    { label: "outline", find: (p: import("@playwright/test").Page) => p.getByRole("link", { name: "View work" }) },
  ];

  for (const { label, find } of buttons) {
    test(`the ${label} button has the original 6px corner and a light top edge inside`, async ({ page }) => {
      await page.goto("/");

      const style = await find(page).evaluate((el) => {
        const s = getComputedStyle(el);
        return { radius: s.borderTopLeftRadius, shadow: s.boxShadow };
      });

      expect(style.radius).toBe("6px");
      expect(style.shadow, "an inset highlight along the top edge").toMatch(/inset/);
    });
  }

  test("the light layer on the primary button rises on hover", async ({ page, isMobile }) => {
    test.skip(isMobile, "the phone project has no hover");
    await page.goto("/");
    const button = buttons[0].find(page);
    const layer = () => button.evaluate((el) => Number(getComputedStyle(el, "::before").opacity));
    const rest = await layer();

    await button.hover();

    await expect.poll(layer, { timeout: 2000 }).toBeGreaterThan(rest);
  });

  // The secondary is a soft purple tint with pale purple text (tonal), so it reads as the primary's quieter sibling
  test("the secondary button is a purple tint with pale purple text that passes AA, and the tint deepens on hover", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    const secondary = page.getByRole("link", { name: "View work" });
    const colors = () =>
      secondary.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, text: getComputedStyle(el).color }));
    const rest = colors();
    const [bg, text] = [await toRgb(page, (await rest).bg), await toRgb(page, (await rest).text)];
    const [red, , blue] = bg.match(/\d+/g)!.map(Number);

    expect(blue - red, "the fill leans purple (a neutral grey gives 0)").toBeGreaterThanOrEqual(10);
    expect(text).toBe("rgb(230, 207, 254)"); // brand-200 #E6CFFE, written out on purpose
    expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(4.5);

    test.skip(isMobile, "the phone project has no hover");
    await secondary.hover();
    await expect.poll(async () => (await colors()).bg, { timeout: 2000 }).not.toBe((await rest).bg);
  });

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

// D-50: button labels are Inter Medium, 13px, uppercase and tracked (not the Space Mono eyebrow style)
test.describe("button font (D-50)", () => {
  const labels = [
    { label: "primary", find: (p: import("@playwright/test").Page) => p.getByRole("button", { name: "View resume" }) },
    { label: "secondary", find: (p: import("@playwright/test").Page) => p.getByRole("link", { name: "View work" }) },
  ];

  for (const { label, find } of labels) {
    test(`the ${label} button label is Inter Medium, 13px, uppercase`, async ({ page }) => {
      await page.goto("/");

      const style = await find(page).evaluate((el) => {
        const s = getComputedStyle(el);
        return { family: s.fontFamily, weight: s.fontWeight, size: s.fontSize, transform: s.textTransform };
      });

      expect(style.family).toMatch(/Inter/);
      expect(style.family).not.toMatch(/Space Mono/);
      expect({ weight: style.weight, size: style.size, transform: style.transform }).toEqual({
        weight: "500",
        size: "13px",
        transform: "uppercase",
      });
    });
  }
});
