import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionHeading from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders an h2 title and the description, with no label above the title (D-38)", () => {
    const { container } = render(
      <SectionHeading title="The Journey So Far" description="Years of training" />,
    );

    expect(container.querySelectorAll("p")).toHaveLength(1); // the description only
    expect(
      screen.getByRole("heading", { level: 2, name: "The Journey So Far" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Years of training")).toBeInTheDocument();
  });

  it("can render the title as the page's h1", () => {
    render(<SectionHeading title="Moments. Stories. Vision." as="h1" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Moments. Stories. Vision." }),
    ).toBeInTheDocument();
  });

  it("omits the description when none is given", () => {
    const { container } = render(<SectionHeading title="What I Do" />);

    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
