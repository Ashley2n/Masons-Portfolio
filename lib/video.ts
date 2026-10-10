import type { Video } from "@/types/content";

export const youTubeThumbnail = (youtubeId: string) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

/** Privacy-enhanced embed; autoplay is fine because it only loads after a click. */
export const youTubeEmbedUrl = (youtubeId: string) =>
  `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;

/** Where the video lives on its own platform. */
export const videoUrl = (video: Video) => {
  if (video.platform === "instagram") return video.url;
  return video.orientation === "portrait"
    ? `https://www.youtube.com/shorts/${video.youtubeId}`
    : `https://www.youtube.com/watch?v=${video.youtubeId}`;
};

/** "2019-04-04" → "04/04/2019". Parsed by hand so time zones can't shift the day. */
export const formatVideoDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${month}/${day}/${year}`;
};

export const sortNewestFirst = <T extends Pick<Video, "date">>(videos: T[]) =>
  [...videos].sort((a, b) => b.date.localeCompare(a.date));

/** Featured video plus the next three newest for "Other Work" (landscape only, to fit the grid). */
export const selectHomeVideos = (videos: Video[]) => {
  const landscape = sortNewestFirst(videos.filter((v) => v.orientation === "landscape"));
  const featured = videos.find((v) => v.featured) ?? landscape[0];
  const others = landscape.filter((v) => v !== featured).slice(0, 3);
  return { featured, others };
};
