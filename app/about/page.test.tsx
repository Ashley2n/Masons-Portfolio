import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { aboutContent, milestones } from "@/content/about";
import Page, { metadata } from "./page";

describe("/about page", () => {
  it("is titled 'About'", () => {
    expect(metadata.title).toBe("About");
  });

  describe("intro (copy from the About mockup)", () => {
    it("has the page heading, both intro paragraphs and the signature", () => {
      render(<Page />);

      expect(screen.getByRole("heading", { level: 1, name: "About Me" })).toBeInTheDocument();
      expect(
        screen.getByText(
          "I'm a multidisciplinary artist creating meaningful experiences through performance and design.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/I bring creativity, discipline, and purpose to every project I take on\./),
      ).toBeInTheDocument();
      expect(screen.getByText("Mason F.")).toBeInTheDocument();
    });

    it("shows a feature card linking to the media page", () => {
      render(<Page />);

      const card = screen.getByRole("link", { name: /^Designer/ });
      expect(card).toHaveAttribute("href", "/media");
      expect(card).toHaveTextContent("Branding & Digital Design");
      expect(within(card).getByAltText(aboutContent.feature.image.alt)).toBeInTheDocument();
    });
  });

  describe("journey timeline", () => {
    it("is headed 'My Journey' under a 'My Story' eyebrow", () => {
      render(<Page />);

      expect(screen.getByText("My Story")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "My Journey" })).toBeInTheDocument();
    });

    it("lists the six milestones in order with their numbers", () => {
      render(<Page />);

      const items = within(screen.getByRole("list", { name: "My Journey" })).getAllByRole(
        "listitem",
      );
      expect(items.map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual([
        "Found the Stage",
        "First Role, First Spark",
        "Went All In",
        "Joined American Gothic Performing Arts",
        "America's Got Talent",
        "Movie Actor",
      ]);
      expect(items.map((li) => within(li).getByText(/^0\d$/).textContent)).toEqual([
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
      ]);
    });

    it("contains only list items directly inside the list (valid HTML)", () => {
      render(<Page />);

      const list = screen.getByRole("list", { name: "My Journey" });
      expect([...list.children].map((child) => child.tagName)).toEqual(Array(6).fill("LI"));
    });

    it("tells screen readers which milestones are completed and which are in progress", () => {
      render(<Page />);

      const items = within(screen.getByRole("list", { name: "My Journey" })).getAllByRole(
        "listitem",
      );
      milestones.forEach((milestone, i) => {
        expect(items[i]).toHaveTextContent(
          milestone.status === "complete" ? "Completed" : "In progress",
        );
      });
    });

    it("shows each milestone's image", () => {
      render(<Page />);

      milestones
        .filter((m) => m.image)
        .forEach((m) => expect(screen.getByAltText(m.image!.alt)).toBeInTheDocument());
    });
  });

  it("ends with the get-in-touch banner", () => {
    render(<Page />);

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/contact");
  });

  it("offers the resume in a modal", () => {
    render(<Page />);

    expect(screen.getByRole("button", { name: "View resume" })).toBeInTheDocument();
  });
});
