import { describe, expect, it } from "vitest";
import { alt, contentType, size } from "./opengraph-image";

describe("link-preview image", () => {
  it("uses the 1200×630 size that social sites expect", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });

  it("describes the image for screen readers", () => {
    expect(alt).toMatch(/Mason Farrington/);
  });
});
