import { describe, expect, it } from "vitest";
import { imageDataUrl, shareImageVersion } from "./share-image";

describe("shareImageVersion", () => {
  const photo = Buffer.from("photo bytes");

  it("stays the same while the photo and text are unchanged", () => {
    expect(shareImageVersion(photo, "Mason")).toBe(shareImageVersion(Buffer.from("photo bytes"), "Mason"));
  });

  it("changes when the photo is replaced, even under the same file name", () => {
    expect(shareImageVersion(Buffer.from("new photo"), "Mason")).not.toBe(
      shareImageVersion(photo, "Mason"),
    );
  });

  it("changes when the text on the image changes", () => {
    expect(shareImageVersion(photo, "New tagline")).not.toBe(shareImageVersion(photo, "Mason"));
  });
});

describe("imageDataUrl", () => {
  const bytes = Buffer.from("abc");

  it.each([
    ["/images/hero.jpg", "image/jpeg"],
    ["/images/hero.JPEG", "image/jpeg"],
    ["/images/hero.png", "image/png"],
  ])("labels %s as %s", (src, type) => {
    expect(imageDataUrl(bytes, src)).toBe(`data:${type};base64,${bytes.toString("base64")}`);
  });

  it("explains which formats work when given one the image renderer can't read", () => {
    expect(() => imageDataUrl(bytes, "/images/hero.webp")).toThrow(/JPEG or PNG.*hero\.webp/);
  });
});
