import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the hero with name, roles and call to action", () => {
    render(<Home />);

    expect(screen.getByText(/Mason/)).toHaveTextContent("Mason Farrington");
    for (const role of ["Actor", "Musician", "Singer", "Designer"]) {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/media");
  });

  it("renders every section heading", () => {
    render(<Home />);

    for (const heading of [
      "The Journey So Far",
      "What I Do",
      "Recent Work",
      "Other Work",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("renders the journey stats", () => {
    render(<Home />);

    for (const metric of ["10", "12", "4"]) {
      expect(
        screen.getByText((_, el) => el?.tagName === "P" && el.textContent === `${metric}+`),
      ).toBeInTheDocument();
    }
  });

  it("renders the four expertise cards", () => {
    render(<Home />);

    for (const title of ["Model", "Designer", "Singer", "Actor"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
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
});
