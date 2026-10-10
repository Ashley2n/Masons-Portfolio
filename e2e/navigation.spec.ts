import { expect, test } from "@playwright/test";

const pages = [
  { label: "About", path: "/about", heading: "About Me" },
  { label: "Media", path: "/media", heading: "Moments. Stories. Vision." },
  { label: "Resume", path: "/resume", heading: "Resume" },
  { label: "Contact", path: "/contact", heading: "Let's create something great." },
];

test.describe("navigation", () => {
  for (const page of pages) {
    test(`reaches ${page.label} from the header`, async ({ page: browser, isMobile }) => {
      await browser.goto("/");

      if (isMobile) {
        await browser.getByRole("button", { name: "Menu" }).click();
        await browser
          .getByRole("navigation", { name: "Mobile" })
          .getByRole("link", { name: page.label })
          .click();
      } else {
        await browser
          .getByRole("navigation", { name: "Main" })
          .getByRole("link", { name: page.label })
          .click();
      }

      await expect(browser).toHaveURL(page.path);
      await expect(browser).toHaveTitle(`${page.label} | Mason Farrington`);
      await expect(
        browser.getByRole("heading", { level: 1, name: page.heading }),
      ).toBeVisible();
    });
  }

  test("the logo returns to the homepage", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: /mason farrington, home/i }).click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("page structure", () => {
  for (const path of ["/", ...pages.map((p) => p.path)]) {
    test(`${path} has one header, main and footer`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });
  }
});
