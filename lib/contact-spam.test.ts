import { describe, expect, it } from "vitest";
import { isSpamSubmission } from "./contact-spam";

// Fixed clock: the form "loaded" at 1_000 ms and the visitor submits at 10_000 ms (9 s later, well past the minimum)
const NOW = 10_000;
const human = { website: "", startedAt: 1_000 };

describe("isSpamSubmission", () => {
  it("flags a submission where the hidden honeypot field was filled in", () => {
    expect(isSpamSubmission({ ...human, website: "https://spam.example" }, NOW)).toBe(true);
  });

  it("lets through a human who left the honeypot empty and took 9 seconds", () => {
    expect(isSpamSubmission(human, NOW)).toBe(false);
  });

  it("flags a submission sent 2.999 seconds after the form loaded", () => {
    expect(isSpamSubmission({ ...human, startedAt: NOW - 2_999 }, NOW)).toBe(true);
  });

  it("lets through a submission sent exactly 3 seconds after the form loaded", () => {
    expect(isSpamSubmission({ ...human, startedAt: NOW - 3_000 }, NOW)).toBe(false);
  });

  it("flags a load time that is in the future", () => {
    expect(isSpamSubmission({ ...human, startedAt: NOW + 5_000 }, NOW)).toBe(true);
  });

  it.each([
    ["missing", undefined],
    ["null", null],
    ["a string", "1000"],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
  ])("flags a load time that is %s", (_label, startedAt) => {
    expect(isSpamSubmission({ ...human, startedAt }, NOW)).toBe(true);
  });
});
