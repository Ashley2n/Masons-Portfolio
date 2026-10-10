import { describe, expect, it } from "vitest";
import { getNextIndex } from "./carousel";

describe("getNextIndex", () => {
  it("moves to the next index", () => {
    expect(getNextIndex(0, 5)).toBe(1);
    expect(getNextIndex(3, 5)).toBe(4);
  });

  it("wraps from the last index back to the first", () => {
    expect(getNextIndex(4, 5)).toBe(0);
  });

  it("stays on the only item when there is one", () => {
    expect(getNextIndex(0, 1)).toBe(0);
  });

  it("returns 0 for an empty list", () => {
    expect(getNextIndex(0, 0)).toBe(0);
  });
});
