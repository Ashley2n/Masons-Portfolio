import { describe, expect, it } from "vitest";
import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("matches the exact page", () => {
    expect(isActivePath("/media", "/media")).toBe(true);
  });

  it("matches nested pages under a section", () => {
    expect(isActivePath("/media/performances", "/media")).toBe(true);
  });

  it("does not match a different page that shares a prefix", () => {
    expect(isActivePath("/mediakit", "/media")).toBe(false);
  });

  it("only matches home on the home page itself", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("ignores a trailing slash", () => {
    expect(isActivePath("/about/", "/about")).toBe(true);
  });
});
