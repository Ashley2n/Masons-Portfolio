import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("skips falsy values and supports conditional objects", () => {
    expect(cn("base", false, undefined, null, { active: true, hidden: false })).toBe(
      "base active",
    );
  });

  it.each(["hero", "display", "h1", "h2", "h3", "body", "small", "caption"])(
    "keeps the custom text-%s size next to a text color (they don't conflict)",
    (size) => {
      expect(cn(`text-${size}`, "text-neutral-800")).toBe(`text-${size} text-neutral-800`);
    },
  );

  it("lets a later custom text size replace an earlier one", () => {
    expect(cn("text-small", "text-caption")).toBe("text-caption");
  });

  it("lets later Tailwind classes override conflicting earlier ones", () => {
    expect(cn("bg-white px-4", "bg-neutral-100")).toBe("px-4 bg-neutral-100");
  });
});
