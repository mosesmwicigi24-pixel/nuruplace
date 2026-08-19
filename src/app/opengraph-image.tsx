import { ImageResponse } from "next/og";
import { site, tagline } from "@/content/site";
import { defaultLocale } from "@/i18n/config";

export const alt = `${site.name} — ${tagline[defaultLocale]}`;
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
          justifyContent: "center",
          padding: "80px",
          background: "#0b1020",
          backgroundImage:
            "radial-gradient(circle at 30% 0%, #1c24ff 0%, transparent 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background: "#060eff",
              fontSize: 38,
            }}
          >
            ✝
          </div>
          <div style={{ fontSize: 30, color: "#9ea6ff" }}>{tagline[defaultLocale]}</div>
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 40,
            letterSpacing: "-0.02em",
          }}
        >
          {"You\u2019re Welcome Here"}
        </div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#cdd1f0" }}>
          {`${site.name} · Saika, Nairobi`}
        </div>
      </div>
    ),
    size,
  );
}
