import { expect, test } from "./fixtures";

test.describe("about page", () => {
  test("the hero's resume button and Designer link can be clicked (the glow doesn't block them)", async ({ page }) => {
    await page.goto("/about");

    await page.getByRole("button", { name: "View resume" }).click({ trial: true, timeout: 5_000 });
    await page.getByRole("link", { name: /^Designer/ }).click({ trial: true, timeout: 5_000 });
    await expect(page.getByRole("heading", { level: 1, name: "About Me" })).toBeVisible();
  });

  test("timeline entries alternate sides, including the last one that has no photo", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "the timeline is one column on phones");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");

    const timeline = page.getByRole("list", { name: "My Journey" });
    const box = await timeline.boundingBox();
    if (!box) throw new Error("The timeline list has no layout box");
    const centerLine = box.x + box.width / 2;

    // Entries 02, 04 and 06 sit on the right of the dashed line; 01, 03 and 05 on the left.
    // Entry 06 ("Movie Actor") has no photo, which is what used to drop it into the left column.
    const sides = [
      ["First Role, First Spark", "right"],
      ["Joined American Gothic Performing Arts", "right"],
      ["Movie Actor", "right"],
      ["Found the Stage", "left"],
      ["Went All In", "left"],
      ["America's Got Talent", "left"],
    ] as const;
    for (const [title, side] of sides) {
      const heading = timeline.getByRole("heading", { level: 3, name: title });
      await heading.scrollIntoViewIfNeeded();
      const h = await heading.boundingBox();
      if (!h) throw new Error(`"${title}" has no layout box`);
      if (side === "right") expect(h.x, title).toBeGreaterThan(centerLine);
      else expect(h.x + h.width, title).toBeLessThan(centerLine);
    }
  });
});
