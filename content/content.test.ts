import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { aboutContent, milestones } from "./about";
import { expertiseItems, homeImages, modelShots, stats, videos } from "./home";
import { galleryCategoryIds, type Photo } from "@/types/content";
import { galleryCategories, galleryItems } from "./media";
import { pageSeo } from "./seo";
import { contactInfo, navLinks, socialLinks } from "./site";

const expectUniqueIds = (items: { id: string }[]) => {
  const ids = items.map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
};

describe("home content", () => {
  it.each([
    ["stats", stats],
    ["expertiseItems", expertiseItems],
    ["videos", videos],
    ["modelShots", modelShots],
  ])("%s have unique, non-empty ids", (_, items) => {
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => expect(item.id).toMatch(/^[a-z0-9-]+$/));
    expectUniqueIds(items);
  });

  it("every model shot is one of Mason's own photos, with alt text and no stock credit (D-24)", () => {
    modelShots.forEach((shot) => {
      expect(shot.src).toMatch(/^\/images\/media\/modeling\//);
      expect(existsSync(join(process.cwd(), "public", shot.src))).toBe(true);
      expect(shot.alt.trim()).not.toBe("");
      expect(shot.credit).toBeUndefined();
      // The carousel shows portrait photos whole on wide screens, so it needs the real size
      expect(shot.width).toBeGreaterThan(0);
      expect(shot.height).toBeGreaterThan(0);
    });
  });

  it("every expertise card has one of Mason's own gallery photos with alt text, and no link (D-33, D-24)", () => {
    expertiseItems.forEach((item) => {
      expect(item.image.src).toMatch(/^\/images\/media\//);
      expect(existsSync(join(process.cwd(), "public", item.image.src))).toBe(true);
      expect(item.image.alt.trim()).not.toBe("");
      expect(item.image.width).toBeGreaterThan(0);
      expect(item.image.height).toBeGreaterThan(0);
      expect("href" in item).toBe(false);
    });
  });

  it("the Journey image is one of Mason's own photos, with no stock credit (D-24)", () => {
    expect(homeImages.journey.src).toMatch(/^\/images\/media\//);
    expect(existsSync(join(process.cwd(), "public", homeImages.journey.src))).toBe(true);
    expect(homeImages.journey.alt.trim()).not.toBe("");
    expect("credit" in homeImages.journey).toBe(false);
  });

  it("the hero is Mason's own portrait, with alt text and no stock credit (F5)", () => {
    expect(existsSync(join(process.cwd(), "public", homeImages.hero.src))).toBe(true);
    expect(homeImages.hero.alt.trim()).not.toBe("");
    expect("credit" in homeImages.hero).toBe(false);
  });

  it("only Mason's real reels are on the site, the Intro Video featured on the homepage (D-32, F3)", () => {
    expect(videos).toEqual([
      expect.objectContaining({
        platform: "youtube",
        youtubeId: "1BnBTdARUHk",
        title: "Mason Farrington Intro Video",
        featured: true,
      }),
      expect.objectContaining({ youtubeId: "sK9xduGWTaQ", title: "Mason Farrington Vocal Reel" }),
      expect.objectContaining({ youtubeId: "3yPWsqxpAa8", title: "Mason Farrington Dance Reel" }),
      expect.objectContaining({ youtubeId: "VdFlh2DAS20", title: "Mason Farrington Acting Reel" }),
    ]);
    expect(videos.filter((v) => v.featured)).toHaveLength(1);
  });

  // Mason's feedback 2026-11-08 (docs/feeback.md "Thumbnails", #37). Only these two: the Intro Video and the Vocal Reel
  // keep YouTube's own thumbnail.
  it("the Dance and Acting reels use Mason's own thumbnails, small files with alt text (#37)", () => {
    for (const id of ["dance-reel", "acting-reel"]) {
      const video = videos.find((v) => v.id === id);
      if (video?.platform !== "youtube") throw new Error(`${id} should be a YouTube video`);
      const file = join(process.cwd(), "public", video.thumbnail?.src ?? "missing");
      expect(video.thumbnail?.src, id).toMatch(/^\/images\/home\/.+\.jpg$/);
      expect(existsSync(file), `${id} file exists`).toBe(true);
      // The supplied Acting image was 31 MB; a thumbnail should stay a few hundred KB at most
      expect(statSync(file).size, `${id} file size`).toBeLessThan(300_000);
      expect(video.thumbnail?.alt.trim(), `${id} alt`).not.toBe("");
    }
    const others = videos.filter((v) => !["dance-reel", "acting-reel"].includes(v.id));
    others.forEach((v) => expect("thumbnail" in v, v.id).toBe(false));
  });

  // Mason's feedback 2026-11-08 (docs/feeback.md "About Image Sections", #38). Show titles are *starred* for italics.
  it("the About timeline copy is the text Mason supplied (#38)", () => {
    const byId = (id: string) => milestones.find((m) => m.id === id);
    expect(byId("found-the-stage")?.title).toBe("Found the Stage");
    expect(byId("first-role")?.description).toBe(
      "Stepped into my first musical production and was chosen as Dance Captain for the Show Choir my senior year of high school — the moment that revealed what real teamwork, passion, and hard work could look like, and pulled me toward a life on stage.",
    );
    expect(byId("went-all-in")?.description).toBe(
      'After exploring "safer" career options, I soon found out that my passion truly lay in performance. So I declared a major in Musical Theatre and immediately explored aspects of the field, including performing, designing, and directing.',
    );
    expect(byId("american-gothic")?.title).toBe("First Regional Contract");
    expect(byId("american-gothic")?.description).toBe(
      "I had the opportunity to join American Gothic Performing Arts as Diesel in *West Side Story* and Ensemble in *Grease* for an exciting first professional theatre experience.",
    );
  });

  // Mason's feedback 2026-11-14 (docs/feeback.md, #41; typos fixed and approved by Ashley on the issue). Both entries are
  // goals, so they stay "ongoing" with no photo: the layout test in e2e/about.spec.ts relies on the last one having none.
  it("the last two About timeline entries are Broadway and Movie Actor, ongoing and without a photo (#41)", () => {
    const last = milestones.slice(-2);
    expect(last.map((m) => ({ id: m.id, title: m.title, status: m.status, hasImage: "image" in m }))).toEqual([
      { id: "broadway", title: "Broadway", status: "ongoing", hasImage: false },
      { id: "movie-actor", title: "Movie Actor", status: "ongoing", hasImage: false },
    ]);
    expect(last.map((m) => m.description)).toEqual([
      "Working towards reaching the pinnacle of theatre, one step, one lesson, audition, role, and performance at a time.",
      "Expanding into film and television and bringing stories to life on screen is a goal for later in my career that I am working towards currently.",
    ]);
  });

  // Mason's own photos for the first four timeline entries (#38): small files, alt text, no stock credit (D-24)
  it("the four timeline photos are Mason's own, small files with alt text and no credit (#38)", () => {
    const expected = {
      "found-the-stage": "/images/about/found-the-stage.jpg",
      "first-role": "/images/about/first-role.jpg",
      "went-all-in": "/images/about/went-all-in.jpg",
      "american-gothic": "/images/about/first-regional-contract.jpg",
    };
    expect(milestones.filter((m) => m.image).map((m) => m.id)).toEqual(Object.keys(expected));
    for (const [id, src] of Object.entries(expected)) {
      const image = milestones.find((m) => m.id === id)?.image;
      expect(image?.src, id).toBe(src);
      const file = join(process.cwd(), "public", src);
      expect(existsSync(file), `${id} file exists`).toBe(true);
      expect(statSync(file).size, `${id} file size`).toBeLessThan(300_000);
      expect(image?.alt.trim(), `${id} alt`).not.toBe("");
      expect("credit" in (image ?? {}), `${id} credit`).toBe(false);
    }
  });

  // The Designer card is still a stock photo until Mason replaces it (D-24)
  it("the About feature image exists in public/ and credits its photographer", () => {
    const image: Photo = aboutContent.feature.image;
    expect(existsSync(join(process.cwd(), "public", image.src))).toBe(true);
    expect(image.alt.trim()).not.toBe("");
    expect(image.credit).toMatch(/ \/ Unsplash$/);
  });
});

describe("site content", () => {
  it("nav links point to About, Media and Contact (the resume opens in a modal instead)", () => {
    expect(navLinks).toEqual([
      { label: "About", href: "/about" },
      { label: "Media", href: "/media" },
      { label: "Contact", href: "/contact" },
    ]);
  });

  it("social links may be empty, but every link is an absolute https URL with a unique id (D-30)", () => {
    socialLinks.forEach((link) => expect(link.href).toMatch(/^https:\/\//));
    expectUniqueIds(socialLinks);
  });

  it("social links have no Email entry; email lives in the Contact column instead (D-30)", () => {
    expect(socialLinks.find((link) => link.id === "email" || link.href.startsWith("mailto:"))).toBeUndefined();
  });

  it("social links point to real profiles, not placeholder homepages", () => {
    socialLinks
      .filter((link) => link.href.startsWith("https://"))
      .forEach((link) => expect(new URL(link.href).pathname).not.toBe("/"));
  });

  it("contact info has a valid email and a location", () => {
    expect(contactInfo.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    expect(contactInfo.location.trim()).not.toBe("");
  });

  it("uses the email on Mason's resume (D-31)", () => {
    expect(contactInfo.email).toBe("mason.13.farrington@gmail.com");
  });

  it("has no other real email address anywhere in the site content", () => {
    // Form placeholders use the reserved example.com domain (RFC 2606), not a real inbox
    const addresses = readdirSync(__dirname)
      .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
      .flatMap((file) => readFileSync(join(__dirname, file), "utf8").match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? [])
      .filter((address) => !address.endsWith("@example.com"));

    expect(new Set(addresses)).toEqual(new Set(["mason.13.farrington@gmail.com"]));
  });

  it("keeps the phone number off the site's pages (D-35)", () => {
    expect(contactInfo.phone).toBeUndefined();
  });
});

describe("media gallery content", () => {
  it("has unique item ids", () => {
    expectUniqueIds(galleryItems);
  });

  it("every photo is Mason's own: it exists, has alt text and its real size, and no stock credit (D-24)", () => {
    galleryItems.forEach((item) => {
      if (item.kind !== "photo") return;
      expect(item.photo.src).toMatch(new RegExp(`^/images/media/${item.category}/`));
      expect(existsSync(join(process.cwd(), "public", item.photo.src))).toBe(true);
      expect(item.photo.alt.trim(), `alt text for ${item.id}`).not.toBe("");
      expect(item.photo.credit).toBeUndefined();
      expect(item.photo.width).toBeGreaterThan(0);
      expect(item.photo.height).toBeGreaterThan(0);
    });
  });

  it("files every reel under Other and keeps no Blender placeholder videos (D-32, F3)", () => {
    const galleryVideos = galleryItems.flatMap((item) =>
      item.kind === "video" ? [{ category: item.category, youtubeId: item.video.platform === "youtube" ? item.video.youtubeId : undefined }] : [],
    );
    expect(galleryVideos).toEqual(
      expect.arrayContaining(
        ["1BnBTdARUHk", "sK9xduGWTaQ", "3yPWsqxpAa8", "VdFlh2DAS20"].map((youtubeId) => ({ category: "other", youtubeId })),
      ),
    );
    expect(galleryVideos).toHaveLength(4);
  });

  it("labels the filters in the order Mason asked for (D-43)", () => {
    expect(galleryCategories.map((c) => c.label)).toEqual([
      "All",
      "Staged",
      "Modeling",
      "Concerts",
      "Recital",
      "Design",
      "Other",
    ]);
  });

  it("no longer shows the five Staged photos Mason asked to have removed (D-43)", () => {
    // docs/feeback.md: the two sofa scenes, the red-light cape shot, and the two sweater-vest shots
    const removed = ["staged-12", "staged-19", "staged-20", "staged-21", "staged-33"];
    const shown = new Set(galleryItems.map((item) => item.id));
    expect(removed.filter((id) => shown.has(id))).toEqual([]);
  });

  it("uses every image file in public/images/media, so no stock leftovers ship", () => {
    const dir = join(process.cwd(), "public", "images", "media");
    const files = readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".jpg"))
      .map((file) => `/images/media/${file.split("\\").join("/")}`);
    const used = new Set(galleryItems.flatMap((item) => (item.kind === "photo" ? [item.photo.src] : [])));
    expect(files.filter((src) => !used.has(src))).toEqual([]);
  });

  it("offers a filter for every category, and every category has items", () => {
    expect(galleryCategories.map((c) => c.id)).toEqual(["all", ...galleryCategoryIds]);
    for (const id of galleryCategoryIds) {
      expect(galleryItems.some((item) => item.category === id)).toBe(true);
    }
  });
});

describe("SEO content", () => {
  const pages = Object.values(pageSeo);

  it("gives every page a unique description", () => {
    const descriptions = pages.map((page) => page.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps descriptions short enough that search results don't cut them off", () => {
    pages.forEach((page) => expect(page.description.length).toBeLessThanOrEqual(160));
  });

  it("covers every page in the nav", () => {
    const paths = pages.map((page) => page.path);
    navLinks.forEach((link) => expect(paths).toContain(link.href));
  });
});
