import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionHeading from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders the eyebrow, an h2 title and the description", () => {
    render(
      <SectionHeading
        eyebrow="About Me"
        title="The Journey So Far"
        description="Years of training"
      />,
    );

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The Journey So Far" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Years of training")).toBeInTheDocument();
  });

  it("can render the title as the page's h1", () => {
    render(<SectionHeading eyebrow="Media" title="Moments. Stories. Vision." as="h1" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Moments. Stories. Vision." }),
    ).toBeInTheDocument();
  });

  it("omits the description when none is given", () => {
    const { container } = render(<SectionHeading eyebrow="Expertise" title="What I Do" />);

    expect(container.querySelectorAll("p")).toHaveLength(1); // eyebrow only
  });
});
