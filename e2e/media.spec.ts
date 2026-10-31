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

  test("every category filter can be tapped (the hero glows don't block it)", async ({ page }) => {
    await page.goto("/media");
    const filters = page.getByRole("group", { name: "Filter by category" }).getByRole("button");

    for (const name of await filters.allTextContents()) {
      const button = filters.filter({ hasText: name });
      await button.click({ timeout: 5_000 });
      await expect(button).toHaveAttribute("aria-pressed", "true");
    }
  });

  test("'Explore the gallery' scrolls to the gallery", async ({ page }) => {
    await page.goto("/media");
    await page.getByRole("link", { name: "Explore the gallery" }).click();

    await expect(page).toHaveURL(/#gallery$/);
    await expect(page.getByRole("group", { name: "Filter by category" })).toBeInViewport();
  });

  test("shows Mason's reel under Other and plays it inline (D-32)", async ({ page }) => {
    await page.goto("/media");
    await page
      .getByRole("group", { name: "Filter by category" })
      .getByRole("button", { name: "Other" })
      .click();
    await page.getByRole("button", { name: "Play Mason Farrington Intro Video" }).click();

    await expect(page.locator('iframe[title="Mason Farrington Intro Video"]')).toHaveAttribute(
      "src",
      /youtube-nocookie\.com\/embed\/1BnBTdARUHk/,
    );
  });

  test("has no Blender placeholder videos in any category (D-32)", async ({ page }) => {
    await page.goto("/media");
    const loadMore = page.getByRole("button", { name: "Load more" });
    while (await loadMore.count()) await loadMore.click();

    // Only Mason's own videos (F3)
    const playLabels = await page
      .getByRole("button", { name: /^Play / })
      .evaluateAll((buttons) => buttons.map((b) => b.getAttribute("aria-label")));
    expect(playLabels.sort()).toEqual(
      ["Acting Reel", "Dance Reel", "Intro Video", "Vocal Reel"].map((t) => `Play Mason Farrington ${t}`),
    );
    // Exact text inside the gallery, so later copy (e.g. "Spring recital") can't false-fail this
    const gallery = page.getByRole("list", { name: "Gallery" });
    const blenderTitles = [
      "Spring",
      "Agent 327",
      "Cosmos Laundromat",
      "Big Buck Bunny",
      "Tears of Steel",
      "Sintel",
      "Singularity",
      "Lighting Rigs",
    ];
    for (const title of blenderTitles) {
      await expect(gallery.getByText(title, { exact: true })).toHaveCount(0);
    }
  });
});
