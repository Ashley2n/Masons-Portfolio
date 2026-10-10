import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { contactContent } from "@/content/contact";
import { contactInfo, socialLinks } from "@/content/site";
import Page, { metadata } from "./page";

describe("/contact page", () => {
  it("is titled 'Contact'", () => {
    expect(metadata.title).toBe("Contact");
  });

  it("has the mockup heading, intro and the contact form", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Let's create something great." }),
    ).toBeInTheDocument();
    expect(screen.getByText(contactContent.intro)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  describe("contact info card", () => {
    const card = () => screen.getByRole("complementary", { name: "Contact info" });

    it("shows Mason's email and location", () => {
      render(<Page />);

      expect(within(card()).getByRole("heading", { name: "Mason Farrington" })).toBeInTheDocument();
      expect(
        within(card()).getByRole("link", { name: contactInfo.email }),
      ).toHaveAttribute("href", `mailto:${contactInfo.email}`);
      expect(within(card()).getByText(contactInfo.location)).toBeInTheDocument();
    });

    it("shows a phone link only when a number is set", () => {
      render(<Page />);

      const phoneLink = card().querySelector('a[href^="tel:"]');
      if (contactInfo.phone) expect(phoneLink).not.toBeNull();
      else expect(phoneLink).toBeNull();
    });

    it("lists the social links under Follow", () => {
      render(<Page />);

      const follow = within(card()).getByRole("list", { name: "Follow" });
      expect(within(follow).getAllByRole("link").map((a) => a.textContent)).toEqual(
        socialLinks.map((s) => s.label),
      );
    });

    it("shows the photo and the quote", () => {
      render(<Page />);

      expect(within(card()).getByAltText(contactContent.card.image.alt)).toBeInTheDocument();
      expect(within(card()).getByText(/Good art starts with a conversation\./)).toBeInTheDocument();
    });
  });

  it("does not show the get-in-touch banner on the contact page itself", () => {
    render(<Page />);

    expect(screen.queryByRole("link", { name: "Get in touch" })).not.toBeInTheDocument();
  });

  it("offers the resume in a modal", () => {
    render(<Page />);

    expect(screen.getByRole("button", { name: "View resume" })).toBeInTheDocument();
  });
});
