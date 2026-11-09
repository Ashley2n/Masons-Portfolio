import { expect, test, type Page } from "./fixtures";

// The scroll reveal is CSS only (`.reveal` in app/globals.css), so the only way to test it is in a real browser.
test.describe("scroll reveal (D-33, D-38)", () => {
  test("expertise cards animate into place for visitors who allow motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const card = page.getByRole("list", { name: "Expertise" }).getByRole("listitem").first();
    await expect(card).toHaveCSS("animation-name", "reveal-rise");
  });

  test("nothing is hidden when the page is printed or saved as a PDF, which never scrolls", async ({ page }) => {
    await page.emulateMedia({ media: "print", reducedMotion: "no-preference" });
    await page.goto("/");

    const cards = page.getByRole("list", { name: "Expertise" }).getByRole("listitem");
    await expect(cards.first()).toHaveCSS("animation-name", "none");
    await expect(cards.last()).toHaveCSS("opacity", "1");
  });

  test("nothing animates, and every card stays fully visible, when the visitor asks for reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const cards = page.getByRole("list", { name: "Expertise" }).getByRole("listitem");
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await expect(card).toHaveCSS("animation-name", "none");
      await expect(card).toHaveCSS("opacity", "1");
    }
  });
});

// Load entrance (D-44): measured from what the browser paints (effective opacity per frame), not from which
// animation engine ran, so these tests survive a change of engine.
type PieceTiming = { startMs: number | null; mostMs: number | null; doneMs: number | null };
declare global {
  interface Window {
    __heroTimeline?: PieceTiming[];
  }
}

// The five hero pieces in reading order, as data. The sampler and the transform check both run inside the
// browser (the sampler has to start before the page's own scripts, `addInitScript`), so they cannot share a
// function; they share this list instead, so a copy change is edited once.
const HERO_PIECES = [
  { selector: 'ul[aria-label="Roles"]' },
  { selector: "h1" },
  { selector: "p", text: "A multidisciplinary artist" },
  { selector: "button", text: "View resume" },
  { selector: "a", text: "View work" },
];

async function startHeroSampler(page: Page) {
  await page.addInitScript((pieces) => {
    const finders: Array<() => Element | undefined> = pieces.map(
      (piece) => () =>
        Array.from(document.querySelectorAll(piece.selector)).find(
          (el) => !piece.text || el.textContent?.includes(piece.text),
        ),
    );
    const timeline: PieceTiming[] = finders.map(() => ({ startMs: null, mostMs: null, doneMs: null }));
    window.__heroTimeline = timeline;
    const sample = () => {
      const now = performance.now();
      finders.forEach((find, i) => {
        const el = find();
        if (!el) return;
        // Computed opacity does not inherit, so what is painted is the product up the ancestor chain
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) {
          opacity *= parseFloat(getComputedStyle(node).opacity);
        }
        const t = timeline[i];
        if (t.startMs === null && opacity > 0.05) t.startMs = now;
        if (t.startMs !== null && t.mostMs === null && opacity >= 0.8) t.mostMs = now;
        if (t.startMs !== null && t.doneMs === null && opacity >= 0.999) t.doneMs = now;
      });
      if (now < 8000 && timeline.some((t) => t.doneMs === null)) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, HERO_PIECES);
}

async function heroTimeline(page: Page): Promise<PieceTiming[]> {
  await page.goto("/");
  await expect
    .poll(async () => page.evaluate(() => window.__heroTimeline?.every((t) => t.doneMs !== null) ?? false), {
      timeout: 10_000,
    })
    .toBe(true);
  return page.evaluate(() => window.__heroTimeline!);
}

// The hero's pieces and every ancestor up to <main> must end with no leftover movement
async function transformsOfHeroChains(page: Page) {
  return page.evaluate((pieces) => {
    const seen: string[] = [];
    for (const piece of pieces) {
      const el = Array.from(document.querySelectorAll(piece.selector)).find(
        (candidate) => !piece.text || candidate.textContent?.includes(piece.text),
      );
      for (let node: Element | null = el ?? null; node && node.tagName !== "MAIN"; node = node.parentElement) {
        seen.push(getComputedStyle(node).transform);
      }
    }
    return seen;
  }, HERO_PIECES);
}

test.describe("load entrance timing (D-44), Home hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("the five pieces start in reading order, about 300ms apart", async ({ page }) => {
    await startHeroSampler(page);
    const starts = (await heroTimeline(page)).map((t) => t.startMs!);

    for (let i = 1; i < starts.length; i++) {
      const gap = starts[i] - starts[i - 1];
      expect(gap, `piece ${i} starts after piece ${i - 1}`).toBeGreaterThan(200);
      expect(gap, `piece ${i} starts after piece ${i - 1}`).toBeLessThan(400);
    }
  });

  // Measured on 2026-11-08 (desktop, dev server): 1.43s per piece at 99.9% opacity. The recipe is 1.8s per
  // piece, but the site's easing (D-41) spends the last 0.4s on a tail nobody can see (Ashley chose to pin
  // the visible timeline, not the nominal one).
  test("each piece settles about 1.4 seconds after it starts", async ({ page }) => {
    await startHeroSampler(page);
    const timeline = await heroTimeline(page);

    timeline.forEach((t, i) => {
      const took = t.doneMs! - t.startMs!;
      expect(took, `piece ${i}`).toBeGreaterThan(1180);
      expect(took, `piece ${i}`).toBeLessThan(1680);
    });
  });

  test("the whole entrance has settled about 2.6 seconds after it begins", async ({ page }) => {
    await startHeroSampler(page);
    const timeline = await heroTimeline(page);

    const total = timeline[4].doneMs! - timeline[0].startMs!;
    expect(total).toBeGreaterThan(2230);
    expect(total).toBeLessThan(3030);
  });

  test("the name is mostly visible within one second of its own start", async ({ page }) => {
    await startHeroSampler(page);
    const h1 = (await heroTimeline(page))[1];

    expect(h1.mostMs! - h1.startMs!).toBeLessThan(1000);
  });

  test("once it has played, nothing keeps moving", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(async () => (await transformsOfHeroChains(page)).every((t) => t === "none"), { timeout: 10_000 })
      .toBe(true);
  });

  // `hover:` only applies where the pointer can hover (Tailwind wraps it in `@media (hover: hover)`)
  test("the primary button still lifts 1px on hover after the entrance", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "a touch device has no hover");
    await page.goto("/");
    await expect
      .poll(async () => (await transformsOfHeroChains(page)).every((t) => t === "none"), { timeout: 10_000 })
      .toBe(true);

    const button = page.getByRole("button", { name: "View resume" });
    await page.mouse.move(0, 0);
    const before = (await button.boundingBox())!.y;
    await button.hover();
    await expect.poll(async () => before - (await button.boundingBox())!.y).toBeCloseTo(1, 0);
  });

  for (const emulation of [
    { name: "reduced motion", media: undefined, reducedMotion: "reduce" as const },
    { name: "print", media: "print" as const, reducedMotion: "no-preference" as const },
  ]) {
    test(`everything is visible from the first frame, with no movement (${emulation.name})`, async ({ page }) => {
      await page.emulateMedia({ media: emulation.media, reducedMotion: emulation.reducedMotion });
      await startHeroSampler(page);
      const timeline = await heroTimeline(page);

      for (const [i, t] of timeline.entries()) {
        expect(t.doneMs! - t.startMs!, `piece ${i} is fully visible on its first painted frame`).toBe(0);
      }
      expect((await transformsOfHeroChains(page)).every((t) => t === "none")).toBe(true);
    });
  }

  // (Both the CSS rule and the `useReducedMotion` branch in LoadEntrance are needed: the CSS shows the
  // server-rendered content at once, the branch is what stops the animation underneath.)
  // The CSS rule in globals.css already hides the fade for reduced motion, so the paint cannot show whether
  // an animation still runs underneath. Motion animates from JavaScript (document.getAnimations() sees
  // nothing), so the one observable is the inline style it writes: it must already be at rest, not 0 and rising.
  // This reads Motion's inline styles on purpose; if the engine changes, change this test with it.
  test("nothing keeps animating underneath when the visitor asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Array.from(document.querySelectorAll<HTMLElement>("[data-motion]")).every(
              (el) => el.style.opacity === "1" || el.style.opacity === "",
            ),
          ),
        { timeout: 1000 },
      )
      .toBe(true);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("the hero is fully visible, not stuck waiting for an animation that cannot run", async ({ page }) => {
      await page.goto("/");

      const animated = page.locator("[data-motion]");
      expect(await animated.count()).toBeGreaterThanOrEqual(5);
      for (const el of await animated.all()) {
        await expect(el).toHaveCSS("opacity", "1");
        await expect(el).toHaveCSS("transform", "none");
      }
    });
  });
});

// Every other page opens with the same entrance on its top block (D-44, #31). One table, thin on purpose: the
// recipe (stagger, 1.4s settle) is shared with the Home hero and pinned above, so here we only prove that each
// page's title takes part and that reduced motion shows it at once.
const entrancePages = [
  ["About", "/about"],
  ["Media", "/media"],
  ["Contact", "/contact"],
  ["Resume", "/resume"],
  ["404", "/this-page-does-not-exist"],
] as const;

declare global {
  interface Window {
    __titleOpacity?: { first: number | null; done: boolean };
  }
}

// Effective (painted) opacity of the page's h1 on its first frame, and whether it ever reaches full opacity
async function startTitleSampler(page: Page) {
  await page.addInitScript(() => {
    const seen: { first: number | null; done: boolean } = { first: null, done: false };
    window.__titleOpacity = seen;
    const sample = () => {
      const h1 = document.querySelector("h1");
      if (h1) {
        let opacity = 1;
        for (let node: Element | null = h1; node; node = node.parentElement) {
          opacity *= parseFloat(getComputedStyle(node).opacity);
        }
        if (seen.first === null) seen.first = opacity;
        if (opacity >= 0.999) seen.done = true;
      }
      if (!seen.done && performance.now() < 8000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}

test.describe("load entrance on every page (D-44)", () => {
  for (const [name, path] of entrancePages) {
    test(`${name}: the title arrives with the entrance instead of being there from the start`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await startTitleSampler(page);
      await page.goto(path);

      await expect.poll(() => page.evaluate(() => window.__titleOpacity!.done), { timeout: 10_000 }).toBe(true);
      expect((await page.evaluate(() => window.__titleOpacity!.first))!, "painted opacity on the first frame").toBeLessThan(0.5);
    });

    test(`${name}: the title is fully visible from the first frame when the visitor asks for reduced motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await startTitleSampler(page);
      await page.goto(path);

      await expect.poll(() => page.evaluate(() => window.__titleOpacity!.done), { timeout: 5_000 }).toBe(true);
      expect(await page.evaluate(() => window.__titleOpacity!.first)).toBe(1);
    });
  }
});

// Section headings (h2 only) use the existing scroll reveal. Page titles (h1) never do (D-41).
test.describe("section heading reveal", () => {
  const sectionHeadings = [
    ["/", "Model Shots"],
    ["/", "The Journey So Far"],
    ["/", "What I Do"],
    ["/", "Recent Work"],
    ["/about", "My Journey"],
  ] as const;

  test("every section heading rises into view for visitors who allow motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const [path, name] of sectionHeadings) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 2, name, exact: true }), `${path} ${name}`).toHaveCSS(
        "animation-name",
        "reveal-rise",
      );
    }
  });

  for (const emulation of [
    { reducedMotion: "reduce" as const },
    { media: "print" as const, reducedMotion: "no-preference" as const },
  ]) {
    test(`no section heading animates or hides (${JSON.stringify(emulation)})`, async ({ page }) => {
      await page.emulateMedia(emulation);
      for (const [path, name] of sectionHeadings) {
        await page.goto(path);
        const heading = page.getByRole("heading", { level: 2, name, exact: true });
        await expect(heading, `${path} ${name}`).toHaveCSS("animation-name", "none");
        await expect(heading, `${path} ${name}`).toHaveCSS("opacity", "1");
      }
    });
  }

  test("page titles never use the scroll reveal", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const path of ["/", "/about", "/media", "/contact", "/resume"]) {
      await page.goto(path);
      const title = page.getByRole("heading", { level: 1 });
      await expect(title, path).not.toHaveCSS("animation-name", "reveal-rise");
      // The home title has the load entrance (D-44); the others have no animation at all
      if (path !== "/") await expect(title, path).toHaveCSS("animation-name", "none");
    }
  });
});
