import { expect, test } from "@playwright/test";

test.describe("404 page", () => {
  test("answers an unknown URL with a 404 and a way back", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Page not found | Mason Farrington");
    await expect(page.getByRole("heading", { level: 1, name: "This page missed its cue." })).toBeVisible();

    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("every suggested page and the home button can be clicked (the glow doesn't block them)", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    const links = page.getByRole("main").getByRole("link");

    for (const name of await links.allTextContents()) {
      await links.filter({ hasText: name }).click({ trial: true, timeout: 5_000 });
    }
  });
});
