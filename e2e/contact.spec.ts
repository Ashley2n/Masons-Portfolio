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
    // Capture the mailto: link instead of launching a mail app
    // (network routes can't intercept mailto: navigations)
    await page.addInitScript(() => {
      document.addEventListener(
        "click",
        (event) => {
          const link = (event.target as Element | null)?.closest?.('a[href^="mailto:"]');
          if (link instanceof HTMLAnchorElement && link.closest("form") === null) {
            event.preventDefault();
            (window as unknown as { __mailto?: string }).__mailto = link.href;
          }
        },
        true,
      );
    });
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Would love to collaborate on a show.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toContainText("email me directly at mason.13.farrington@gmail.com");
    const mailto = await page.evaluate(() => (window as unknown as { __mailto?: string }).__mailto);
    expect(mailto).toBeDefined();
    const url = new URL(mailto!);
    expect(url.pathname).toBe("mason.13.farrington@gmail.com");
    expect(url.searchParams.get("subject")).toBe("Portfolio inquiry from Ada Lovelace");
    expect(url.searchParams.get("body")).toContain("Would love to collaborate on a show.");
  });
});
