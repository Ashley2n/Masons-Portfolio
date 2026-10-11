import { describe, expect, it } from "vitest";
import { pageSeo } from "@/content/seo";
import { metadata as about } from "./about/page";
import { metadata as contact } from "./contact/page";
import { metadata as media } from "./media/page";
import { metadata as home } from "./page";
import { metadata as resume } from "./resume/page";

const pages = { home, about, media, resume, contact };

describe.each(Object.entries(pages))("%s page metadata", (key, metadata) => {
  const seo = pageSeo[key as keyof typeof pageSeo];

  it("has its own description", () => {
    expect(metadata.description).toBe(seo.description);
  });

  it("sets its canonical URL", () => {
    expect(metadata.alternates?.canonical).toBe(seo.path);
  });

  it("sets link-preview tags", () => {
    expect(metadata.openGraph).toMatchObject({ url: seo.path, description: seo.description });
  });
});
