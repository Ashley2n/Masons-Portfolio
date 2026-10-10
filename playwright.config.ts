import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const CHROME = "chrome";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Installed Google Chrome (local machines and GitHub runners both have it), so no
  // browser download is needed (D-15). Set per project: device presets override `use`.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: CHROME } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: CHROME } },
  ],
  webServer: {
    // CI tests the production build; locally, reuse a running dev server.
    command: isCI ? "npm run build && npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
