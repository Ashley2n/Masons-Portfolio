import { test as base } from "@playwright/test";

export { expect, type Page } from "@playwright/test";

type Fixtures = {
  /** How many contact server-action requests the page tried to send (all were blocked). */
  contactActionCalls: { count: number };
};

/**
 * Every e2e test gets this. Server actions POST with a Next-Action header; aborting them
 * in the browser means no test can email Mason, even when a reused local dev server holds
 * the real RESEND_API_KEY from .env.local (D-36). ESLint makes specs import from here.
 */
export const test = base.extend<Fixtures>({
  contactActionCalls: [
    async ({ context }, use) => {
      const calls = { count: 0 };
      await context.route("**/*", (route) => {
        const request = route.request();
        if (request.method() === "POST" && request.headers()["next-action"]) {
          calls.count += 1;
          return route.abort();
        }
        return route.fallback();
      });
      await use(calls);
    },
    { auto: true },
  ],
});
