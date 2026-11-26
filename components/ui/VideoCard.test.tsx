import { fireEvent, render, screen } from "@testing-library/react";
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

    it("uses its own thumbnail, with alt text, when it has one, instead of YouTube's (#37)", () => {
      const own: YouTubeVideo = {
        ...youtube,
        thumbnail: { src: "/images/home/dance-reel.jpg", alt: "Mason dancing on stage" },
      };
      render(<VideoCard video={own} />);

      const image = screen.getByAltText("Mason dancing on stage");
      expect(decodeURIComponent(image.getAttribute("src") ?? "")).toContain("/images/home/dance-reel.jpg");
      expect(document.querySelector("img")?.getAttribute("src")).not.toContain("ytimg");
      expect(screen.getByRole("button", { name: "Play Spring" })).toBeInTheDocument();
    });

    it("asks YouTube for the full-size thumbnail first (D-52)", () => {
      render(<VideoCard video={youtube} />);

      expect(decodeURIComponent(document.querySelector("img")?.getAttribute("src") ?? "")).toContain("/maxresdefault.jpg");
    });

    it("falls back to the 480x360 thumbnail when the full-size one is missing (D-52)", () => {
      render(<VideoCard video={youtube} />);

      fireEvent.error(document.querySelector("img")!);

      expect(decodeURIComponent(document.querySelector("img")?.getAttribute("src") ?? "")).toContain("/hqdefault.jpg");
    });

    it("does not tint the thumbnail itself: only the play button sits over it (D-52)", () => {
      render(<VideoCard video={youtube} />);

      const button = screen.getByRole("button", { name: "Play Spring" });
      expect(button.querySelector('[class*="bg-neutral-950/20"], [class*="bg-neutral-950/40"]')).toBeNull();
    });

    it("drops a thumbnail that fails to load, so there is no broken image, and the video stays playable", async () => {
      render(<VideoCard video={youtube} />);

      fireEvent.error(document.querySelector("img")!);
      fireEvent.error(document.querySelector("img")!);

      expect(document.querySelector("img")).toBeNull();
      await userEvent.click(screen.getByRole("button", { name: "Play Spring" }));
      expect(document.querySelector("iframe")).not.toBeNull();
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
