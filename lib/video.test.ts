import { describe, expect, it } from "vitest";
import type { Video } from "@/types/content";
import {
  formatVideoDate,
  selectHomeVideos,
  sortNewestFirst,
  videoUrl,
  youTubeEmbedUrl,
  youTubeThumbnail,
} from "./video";

const youtube = (id: string, date: string, extra: Partial<Video> = {}): Video => ({
  id,
  platform: "youtube",
  youtubeId: `yt-${id}`,
  title: id,
  date,
  orientation: "landscape",
  ...extra,
} as Video);

const reel: Video = {
  id: "reel",
  platform: "instagram",
  url: "https://www.instagram.com/reel/abc123/",
  thumbnail: { src: "/images/media/reel.jpg", alt: "Reel" },
  title: "Reel",
  date: "2026-01-01",
  orientation: "portrait",
};

describe("YouTube URLs", () => {
  it("builds the thumbnail URL from the video id", () => {
    expect(youTubeThumbnail("aqz-KE-bpKQ")).toBe(
      "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
    );
  });

  it("embeds through the privacy-enhanced domain and autoplays after the click", () => {
    expect(youTubeEmbedUrl("aqz-KE-bpKQ")).toBe(
      "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0",
    );
  });
});

describe("videoUrl", () => {
  it("links landscape YouTube videos to the watch page", () => {
    expect(videoUrl(youtube("a", "2020-01-01"))).toBe("https://www.youtube.com/watch?v=yt-a");
  });

  it("links portrait YouTube videos to the Shorts page", () => {
    expect(videoUrl(youtube("a", "2020-01-01", { orientation: "portrait" }))).toBe(
      "https://www.youtube.com/shorts/yt-a",
    );
  });

  it("links Instagram Reels to Instagram", () => {
    expect(videoUrl(reel)).toBe("https://www.instagram.com/reel/abc123/");
  });
});

describe("formatVideoDate", () => {
  it("formats ISO dates as MM/DD/YYYY like the mockup", () => {
    expect(formatVideoDate("2019-04-04")).toBe("04/04/2019");
  });

  it("does not shift the day across time zones", () => {
    expect(formatVideoDate("2024-01-01")).toBe("01/01/2024");
  });
});

describe("sortNewestFirst", () => {
  it("orders videos by date, newest first, without changing the input", () => {
    const videos = [youtube("old", "2010-01-01"), youtube("new", "2020-01-01")];

    expect(sortNewestFirst(videos).map((v) => v.id)).toEqual(["new", "old"]);
    expect(videos.map((v) => v.id)).toEqual(["old", "new"]);
  });
});

describe("selectHomeVideos", () => {
  const videos = [
    youtube("a", "2010-01-01"),
    youtube("b", "2012-01-01"),
    youtube("c", "2015-01-01"),
    youtube("d", "2017-01-01"),
    youtube("short", "2024-01-01", { orientation: "portrait" }),
    reel,
  ];

  it("features the video marked featured", () => {
    const { featured } = selectHomeVideos([...videos, youtube("f", "2000-01-01", { featured: true })]);

    expect(featured?.id).toBe("f");
  });

  it("falls back to the newest landscape video when none is featured", () => {
    expect(selectHomeVideos(videos).featured?.id).toBe("d");
  });

  it("lists the next three newest landscape videos as other work", () => {
    expect(selectHomeVideos(videos).others.map((v) => v.id)).toEqual(["c", "b", "a"]);
  });

  it("handles an empty list", () => {
    expect(selectHomeVideos([])).toEqual({ featured: undefined, others: [] });
  });
});
