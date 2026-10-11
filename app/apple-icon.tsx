import { ImageResponse } from "next/og";

// Home-screen icon for iPhones and iPads (they don't use SVG favicons).
// Mirrors app/icon.svg; ImageResponse can't read CSS variables, so the colors are the token values.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0A0A0A", // neutral-950
          color: "#F5F5F5", // neutral-100
          fontSize: 80,
          fontStyle: "italic",
        }}
      >
        MF
        <div style={{ width: 80, height: 5, marginTop: 4, background: "#A78BFA" /* brand-500 */ }} />
      </div>
    ),
    size,
  );
}
