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
});
