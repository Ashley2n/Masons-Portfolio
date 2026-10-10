import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders a link when given an href", () => {
    render(<Button href="/media">View work</Button>);

    expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/media");
  });

  it("renders a button that handles clicks when there is no href", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows a decorative arrow icon hidden from screen readers", () => {
    render(<Button href="/contact">Get in touch</Button>);

    // The accessible name is only the label; the icon is an SVG, not a text character
    const link = screen.getByRole("link", { name: "Get in touch" });
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(link).not.toHaveTextContent("↗");
  });
});
