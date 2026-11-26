import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // D-52: Next keeps optimized images for 4 hours by default (longer if the source asks for it). One hour, so a
    // thumbnail Mason changes on YouTube reaches the site sooner.
    minimumCacheTTL: 3600,
    // YouTube video thumbnails (lib/video.ts)
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
