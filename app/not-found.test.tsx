import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { notFoundContent } from "@/content/not-found";
import { navLinks } from "@/content/site";
import NotFound, { metadata } from "./not-found";

describe("404 page", () => {
  it("is titled 'Page not found'", () => {
    expect(metadata.title).toBe("Page not found");
  });

  it("explains that the page doesn't exist", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: notFoundContent.title })).toBeInTheDocument();
    expect(screen.getByText(notFoundContent.description)).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: notFoundContent.homeLabel })).toHaveAttribute("href", "/");
  });

  it("suggests the main pages", () => {
    render(<NotFound />);

    const suggestions = screen.getByRole("navigation", { name: notFoundContent.suggestionsLabel });
    navLinks.forEach((link) =>
      expect(within(suggestions).getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      ),
    );
  });
});
