import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Footer from "./Footer";

// Use a sample profile so link behavior is tested even while real socials are hidden (Q C7)
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    socialLinks: [
      { id: "instagram", label: "Instagram", href: "https://www.instagram.com/example/" },
      ...actual.socialLinks,
    ],
  };
});

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

    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps the email link in the same tab", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
  });

  it("links the email address and shows the location", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "masonfarrington@gmail.com" }),
    ).toHaveAttribute("href", "mailto:masonfarrington@gmail.com");
    expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
  });
});
