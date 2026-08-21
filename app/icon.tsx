import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "8px",
          border: "1.5px solid #262626",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle accent glow in the top-right corner */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "18px",
            height: "18px",
            background: "#6366F1",
            borderRadius: "50%",
            filter: "blur(6px)",
            opacity: 0.6,
          }}
        />

        {/* Letter "R" */}
        <span
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.05em",
            transform: "translateY(-0.5px)",
          }}
        >
          R
        </span>

        {/* Indigo Accent Dot */}
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "4px",
            height: "4px",
            background: "#6366F1",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}