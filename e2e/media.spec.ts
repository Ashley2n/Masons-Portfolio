import { expect, test } from "@playwright/test";

test.describe("media gallery", () => {
  test("filters by category and loads more", async ({ page }) => {
    await page.goto("/media");
    const status = page.getByRole("status");
    const items = page.getByRole("list", { name: "Gallery" }).getByRole("listitem");

    await expect(status).toHaveText(/Showing 12 of \d+/);
    await expect(items).toHaveCount(12);

    await page.getByRole("button", { name: "Load more" }).click();
    await expect(items).toHaveCount(24);

    await page
      .getByRole("group", { name: "Filter by category" })
      .getByRole("button", { name: "Recital" })
      .click();
    await expect(status).toHaveText(/Showing (\d+) of \1/);
    await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);
  });

  test("'Explore the gallery' scrolls to the gallery", async ({ page }) => {
    await page.goto("/media");
    await page.getByRole("link", { name: "Explore the gallery" }).click();

    await expect(page).toHaveURL(/#gallery$/);
    await expect(page.getByRole("group", { name: "Filter by category" })).toBeInViewport();
  });

  test("plays a video inline", async ({ page }) => {
    await page.goto("/media");
    await page.getByRole("button", { name: "Play Spring" }).click();

    await expect(page.locator('iframe[title="Spring"]')).toHaveAttribute(
      "src",
      /youtube-nocookie\.com\/embed\/WhWc3b3KhnY/,
    );
  });
});
