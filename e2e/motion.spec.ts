import { expect, test, type Page } from "./fixtures";

// The scroll reveal is CSS only (`.reveal` in app/globals.css), so the only way to test it is in a real browser.
test.describe("scroll reveal (D-33, D-38)", () => {
  test("expertise cards animate into place for visitors who allow motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const card = page.getByRole("list", { name: "Expertise" }).getByRole("listitem").first();
    await expect(card).toHaveCSS("animation-name", "reveal-rise");
  });

  test("nothing is hidden when the page is printed or saved as a PDF, which never scrolls", async ({ page }) => {
    await page.emulateMedia({ media: "print", reducedMotion: "no-preference" });
    await page.goto("/");

    const cards = page.getByRole("list", { name: "Expertise" }).getByRole("listitem");
    await expect(cards.first()).toHaveCSS("animation-name", "none");
    await expect(cards.last()).toHaveCSS("opacity", "1");
  });

  test("nothing animates, and every card stays fully visible, when the visitor asks for reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const cards = page.getByRole("list", { name: "Expertise" }).getByRole("listitem");
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await expect(card).toHaveCSS("animation-name", "none");
      await expect(card).toHaveCSS("opacity", "1");
    }
  });
});

// Hero entrance: the one authored moment. Five pieces rise in reading order (CSS only, `.hero-enter`).
test.describe("hero entrance", () => {
  const heroPieces = (page: Page) => [
    page.getByRole("list", { name: "Roles" }),
    page.getByRole("heading", { level: 1 }),
    page.getByText(
      "A multidisciplinary artist creating meaningful experiences through performance and design.",
    ),
    page.getByRole("button", { name: "View resume" }),
    page.getByRole("link", { name: "View work" }),
  ];
  // "0.6s, 0.1s" style values -> milliseconds
  const toMs = (value: string) =>
    parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);

  test("roles, name, tagline and both buttons rise one after another in reading order", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const delays: number[] = [];
    for (const piece of heroPieces(page)) {
      await expect(piece).toHaveCSS("animation-name", "hero-rise");
      delays.push(
        toMs(await piece.evaluate((el) => getComputedStyle(el).animationDelay)),
      );
    }
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(5);
  });

  test("the whole entrance is over within 1.2 seconds", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    for (const piece of heroPieces(page)) {
      const { delay, duration } = await piece.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          delay: style.animationDelay,
          duration: style.animationDuration,
        };
      });
      expect(toMs(delay) + toMs(duration)).toBeGreaterThan(0);
      expect(toMs(delay) + toMs(duration)).toBeLessThanOrEqual(1200);
    }
  });

  for (const emulation of [
    { reducedMotion: "reduce" as const },
    { media: "print" as const, reducedMotion: "no-preference" as const },
  ]) {
    test(`nothing animates and everything is visible (${JSON.stringify(emulation)})`, async ({
      page,
    }) => {
      await page.emulateMedia(emulation);
      await page.goto("/");

      for (const piece of heroPieces(page)) {
        await expect(piece).toHaveCSS("animation-name", "none");
        await expect(piece).toHaveCSS("opacity", "1");
      }
    });
  }
});
