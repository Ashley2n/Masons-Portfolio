import { ImageResponse } from "next/og";
import { heroContent } from "@/content/home";
import { shareImage } from "@/content/seo";
import { imageDataUrl, readSharePhoto, sharePhotoSrc } from "@/lib/share-image";

// The link preview shown when the site is shared (iMessage, Slack, social posts).
// Every page links to it through lib/seo.ts (pageMetadata).

export const alt = shareImage.alt;
export const size = { width: shareImage.width, height: shareImage.height };
export const contentType = "image/png";

// ImageResponse can't read CSS variables, so these mirror the design tokens
const colors = {
  background: "#0A0A0A", // neutral-950
  text: "#F5F5F5", // neutral-100
  muted: "#A3A3A3", // neutral-400
  brand: "#A78BFA", // brand-500
  glow: "#7234E5", // brand-700
};

export default function OpengraphImage() {
  const portraitSrc = imageDataUrl(readSharePhoto(), sharePhotoSrc);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: colors.background,
          position: "relative",
        }}
      >
        {/* Portrait on the right, faded into the background on its left edge */}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img
          src={portraitSrc}
          alt=""
          width={520}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            right: 280,
            top: 0,
            width: 240,
            height: 630,
            backgroundImage: `linear-gradient(to right, ${colors.background}, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -160,
            bottom: -260,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: colors.glow,
            opacity: 0.35,
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
            width: 760,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, color: colors.brand }}>
            {heroContent.roles.join("  •  ").toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              color: colors.text,
            }}
          >
            <span>{heroContent.firstName.toUpperCase()}</span>
            <span>{heroContent.lastName.toUpperCase()}</span>
          </div>
          <div style={{ marginTop: 32, fontSize: 28, lineHeight: 1.4, color: colors.muted }}>
            {heroContent.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
