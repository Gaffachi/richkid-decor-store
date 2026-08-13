import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

/** Shared branded fallback image for opengraph-image.tsx / twitter-image.tsx. */
export function renderBrandOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6EFE4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#B5572E",
            marginBottom: 28,
          }}
        >
          RichKid Decor Store
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            color: "#3A2A1F",
            fontWeight: 600,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Transform Your Space
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#6B5744",
            marginTop: 24,
          }}
        >
          Home Décor · Phone Accessories
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
