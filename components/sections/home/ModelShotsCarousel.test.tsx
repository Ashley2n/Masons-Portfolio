import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { modelShots } from "@/content/home";
import ModelShotsCarousel from "./ModelShotsCarousel";

const total = modelShots.length;
// Thumbnails are decorative (their buttons are labelled), so the only announced image is the current photo
const currentImage = () => screen.getByRole("img");

describe("ModelShotsCarousel", () => {
  it("is a labelled carousel region with a heading", () => {
    render(<ModelShotsCarousel />);

    const region = screen.getByRole("region", { name: "Model Shots" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("heading", { level: 2, name: "Model Shots" })).toBeInTheDocument();
  });

  it("starts on the first photo and announces the position", () => {
    render(<ModelShotsCarousel />);

    expect(currentImage()).toHaveAttribute("alt", modelShots[0].alt);
    expect(screen.getByText(`Photo 1 of ${total}`)).toBeInTheDocument();
  });

  it("moves forward with Next and wraps to the first photo", async () => {
    const user = userEvent.setup();
    render(<ModelShotsCarousel />);
    const next = screen.getByRole("button", { name: "Next photo" });

    await user.click(next);
    expect(currentImage()).toHaveAttribute("alt", modelShots[1].alt);
    expect(screen.getByText(`Photo 2 of ${total}`)).toBeInTheDocument();

    for (let i = 1; i < total; i++) await user.click(next);
    expect(currentImage()).toHaveAttribute("alt", modelShots[0].alt);
  });

  it("moves back with Previous and wraps to the last photo", async () => {
    const user = userEvent.setup();
    render(<ModelShotsCarousel />);

    await user.click(screen.getByRole("button", { name: "Previous photo" }));

    expect(currentImage()).toHaveAttribute("alt", modelShots[total - 1].alt);
  });

  it("jumps to a photo from its thumbnail and marks it current", async () => {
    const user = userEvent.setup();
    render(<ModelShotsCarousel />);
    const third = screen.getByRole("button", { name: `Show photo 3 of ${total}` });

    await user.click(third);

    expect(currentImage()).toHaveAttribute("alt", modelShots[2].alt);
    expect(third).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: `Show photo 1 of ${total}` })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("supports the arrow keys while focus is inside the carousel", async () => {
    const user = userEvent.setup();
    render(<ModelShotsCarousel />);

    screen.getByRole("button", { name: "Next photo" }).focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(currentImage()).toHaveAttribute("alt", modelShots[2].alt);

    await user.keyboard("{ArrowLeft}");
    expect(currentImage()).toHaveAttribute("alt", modelShots[1].alt);
  });
});
