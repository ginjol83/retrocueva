import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "./lib/site";

export const alt = "Retrocueva · Mi colección de informática retro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          gap: 24,
          padding: 64,
          background: "#05060f",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(0,240,255,0.25), transparent 45%), radial-gradient(circle at 80% 90%, rgba(255,46,151,0.25), transparent 45%)",
          color: "#d7e0ff",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 8,
            color: "#39ff14",
          }}
        >
          <span>RETRO</span>
          <span style={{ color: "#00f0ff" }}>CUEVA</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#00f0ff",
            letterSpacing: 4,
          }}
        >
          Mi colección de informática retro
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: 24,
            lineHeight: 1.5,
            color: "rgba(215,224,255,0.7)",
            justifyContent: "center",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
