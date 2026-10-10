import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/contact page", () => {
  it("renders the page heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Let's create something great." }),
    ).toBeInTheDocument();
  });

  it("is titled 'Contact'", () => {
    expect(metadata.title).toBe("Contact");
  });
});
