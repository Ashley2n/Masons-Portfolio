import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("blocks an empty submit with errors and focuses the first field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter a valid email address", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
  });

  test("opens a prefilled email and confirms", async ({ page }) => {
    await page.goto("/contact");
    // Don't launch a mail app during the test
    await page.route("mailto:*", (route) => route.abort());

    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Would love to collaborate on a show.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toContainText("masonfarrington@gmail.com");
    await expect(page).toHaveURL(/\/contact$/);
  });
});
