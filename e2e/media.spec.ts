import { expect, test } from "./fixtures";

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

  // #39: Mason reported that "Load more" sent him back to the top of the page
  test('"Load more" keeps the page where it is and the new photos appear below', async ({ page }) => {
    await page.goto("/media");
    const loadMore = page.getByRole("button", { name: "Load more" });
    const items = page.getByRole("list", { name: "Gallery" }).getByRole("listitem");

    // html is scroll-smooth, which would hide a failed scroll check: use instant scrolls and let any scroll settle
    await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
    // Read scrollY inside the page, in the capture phase, at the moment the click arrives (before React reacts).
    // Reading it earlier from the test is a guess: on the phone project the button's box wobbles by about 0.1px
    // after the first scroll, Playwright then sees "not stable", retries the click with another scroll alignment
    // and moves the page about 410px (half the viewport) after the test has taken its measurement. That failed
    // 3 of 30 production runs on 2026-11-15. Not an app bug: the button's document position never moves.
    await page.evaluate(() => {
      window.addEventListener("click", () => ((window as unknown as { clickScrollY: number }).clickScrollY = window.scrollY), {
        capture: true,
        once: true,
      });
    });
    await loadMore.scrollIntoViewIfNeeded();
    await loadMore.click();
    await expect(items).toHaveCount(24);
    await page.waitForTimeout(800); // a smooth or delayed jump to the top would land in this window

    const before = await page.evaluate(() => (window as unknown as { clickScrollY: number }).clickScrollY);
    expect(before, "the button is far down the page").toBeGreaterThan(500);
    // Focus moving to the first new photo may nudge the page down a little, but never up
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 1);
  });

  // D-48: photos that newly appear fade in; photos already on screen never dim or move (#33: nothing blinks out).
  // Every frame is sampled while the action runs, so a one-frame blink would still show up.
  for (const action of [
    { label: "Load more", run: (page: import("./fixtures").Page) => page.getByRole("button", { name: "Load more" }).click() },
    {
      label: "a category tab",
      run: (page: import("./fixtures").Page) =>
        page.getByRole("group", { name: "Filter by category" }).getByRole("button", { name: "Recital" }).click(),
    },
  ]) {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      test(`${action.label}: new photos ${reducedMotion === "reduce" ? "appear at once" : "fade in"}, the ones already shown never dim (${reducedMotion})`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion });
        await page.goto("/media");
        await page.getByRole("list", { name: "Gallery" }).getByRole("listitem").first().waitFor();

        await page.evaluate(() => {
          const key = (li: Element) => li.querySelector("img")?.getAttribute("src") ?? "";
          const before = new Set(Array.from(document.querySelectorAll("[aria-labelledby=gallery-heading] > li")).map(key));
          const w = window as unknown as { __fade: { keptMin: number; newMin: number; newCount: number } };
          w.__fade = { keptMin: 1, newMin: 1, newCount: 0 };
          const sample = () => {
            const seen = new Set<string>();
            document.querySelectorAll("[aria-labelledby=gallery-heading] > li").forEach((li) => {
              const k = key(li);
              const opacity = Number(getComputedStyle(li).opacity);
              if (before.has(k)) w.__fade.keptMin = Math.min(w.__fade.keptMin, opacity);
              else {
                w.__fade.newMin = Math.min(w.__fade.newMin, opacity);
                seen.add(k);
              }
            });
            w.__fade.newCount = Math.max(w.__fade.newCount, seen.size);
            requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        });

        await action.run(page);
        await page.waitForTimeout(900);
        const result = await page.evaluate(() => (window as unknown as { __fade: { keptMin: number; newMin: number; newCount: number } }).__fade);
        const finalOpacities = await page
          .getByRole("list", { name: "Gallery" })
          .getByRole("listitem")
          .evaluateAll((items) => items.map((li) => getComputedStyle(li).opacity));

        expect(result.newCount, "some photos are new").toBeGreaterThan(0);
        expect(result.keptMin, "photos that stay on screen never dim").toBe(1);
        if (reducedMotion === "reduce") expect(result.newMin, "no fade for reduced motion").toBe(1);
        else expect(result.newMin, "new photos start below full opacity").toBeLessThan(1);
        expect(new Set(finalOpacities), "everything ends fully visible").toEqual(new Set(["1"]));
      });
    }
  }

  test("every category filter can be tapped (the hero glows don't block it)", async ({ page }) => {
    await page.goto("/media");
    const filters = page.getByRole("group", { name: "Filter by category" }).getByRole("button");

    for (const name of await filters.allTextContents()) {
      const button = filters.filter({ hasText: name });
      await button.click({ timeout: 5_000 });
      await expect(button).toHaveAttribute("aria-pressed", "true");
    }
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
