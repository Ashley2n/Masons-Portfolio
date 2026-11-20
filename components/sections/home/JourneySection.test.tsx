import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeImages } from "@/content/home";
import JourneySection from "./JourneySection";

describe("JourneySection", () => {
  // Mason's head is near the top of the photo; a centred 21:9 crop cuts it off (docs/feedback.md, 2026-11-15)
  it("anchors the Journey photo to the top so the crop keeps Mason's head", () => {
    render(<JourneySection />);

    expect(screen.getByRole("img", { name: homeImages.journey.alt })).toHaveClass("object-top");
  });
});
