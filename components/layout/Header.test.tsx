import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the MF monogram", () => {
    render(<Header />);

    expect(screen.getByText("MF")).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "about" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "media" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "resume" })).toBeInTheDocument();
  });
});
