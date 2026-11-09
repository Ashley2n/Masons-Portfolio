import { expect, test, type Page } from "./fixtures";

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

// Scroll reveal on Motion (D-44, #32). One table of six blocks below the fold at a fixed 1280x720, so
// "below the fold" is the same on both projects. What a visitor sees is measured (painted opacity), never which
// engine ran, so these survive a change of engine.
const reveals = [
  ["Home: Model Shots heading", "/", (page: Page) => page.getByRole("heading", { level: 2, name: "Model Shots", exact: true })],
  [
    "Home: The Journey So Far heading",
    "/",
    (page: Page) => page.getByRole("heading", { level: 2, name: "The Journey So Far", exact: true }),
  ],
  ["Home: first Journey stat", "/", (page: Page) => page.getByText("theatrical/musical shows").first().locator("..")],
  [
    "Home: first Expertise card",
    "/",
    (page: Page) => page.getByRole("list", { name: "Expertise" }).getByRole("listitem").first(),
  ],
  ["About: My Journey heading", "/about", (page: Page) => page.getByRole("heading", { level: 2, name: "My Journey", exact: true })],
  ["About: first timeline entry", "/about", (page: Page) => page.getByRole("list", { name: "My Journey" }).getByRole("listitem").first()],
] as const;

// Computed opacity does not inherit, so what is painted is the product up the ancestor chain (same as the hero sampler)
const paintedOpacity = (el: Element) => {
  let opacity = 1;
  for (let node: Element | null = el; node; node = node.parentElement) opacity *= parseFloat(getComputedStyle(node).opacity);
  return opacity;
};

test.describe("scroll reveal on Motion (D-44)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const [name, path, find] of reveals) {
    test(`${name}: waits below the fold (A), rises into view (B), and plays only once (C)`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(path);
      const block = find(page);

      // A: not yet reached, so not yet painted
      expect(await block.evaluate(paintedOpacity), "before scrolling").toBeLessThan(0.5);

      // B: scrolled to, it arrives
      await block.scrollIntoViewIfNeeded();
      await expect.poll(() => block.evaluate(paintedOpacity), { timeout: 5000 }).toBeGreaterThan(0.999);

      // C: scrolled away and back, it is still there (a scroll-linked effect would hide it again)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      expect(await block.evaluate(paintedOpacity), "after scrolling away").toBeGreaterThan(0.999);
      await block.scrollIntoViewIfNeeded();
      expect(await block.evaluate(paintedOpacity), "after scrolling back").toBeGreaterThan(0.999);
    });

    // D and E: a block that sits below the fold must still be there when nobody scrolls
    for (const emulation of [
      { label: "reduced motion (D)", media: undefined, reducedMotion: "reduce" as const },
      { label: "print (E)", media: "print" as const, reducedMotion: "no-preference" as const },
    ]) {
      test(`${name}: is fully visible without scrolling for ${emulation.label}`, async ({ page }) => {
        await page.emulateMedia({ media: emulation.media, reducedMotion: emulation.reducedMotion });
        await page.goto(path);

        expect(await find(page).evaluate(paintedOpacity)).toBeGreaterThan(0.999);
      });
    }
  }
});

// Scroll reveals on the remaining content (D-44, #33). Deliberately light (Ashley, 2026-11-08): one short test
// per block, plus one for the reduced-motion path. Two shapes, because of where the block sits at 1280x720:
// below the fold it must wait to be reached; already in view it must still arrive instead of being there from the
// first frame. (Where each one sits was measured: carousel 1072px, videos 3749px and 4385px, banner 4850px;
// gallery photo 510px, Contact form 486px and card 180px, Resume preview 346px.)
const belowTheFold = [
  ["Home: Model Shots carousel", "/", (page: Page) => page.getByRole("button", { name: "Previous photo" })],
  ["Home: featured Recent Work video", "/", (page: Page) => page.getByRole("button", { name: /^Play / }).first()],
  ["Home: first Other Work video", "/", (page: Page) => page.getByRole("button", { name: /^Play / }).nth(1)],
  [
    "Home: call-to-action banner",
    "/",
    (page: Page) => page.getByRole("heading", { level: 2, name: "Interested in working together?" }),
  ],
] as const;

// CSS selectors, not locators: the sampler has to run before the page's own scripts to see the first frame
const inViewAtLoad = [
  ["Media: first gallery photo", "/media", 'ul[aria-labelledby="gallery-heading"] > li > div'],
  ["Contact: the form", "/contact", "form"],
  ["Contact: the card", "/contact", "aside"],
  ["Resume: the PDF preview", "/resume", "iframe"],
] as const;

declare global {
  interface Window {
    __blockOpacity?: { first: number | null; done: boolean };
  }
}

// Painted opacity of the first element matching `selector` on its first frame, and whether it ever reaches 1
async function startBlockSampler(page: Page, selector: string) {
  await page.addInitScript((sel) => {
    const seen: { first: number | null; done: boolean } = { first: null, done: false };
    window.__blockOpacity = seen;
    const sample = () => {
      const el = document.querySelector(sel);
      if (el) {
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) opacity *= parseFloat(getComputedStyle(node).opacity);
        if (seen.first === null) seen.first = opacity;
        if (opacity >= 0.999) seen.done = true;
      }
      if (!seen.done && performance.now() < 8000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, selector);
}

test.describe("scroll reveal on the remaining content (D-44, #33)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const [name, path, find] of belowTheFold) {
    test(`${name}: waits until it is reached, then arrives`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(path);
      const block = find(page);

      expect(await block.evaluate(paintedOpacity), "before scrolling").toBeLessThan(0.5);
      await block.scrollIntoViewIfNeeded();
      await expect.poll(() => block.evaluate(paintedOpacity), { timeout: 5000 }).toBeGreaterThan(0.999);
    });

    test(`${name}: is fully visible without scrolling for reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);

      expect(await find(page).evaluate(paintedOpacity)).toBeGreaterThan(0.999);
    });
  }

  for (const [name, path, selector] of inViewAtLoad) {
    test(`${name}: arrives with the page instead of being there from the first frame`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await startBlockSampler(page, selector);
      await page.goto(path);

      await expect.poll(() => page.evaluate(() => window.__blockOpacity!.done), { timeout: 10_000 }).toBe(true);
      expect((await page.evaluate(() => window.__blockOpacity!.first))!, "painted opacity on the first frame").toBeLessThan(0.5);
    });

    test(`${name}: is fully visible from the first frame for reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await startBlockSampler(page, selector);
      await page.goto(path);

      await expect.poll(() => page.evaluate(() => window.__blockOpacity!.done), { timeout: 5_000 }).toBe(true);
      expect(await page.evaluate(() => window.__blockOpacity!.first)).toBe(1);
    });
  }
});

// Gallery photos that are already on screen must never blink out when the tab changes or "Load more" adds
// photos (#29 story 21). Only the first batch reveals on scroll; later batches mount visible. The click and the
// next few frames are sampled inside the page so nothing depends on a timing window.
async function lowestOpacityInViewAfterClick(page: Page, buttonText: string) {
  return page.evaluate(async (text) => {
    const painted = (el: Element) => {
      let opacity = 1;
      for (let node: Element | null = el; node; node = node.parentElement) opacity *= parseFloat(getComputedStyle(node).opacity);
      return opacity;
    };
    const inView = () =>
      // The reveal wrapper sits inside each <li> (the <li> itself keeps its tabindex for focus), so measure that
      [...document.querySelectorAll('ul[aria-labelledby="gallery-heading"] > li > div')].filter((block) => {
        const box = block.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight;
      });
    // Checked after the click: every photo it mounts, and the photos that were already settled on screen before it
    const existing = new Set(document.querySelectorAll('ul[aria-labelledby="gallery-heading"] > li > div'));
    const settled = new Set(inView().filter((block) => painted(block) > 0.999));
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text))!.click();

    let lowest = 1;
    let sampled = 0;
    for (let frame = 0; frame < 5; frame++) {
      for (const block of inView()) {
        // Photos that were still arriving when the button was pressed keep their normal reveal, so skip those
        if (existing.has(block) && !settled.has(block)) continue;
        lowest = Math.min(lowest, painted(block));
        sampled++;
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    return { lowest, sampled };
  }, buttonText);
}

test.describe("gallery photos already in view stay visible (D-44, #33)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/media");
    await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
    const firstBlock = page.locator('ul[aria-labelledby="gallery-heading"] > li > div').first();
    await expect.poll(() => firstBlock.evaluate(paintedOpacity), { timeout: 5000 }).toBeGreaterThan(0.999);
  });

  test("changing the tab", async ({ page }) => {
    const { lowest, sampled } = await lowestOpacityInViewAfterClick(page, "Modeling");

    expect(sampled, "photos in view were sampled").toBeGreaterThan(0);
    expect(lowest).toBeGreaterThan(0.999);
  });

  test("Load more", async ({ page }) => {
    await page.getByRole("button", { name: "Load more" }).scrollIntoViewIfNeeded();
    const { lowest, sampled } = await lowestOpacityInViewAfterClick(page, "Load more");

    expect(sampled, "photos in view were sampled").toBeGreaterThan(0);
    expect(lowest).toBeGreaterThan(0.999);
  });
});

// About timeline line (D-44, #34). Deliberately light (Ashley, 2026-11-08): one short test per behaviour.
// "How much is drawn" is read from the line's computed `clip-path` (the clip is the one mechanism, in `DrawLine`);
// `none` means nothing is clipped.
const READING_HEIGHT = 0.6; // where the drawn tip sits on screen; the same fraction as `TIP_AT` in DrawLine.tsx

/** Fraction of the line that is drawn, 0 to 1 */
const drawnFraction = (page: Page) =>
  page.getByTestId("timeline-line").evaluate((line) => {
    const clip = getComputedStyle(line).clipPath;
    if (clip === "none") return 1;
    const bottom = /inset\(\S+ \S+ ([\d.]+)%/.exec(clip);
    if (!bottom) throw new Error(`Unexpected clip-path: ${clip}`);
    return 1 - parseFloat(bottom[1]) / 100;
  });

/**
 * Scrolls so the centre of the nth timeline node sits at the reading height and returns where the tip is relative
 * to it. The entry rises 40px as it arrives (`Reveal`), so it scrolls once to reveal it, waits for it to settle
 * and aims again; measuring a moving node would blame the line for the entry's rise.
 */
async function tipMinusNode(page: Page, nodeIndex: number) {
  return page.evaluate(
    async ({ nodeIndex, readingHeight }) => {
      const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const nodes = document.querySelectorAll('ol[aria-label="My Journey"] > li > span');
      const node = nodes[nodeIndex === -1 ? nodes.length - 1 : nodeIndex];
      const aim = () => {
        const box = node.getBoundingClientRect();
        window.scrollBy(0, box.top + box.height / 2 - innerHeight * readingHeight);
      };
      aim();
      const entry = node.parentElement!;
      for (let i = 0; i < 300 && parseFloat(getComputedStyle(entry).opacity) < 0.999; i++) await frames();
      aim();
      await frames();
      const line = document.querySelector<HTMLElement>('[data-testid="timeline-line"]')!;
      const clip = /inset\(\S+ \S+ ([\d.]+)%/.exec(getComputedStyle(line).clipPath);
      const drawn = clip ? 1 - parseFloat(clip[1]) / 100 : 1;
      const tipY = line.getBoundingClientRect().top + drawn * line.offsetHeight;
      const after = node.getBoundingClientRect();
      return tipY - (after.top + after.height / 2);
    },
    { nodeIndex, readingHeight: READING_HEIGHT },
  );
}

test.describe("About timeline line draws as you scroll (D-44, #34)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("T1: nothing before the list, the tip stays at the reading height, full at the end", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/about");
    await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
    const list = page.getByRole("list", { name: "My Journey" });

    // The list's top is still below the reading height: nothing is drawn
    await list.evaluate(async (el) => {
      window.scrollBy(0, el.getBoundingClientRect().top - innerHeight * 0.9);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    expect(await drawnFraction(page), "before the list").toBeLessThan(0.01);

    // The tip meets each node as that node reaches the reading height (first, then last)
    expect(Math.abs(await tipMinusNode(page, 0)), "first node").toBeLessThan(3);
    expect(Math.abs(await tipMinusNode(page, -1)), "last node").toBeLessThan(3);

    // Scrolled to the very end the whole line is there
    await page.evaluate(async () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    expect(await drawnFraction(page), "at the end").toBeGreaterThan(0.999);
  });

  for (const emulation of [
    { label: "T2: reduced motion", media: undefined, reducedMotion: "reduce" as const },
    { label: "T3: print", media: "print" as const, reducedMotion: "no-preference" as const },
  ]) {
    test(`${emulation.label} shows the whole line without scrolling`, async ({ page }) => {
      await page.emulateMedia({ media: emulation.media, reducedMotion: emulation.reducedMotion });
      await page.goto("/about");

      expect(await drawnFraction(page)).toBeGreaterThan(0.999);
    });
  }

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("T4: shows the whole line", async ({ page }) => {
      await page.goto("/about");

      expect(await drawnFraction(page)).toBeGreaterThan(0.999);
    });
  });
});

// T5 runs on both projects (desktop and phone width): the line is where it always was, hanging from the nodes
test("T5: the line runs through the nodes and along the whole list", async ({ page }) => {
  await page.goto("/about");
  const line = (await page.getByTestId("timeline-line").boundingBox())!;
  const list = (await page.getByRole("list", { name: "My Journey" }).boundingBox())!;
  const node = (await page.locator('ol[aria-label="My Journey"] > li > span').first().boundingBox())!;

  // The 2px border sits just right of the node's centre line, so allow a pixel and a half
  expect(Math.abs(line.x + line.width / 2 - (node.x + node.width / 2))).toBeLessThanOrEqual(1.5);
  expect(Math.abs(line.y - list.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(line.y + line.height - (list.y + list.height))).toBeLessThanOrEqual(1);
});
