import { describe, expect, it } from "vitest";
import { metadata } from "./layout";

describe("site metadata", () => {
  it("uses Mason's name as the default title", () => {
    expect(metadata.title).toMatchObject({
      default: expect.stringContaining("Mason Farrington"),
    });
  });

  it("titles sub-pages as 'Page | Mason Farrington'", () => {
    expect(metadata.title).toMatchObject({ template: "%s | Mason Farrington" });
  });

  it("describes Mason, not the Next.js starter", () => {
    expect(metadata.description).toMatch(/multidisciplinary artist/i);
    expect(metadata.description).not.toMatch(/create next app/i);
  });
});
