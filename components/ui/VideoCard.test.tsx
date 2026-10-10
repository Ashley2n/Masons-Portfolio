import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { InstagramVideo, YouTubeVideo } from "@/types/content";
import VideoCard from "./VideoCard";

const youtube: YouTubeVideo = {
  id: "spring",
  platform: "youtube",
  youtubeId: "WhWc3b3KhnY",
  title: "Spring",
  date: "2019-04-04",
  orientation: "landscape",
};

const reel: InstagramVideo = {
  id: "reel",
  platform: "instagram",
  url: "https://www.instagram.com/reel/abc123/",
  thumbnail: { src: "/images/media/reel.jpg", alt: "Backstage before the show" },
  title: "Backstage",
  date: "2026-01-02",
  orientation: "portrait",
};

describe("VideoCard", () => {
  it("shows the title and the publish date", () => {
    render(<VideoCard video={youtube} />);

    expect(screen.getByRole("heading", { name: "Spring" })).toBeInTheDocument();
    const date = screen.getByText("04/04/2019");
    expect(date.tagName).toBe("TIME");
    expect(date).toHaveAttribute("dateTime", "2019-04-04");
  });

  describe("YouTube", () => {
    it("shows a thumbnail and a play button without loading the player", () => {
      render(<VideoCard video={youtube} />);

      expect(screen.getByRole("button", { name: "Play Spring" })).toBeInTheDocument();
      expect(document.querySelector("img")?.getAttribute("src")).toContain("WhWc3b3KhnY");
      expect(document.querySelector("iframe")).toBeNull();
    });

    it("loads the privacy-enhanced player when played", async () => {
      const user = userEvent.setup();
      render(<VideoCard video={youtube} />);

      await user.click(screen.getByRole("button", { name: "Play Spring" }));

      const player = screen.getByTitle("Spring");
      expect(player.tagName).toBe("IFRAME");
      expect(player).toHaveAttribute(
        "src",
        "https://www.youtube-nocookie.com/embed/WhWc3b3KhnY?autoplay=1&rel=0",
      );
      expect(screen.queryByRole("button", { name: "Play Spring" })).not.toBeInTheDocument();
    });
  });

  describe("Instagram Reel", () => {
    it("links to the Reel on Instagram in a new tab", () => {
      render(<VideoCard video={reel} />);

      const link = screen.getByRole("link", { name: "Watch Backstage on Instagram" });
      expect(link).toHaveAttribute("href", "https://www.instagram.com/reel/abc123/");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("uses its own thumbnail with alt text", () => {
      render(<VideoCard video={reel} />);

      expect(screen.getByAltText("Backstage before the show")).toBeInTheDocument();
    });
  });

  it("can hide the title and date visually while keeping the title for screen readers", () => {
    render(<VideoCard video={youtube} showMeta={false} />);

    expect(screen.getByRole("heading", { name: "Spring" })).toHaveClass("sr-only");
    expect(screen.queryByText("04/04/2019")).not.toBeInTheDocument();
  });
});
