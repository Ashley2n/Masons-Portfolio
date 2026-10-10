import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { modelShots } from "@/content/home";
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

  it("renders a card for each other-work video", () => {
    render(<Home />);

    expect(screen.getAllByRole("heading", { name: "My First Video" })).toHaveLength(3);
  });

  it("advances the model shots carousel and wraps back to the first image", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const [next] = screen.getAllByRole("button", { name: "→" });
    const mainImage = () => screen.getAllByRole("img")[0];

    expect(mainImage()).toHaveAttribute("alt", modelShots[0].alt);
    await user.click(next);
    expect(mainImage()).toHaveAttribute("alt", modelShots[1].alt);

    for (let i = 1; i < modelShots.length; i++) await user.click(next);
    expect(mainImage()).toHaveAttribute("alt", modelShots[0].alt);
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
