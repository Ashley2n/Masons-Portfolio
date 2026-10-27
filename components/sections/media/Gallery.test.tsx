import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { galleryItems, mediaContent } from "@/content/media";
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

  it("loads more items until everything is shown", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(shownItems()).toHaveLength(Math.min(pageSize * 2, total));

    while (screen.queryByRole("button", { name: "Load more" })) {
      await user.click(screen.getByRole("button", { name: "Load more" }));
    }
    expect(shownItems()).toHaveLength(total);
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${total} of ${total}`);
  });

  it("filters by category and starts that category from its first page", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const modeling = filterGallery(galleryItems, "modeling");

    await user.click(screen.getByRole("button", { name: "Load more" }));
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

    while (screen.queryByRole("button", { name: "Load more" })) {
      const before = shownItems().length;
      await user.click(screen.getByRole("button", { name: "Load more" }));
      expect(shownItems()[before]).toHaveFocus();
    }
    expect(document.activeElement).not.toBe(document.body);
  });
});
