import { expect, test } from "@playwright/test";

const pages = [
  { label: "About", path: "/about", heading: "About Me" },
  { label: "Media", path: "/media", heading: "Moments. Stories. Vision." },
  { label: "Contact", path: "/contact", heading: "Let's create something great." },
];

test.describe("navigation", () => {
  test("home page has the site's default title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Mason Farrington | Actor, Musician, Singer & Designer");
  });

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
    await page.getByRole("link", { name: "MF, Mason Farrington, home" }).click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("page structure", () => {
  // /resume is no longer in the nav but stays reachable as a shareable link
  for (const path of ["/", "/resume", ...pages.map((p) => p.path)]) {
    test(`${path} has one header, main and footer`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });
  }
});

test("a new page opens at the top without an animated scroll", async ({ page }) => {
  await page.goto("/about");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("contentinfo").getByRole("link", { name: "Media" }).click();

  await expect(page).toHaveURL("/media");
  // A smooth scroll would still be part-way up the page right after navigating
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
