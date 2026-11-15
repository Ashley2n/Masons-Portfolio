import { describe, expect, it } from "vitest";
import { parseEmphasis } from "./emphasis";

describe("parseEmphasis", () => {
  it("splits *star* pairs into emphasised segments, keeping the plain text around them", () => {
    expect(
      parseEmphasis("Diesel in *West Side Story* and Ensemble in *Grease* for a first role"),
    ).toEqual([
      { text: "Diesel in ", em: false },
      { text: "West Side Story", em: true },
      { text: " and Ensemble in ", em: false },
      { text: "Grease", em: true },
      { text: " for a first role", em: false },
    ]);
  });
});
