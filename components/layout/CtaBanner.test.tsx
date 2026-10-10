import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CtaBanner from "./CtaBanner";

describe("CtaBanner", () => {
  it("invites visitors to get in touch via the contact page", () => {
    render(<CtaBanner />);

    expect(
      screen.getByRole("heading", { name: "Interested in working together?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
