import { expect, test } from "@playwright/test";

test.describe("about page", () => {
  test("the hero's resume button and Designer link can be clicked (the glow doesn't block them)", async ({ page }) => {
    await page.goto("/about");

    await page.getByRole("button", { name: "View resume" }).click({ trial: true, timeout: 5_000 });
    await page.getByRole("link", { name: /^Designer/ }).click({ trial: true, timeout: 5_000 });
    await expect(page.getByRole("heading", { level: 1, name: "About Me" })).toBeVisible();
  });
});
