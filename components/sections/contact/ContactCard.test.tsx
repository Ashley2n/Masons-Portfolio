import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contactInfo } from "@/content/site";
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

  it("shows the email and the location as plain lines without icons (D-39)", () => {
    const { container } = render(<ContactCard />);

    const email = screen.getByRole("link", { name: contactInfo.email });
    const location = screen.getByText(contactInfo.location);
    expect(email.querySelector("svg")).toBeNull();
    expect(location.querySelector("svg")).toBeNull();
    // No icon in any contact row (the Follow links' arrows only show when a profile exists)
    expect(container.querySelector("li svg")).toBeNull();
  });

  it("reads email, then location, then the resume button, then the quote", () => {
    render(<ContactCard />);

    const inOrder = [
      screen.getByRole("link", { name: contactInfo.email }),
      screen.getByText(contactInfo.location),
      screen.getByRole("button", { name: /resume/i }),
      screen.getByRole("blockquote"),
    ];
    inOrder.slice(1).forEach((node, i) => {
      expect(inOrder[i].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  it("shows no phone link while Mason's number is withheld (D-35)", () => {
    const { container } = render(<ContactCard />);

    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
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
