import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is the page's contentinfo landmark", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the copyright with the current year", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-05-01"));
    render(<Footer />);

    expect(screen.getByText(/© 2031 Mason Farrington/)).toBeInTheDocument();
  });

  it("repeats the page links in a footer navigation", () => {
    render(<Footer />);

    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "About",
      "Media",
      "Resume",
      "Contact",
    ]);
  });

  it("opens social profiles in a new tab", () => {
    render(<Footer />);

    for (const name of ["Instagram", "YouTube"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  it("links the email address and shows the location", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "masonfarrington@gmail.com" }),
    ).toHaveAttribute("href", "mailto:masonfarrington@gmail.com");
    expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
  });
});
