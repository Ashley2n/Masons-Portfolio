import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/resume page", () => {
  it("renders the page heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Resume" }),
    ).toBeInTheDocument();
  });

  it("is titled 'Resume'", () => {
    expect(metadata.title).toBe("Resume");
  });
  it("ends with the get-in-touch banner", () => {
    render(<Page />);

    expect(
      screen.getByRole("link", { name: "Get in touch" }),
    ).toHaveAttribute("href", "/contact");
  });
});
