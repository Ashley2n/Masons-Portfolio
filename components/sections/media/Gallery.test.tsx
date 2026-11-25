import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { galleryCategories, galleryItems, mediaContent } from "@/content/media";
import { filterGallery } from "@/lib/gallery";
import Gallery from "./Gallery";

const { pageSize } = mediaContent;
const total = galleryItems.length;
const shownItems = () =>
  within(screen.getByRole("list", { name: "Gallery" })).getAllByRole("listitem");
const filterButton = (name: string) =>
  within(screen.getByRole("group", { name: "Filter by category" })).getByRole("button", { name });

describe("Gallery", () => {
  it("starts on All with the first page of items", () => {
    render(<Gallery />);

    expect(filterButton("All")).toHaveAttribute("aria-pressed", "true");
    expect(filterButton("Modeling")).toHaveAttribute("aria-pressed", "false");
    expect(shownItems()).toHaveLength(pageSize);
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${pageSize} of ${total}`);
  });

  it("says how many photos the button adds, and how far through the gallery the visitor is", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    const next = Math.min(pageSize, total - pageSize);
    expect(screen.getByRole("button", { name: `Load ${next} more` })).toBeVisible();
    // The count is the status line, shown to everyone, not only to screen readers
    expect(screen.getByRole("status")).not.toHaveClass("sr-only");
    expect(screen.getByRole("progressbar", { name: "Photos shown" })).toHaveAttribute(
      "aria-valuenow",
      String(pageSize),
    );

    await user.click(screen.getByRole("button", { name: `Load ${next} more` }));
    expect(screen.getByRole("progressbar", { name: "Photos shown" })).toHaveAttribute(
      "aria-valuenow",
      String(Math.min(pageSize * 2, total)),
    );
  });

  it("keeps the count out of sight when everything fits on the first page", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const small = galleryCategories.find(
      (c) => c.id !== "all" && filterGallery(galleryItems, c.id).length > 0 && filterGallery(galleryItems, c.id).length <= pageSize,
    );
    expect(small, "some category fits on one page").toBeDefined();

    await user.click(filterButton(small!.label));

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("sr-only");
  });

  it("loads more items until everything is shown", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    await user.click(screen.getByRole("button", { name: /^load \d+ more$/i }));
    expect(shownItems()).toHaveLength(Math.min(pageSize * 2, total));

    while (screen.queryByRole("button", { name: /^load \d+ more$/i })) {
      await user.click(screen.getByRole("button", { name: /^load \d+ more$/i }));
    }
    expect(shownItems()).toHaveLength(total);
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${total} of ${total}`);
  });

  it("filters by category and starts that category from its first page", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const modeling = filterGallery(galleryItems, "modeling");

    await user.click(screen.getByRole("button", { name: /^load \d+ more$/i }));
    await user.click(filterButton("Modeling"));

    expect(filterButton("Modeling")).toHaveAttribute("aria-pressed", "true");
    expect(filterButton("All")).toHaveAttribute("aria-pressed", "false");
    expect(shownItems()).toHaveLength(Math.min(pageSize, modeling.length));
    expect(screen.getByRole("status")).toHaveTextContent(
      `Showing ${Math.min(pageSize, modeling.length)} of ${modeling.length}`,
    );
    modeling.slice(0, pageSize).forEach((item) => {
      if (item.kind === "photo") expect(screen.getByAltText(item.photo.alt)).toBeInTheDocument();
    });
  });

  it("shows photos with alt text and videos with a play button", () => {
    render(<Gallery />);
    const firstPage = galleryItems.slice(0, pageSize);

    firstPage.forEach((item) => {
      if (item.kind === "photo") {
        expect(screen.getByAltText(item.photo.alt)).toBeInTheDocument();
      } else {
        expect(screen.getByRole("button", { name: `Play ${item.video.title}` })).toBeInTheDocument();
      }
    });
  });

  it("has an h2 so the hidden video titles (h3) don't skip a heading level", () => {
    render(<Gallery />);

    const heading = screen.getByRole("heading", { level: 2, name: "Gallery" });
    expect(screen.getByRole("list", { name: "Gallery" })).toHaveAttribute(
      "aria-labelledby",
      heading.id,
    );
  });

  it("moves focus to the first new item after 'Load more', so it's never lost", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    while (screen.queryByRole("button", { name: /^load \d+ more$/i })) {
      const before = shownItems().length;
      await user.click(screen.getByRole("button", { name: /^load \d+ more$/i }));
      expect(shownItems()[before]).toHaveFocus();
    }
    expect(document.activeElement).not.toBe(document.body);
  });
});
