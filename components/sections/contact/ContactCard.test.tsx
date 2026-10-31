import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SocialLink } from "@/types/content";
import ContactCard from "./ContactCard";

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

describe("ContactCard", () => {
  afterEach(() => {
    content.socialLinks = [];
  });

  it("hides the Follow section when there are no social links", () => {
    render(<ContactCard />);

    expect(screen.queryByText("Follow")).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Follow" })).not.toBeInTheDocument();
  });

  it("lists social profiles under Follow, opening in a new tab, when one exists", () => {
    content.socialLinks = [sampleProfile];
    render(<ContactCard />);

    const follow = screen.getByRole("list", { name: "Follow" });
    const link = within(follow).getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/example/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
