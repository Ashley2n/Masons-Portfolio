import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/media page", () => {
  it("renders the page heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Moments. Stories. Vision." }),
    ).toBeInTheDocument();
  });

  it("is titled 'Media'", () => {
    expect(metadata.title).toBe("Media");
  });
  it("ends with the get-in-touch banner", () => {
    render(<Page />);

    expect(
      screen.getByRole("link", { name: "Get in touch" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("links 'Explore the gallery' down to the gallery", () => {
    render(<Page />);

    expect(screen.getByRole("link", { name: "Explore the gallery" })).toHaveAttribute(
      "href",
      "#gallery",
    );
    const gallery = screen.getByRole("list", { name: "Gallery" });
    expect(gallery.closest("#gallery")).not.toBeNull();
  });
});
