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

  it("downloads a file with a download icon", () => {
    render(
      <Button href="/resume/cv.pdf" download="Mason-Farrington-Resume.pdf" icon="download">
        Download PDF
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Download PDF" });
    expect(link).toHaveAttribute("href", "/resume/cv.pdf");
    expect(link).toHaveAttribute("download", "Mason-Farrington-Resume.pdf");
    expect(link.querySelector("svg")).toHaveClass("lucide-download");
  });

  it("can open a link in a new tab, safely", () => {
    render(
      <Button href="/resume/cv.pdf" newTab>
        Open in new tab
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Open in new tab" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
