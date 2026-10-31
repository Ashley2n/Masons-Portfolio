import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SocialLink } from "@/types/content";
import Footer from "./Footer";

// Mason links no profiles today (D-30), so each test picks the list it needs
const content = vi.hoisted(() => ({ socialLinks: [] as SocialLink[] }));
const sampleProfile: SocialLink = { id: "instagram", label: "Instagram", href: "https://www.instagram.com/example/" };

vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    get socialLinks() {
      return content.socialLinks;
    },
  };
});

describe("Footer", () => {
  afterEach(() => {
    vi.useRealTimers();
    content.socialLinks = [];
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
      "Contact",
    ]);
  });

  it("hides the Connect column when there are no social links, keeping Navigation and Contact", () => {
    render(<Footer />);

    expect(screen.queryByRole("heading", { name: "Connect" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading").map((heading) => heading.textContent)).toEqual([
      "Navigation",
      "Contact",
    ]);
  });

  it("shows the Connect column and opens social profiles in a new tab when one exists", () => {
    content.socialLinks = [sampleProfile];
    render(<Footer />);

    expect(screen.getByRole("heading", { name: "Connect" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/example/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links the email address and shows the location", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "mason.13.farrington@gmail.com" }),
    ).toHaveAttribute("href", "mailto:mason.13.farrington@gmail.com");
    expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
  });
});
