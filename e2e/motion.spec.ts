import { expect, test } from "./fixtures";

// The scroll reveal is CSS only (`.reveal` in app/globals.css), so the only way to test it is in a real browser.
test.describe("scroll reveal (D-33, D-38)", () => {
  test("expertise cards animate into place for visitors who allow motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const card = page.getByRole("list", { name: "Expertise" }).getByRole("listitem").first();
    await expect(card).toHaveCSS("animation-name", "reveal-rise");
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
