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
    expect(filterButton("Portraits")).toHaveAttribute("aria-pressed", "false");
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
    const portraits = filterGallery(galleryItems, "portraits");

    await user.click(screen.getByRole("button", { name: "Load more" }));
    await user.click(filterButton("Portraits"));

    expect(filterButton("Portraits")).toHaveAttribute("aria-pressed", "true");
    expect(filterButton("All")).toHaveAttribute("aria-pressed", "false");
    expect(shownItems()).toHaveLength(Math.min(pageSize, portraits.length));
    expect(screen.getByRole("status")).toHaveTextContent(
      `Showing ${Math.min(pageSize, portraits.length)} of ${portraits.length}`,
    );
    portraits.slice(0, pageSize).forEach((item) => {
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
});
