import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeImages } from "@/content/home";
import Home from "./page";

describe("Home page", () => {
  describe("hero (copy from the homepage mockup)", () => {
    it("uses Mason's name as the page's only h1", () => {
      render(<Home />);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/^Mason\s*Farrington$/);
    });

    it("lists the four roles", () => {
      render(<Home />);

      const roles = screen.getByRole("list", { name: "Roles" });
      expect(within(roles).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
        "Actor",
        "Musician",
        "Singer",
        "Designer",
      ]);
    });

    it("shows the tagline, spelled correctly", () => {
      render(<Home />);

      expect(
        screen.getByText(
          "A multidisciplinary artist creating meaningful experiences through performance and design.",
        ),
      ).toBeInTheDocument();
    });

    it("shows the hero portrait and links View work to the media page", () => {
      render(<Home />);

      expect(screen.getByAltText(homeImages.hero.alt)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/media");
    });
  });

  it("orders the sections Hero → Model Shots → Journey → Expertise → Recent Work → CTA (C23)", () => {
    render(<Home />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent)
      // "Other Work" is a sub-part of Recent Work and may be hidden when empty (D-32).
      .filter((text) => text !== "Other Work");
    expect(headings).toEqual([
      "Model Shots",
      "The Journey So Far",
      "What I Do",
      "Recent Work",
      "Interested in working together?",
    ]);
    // The hero's h1 comes before every section heading.
    const h1 = screen.getByRole("heading", { level: 1 });
    const firstH2 = screen.getByRole("heading", { level: 2, name: "Model Shots" });
    expect(h1.compareDocumentPosition(firstH2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the journey stats with the mockup labels and image", () => {
    render(<Home />);

    for (const [metric, label] of [
      ["10", "theatrical/musical shows"],
      ["12", "concerts, competitions & live events"],
      ["4", "theatrical/musical shows"],
    ]) {
      expect(
        screen.getByText((_, el) => el?.tagName === "P" && el.textContent === `${metric}+`),
      ).toBeInTheDocument();
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByAltText(homeImages.journey.alt)).toBeInTheDocument();
  });

  it("makes each expertise card a link with an h3 title", () => {
    render(<Home />);

    for (const [title, description] of [
      ["Model", "Stage & Screen Work"],
      ["Designer", "Branding & Digital Design"],
      ["Singer", "Live Vocals & Studio"],
      ["Actor", "Theatre & On Camera"],
    ]) {
      const card = screen.getByRole("link", { name: new RegExp(`^${title}`) });
      expect(card).toHaveAttribute("href", "/media");
      expect(within(card).getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
      expect(card).toHaveTextContent(description);
    }
  });

  it("features the highlighted video in Recent Work", () => {
    render(<Home />);

    expect(screen.getByRole("button", { name: "Play Spring" })).toBeInTheDocument();
  });

  it("shows the next three newest videos as Other Work", () => {
    render(<Home />);

    const otherWork = screen.getByRole("region", { name: "Other Work" });
    expect(
      within(otherWork).getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Agent 327: Operation Barbershop", "Cosmos Laundromat", "Big Buck Bunny"]);
  });

  it("includes the Model Shots carousel (behavior tested in ModelShotsCarousel.test.tsx)", () => {
    render(<Home />);

    expect(screen.getByRole("region", { name: "Model Shots" })).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
  });

  it("ends with the get-in-touch banner", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("leaves the <main> landmark to the root layout", () => {
    render(<Home />);

    expect(screen.queryByRole("main")).not.toBeInTheDocument();
  });

  it("links 'View More' in Recent Work to the media page", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /view more/i })).toHaveAttribute("href", "/media");
  });

  it("offers the resume in a modal", () => {
    render(<Home />);

    expect(screen.getByRole("button", { name: "View resume" })).toBeInTheDocument();
  });
});
