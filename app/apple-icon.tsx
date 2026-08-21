import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: "40px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "115px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          R
        </span>
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "28px",
            width: "18px",
            height: "18px",
            background: "#6366F1",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}