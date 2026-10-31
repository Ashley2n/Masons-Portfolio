import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { YouTubeVideo } from "@/types/content";
import RecentWorkSection from "./RecentWorkSection";

const video = (id: string, title: string, date: string, extra: { featured?: boolean } = {}): YouTubeVideo => ({
  id,
  platform: "youtube",
  youtubeId: `yt-${id}`,
  title,
  date,
  orientation: "landscape",
  ...extra,
});

const reel = video("reel", "Reel", "2026-03-31", { featured: true });

describe("RecentWorkSection", () => {
  it("shows only the featured video, with no Other Work, when there's one video (C25)", () => {
    render(<RecentWorkSection videos={[reel]} />);

    expect(screen.getByRole("button", { name: "Play Reel" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Other Work" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Other Work" })).not.toBeInTheDocument();
  });

  it("shows Other Work with the videos beyond the featured one when there are two or more (C25)", () => {
    render(
      <RecentWorkSection
        videos={[reel, video("showcase", "Showcase", "2025-06-01"), video("demo", "Demo", "2025-01-01")]}
      />,
    );

    const otherWork = screen.getByRole("region", { name: "Other Work" });
    expect(
      within(otherWork).getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Showcase", "Demo"]);
    expect(within(otherWork).queryByRole("button", { name: "Play Reel" })).not.toBeInTheDocument();
  });
});
