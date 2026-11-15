import { describe, expect, it } from "vitest";
import { parseCount } from "./CountUp";

// D-44 (#35): only a plain run of digits counts up; anything else is shown as written, with no animation
describe("parseCount", () => {
  it.each([
    ["10", 10],
    ["12", 12],
    ["4", 4],
    ["0", 0],
  ])("reads %j as the whole number %i", (value, expected) => {
    expect(parseCount(value)).toBe(expected);
  });

  it.each(["1.5", "1,200", "10-12", "5k", "", " 4", "-4", "ten"])("leaves %j to be shown as written", (value) => {
    expect(parseCount(value)).toBeNull();
  });
});
