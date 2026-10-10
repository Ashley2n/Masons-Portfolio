import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/about page", () => {
  it("renders the page heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "About Me" }),
    ).toBeInTheDocument();
  });

  it("is titled 'About'", () => {
    expect(metadata.title).toBe("About");
  });
});
