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
});
