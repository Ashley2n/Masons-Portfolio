import { expect, test } from "./fixtures";

test.describe("contact form", () => {
  test("blocks an empty submit with errors and focuses the first field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter a valid email address", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
  });

  test("keeps the spam-trap field away from keyboard and screen-reader users", async ({ page }) => {
    await page.goto("/contact");

    // Only name, email and message are text boxes in the accessibility tree
    await expect(page.getByRole("textbox")).toHaveCount(3);
    // Tab from the message goes straight to Send, skipping the honeypot
    await page.getByLabel("Message").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Send message" })).toBeFocused();
  });

  test("sends an empty honeypot and the load time with a real visitor's message", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Would love to collaborate on a show.");

    // The fixture aborts the request after Playwright can read it, so nothing is emailed
    const requestSent = page.waitForRequest((request) => request.method() === "POST" && !!request.headers()["next-action"]);
    await page.getByRole("button", { name: "Send message" }).click();
    const body = (await requestSent).postData() ?? "";

    expect(body).toContain('"website":""');
    expect(body).toMatch(/"startedAt":\d{13}/);
  });

  test("offers Mason's email when the message can't be sent", async ({ page, contactActionCalls }) => {
    // The shared fixture aborts the server action, so this is the "network failed" path
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Would love to collaborate on a show.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toContainText("Sorry, your message didn't send.");
    await expect(page.getByRole("status").getByRole("link", { name: "mason.13.farrington@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:mason.13.farrington@gmail.com",
    );
    expect(contactActionCalls.count).toBe(1);
  });
});
