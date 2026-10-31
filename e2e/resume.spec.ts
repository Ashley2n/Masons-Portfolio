import { expect, test } from "@playwright/test";

test.describe("resume", () => {
  test("downloads the PDF with a friendly file name", async ({ page }) => {
    await page.goto("/resume");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Download PDF" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("Mason-Farrington-Resume.pdf");
  });

  test("serves the file as a PDF", async ({ request }) => {
    const response = await request.get("/resume/mason-farrington-resume.pdf");

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("serves Mason's real resume, not the 2 KB placeholder (F2, #13)", async ({ request }) => {
    const response = await request.get("/resume/mason-farrington-resume.pdf");

    expect((await response.body()).byteLength).toBeGreaterThan(50_000);
  });
});

test.describe("resume modal", () => {
  for (const path of ["/", "/about", "/contact"]) {
    test(`opens from ${path}, closes with Escape and returns focus`, async ({ page }) => {
      await page.goto(path);
      const trigger = page.getByRole("button", { name: "View resume" });

      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Resume" });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByTitle("Mason Farrington's resume (PDF preview)")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  test("keeps the page behind inert while open", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "View resume" }).click();

    // A modal <dialog> makes everything else inert: the logo link can't take focus.
    // (Tab-counting isn't reliable: Chrome lets Tab move on to the browser toolbar.)
    const logoCanFocus = await page.evaluate(() => {
      const logo = document.querySelector<HTMLAnchorElement>('header a[href="/"]')!;
      logo.focus();
      return document.activeElement === logo;
    });
    expect(logoCanFocus).toBe(false);
  });

  test("downloads the PDF from the modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "View resume" }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("dialog").getByRole("link", { name: "Download PDF" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("Mason-Farrington-Resume.pdf");
  });
});
