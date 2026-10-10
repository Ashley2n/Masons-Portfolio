import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

describe("Header", () => {
  beforeEach(() => {
    navigation.pathname = "/";
  });

  it("is the page banner with an MF logo linking home", () => {
    render(<Header />);

    const banner = screen.getByRole("banner");
    // The accessible name starts with the visible text (WCAG 2.5.3 Label in Name)
    const logo = within(banner).getByRole("link", { name: "MF, Mason Farrington, home" });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("has a main navigation with the four page links", () => {
    render(<Header />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["About", "/about"],
      ["Media", "/media"],
      ["Resume", "/resume"],
      ["Contact", "/contact"],
    ]);
  });

  it("marks the current page's link", () => {
    navigation.pathname = "/media";
    render(<Header />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Media" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  describe("mobile menu", () => {
    it("starts closed", () => {
      render(<Header />);

      expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    });

    it("opens to show the page links", async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByRole("button", { name: "Menu" }));

      expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
      expect(within(mobileNav).getAllByRole("link")).toHaveLength(4);
    });

    it("closes when a link is chosen", async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByRole("button", { name: "Menu" }));
      const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
      await user.click(within(mobileNav).getByRole("link", { name: "About" }));

      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    });

    it("closes with the Escape key and returns focus to the Menu button", async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByRole("button", { name: "Menu" }));
      const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
      within(mobileNav).getByRole("link", { name: "Media" }).focus();
      await user.keyboard("{Escape}");

      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
    });

    it("closes when the page changes some other way (logo, back button)", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Header />);

      await user.click(screen.getByRole("button", { name: "Menu" }));
      navigation.pathname = "/about";
      rerender(<Header />);

      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    });
  });
});
