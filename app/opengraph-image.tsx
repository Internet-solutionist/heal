import { ImageResponse } from "next/og";

export const alt = "HEAL — Health, Education, Awareness. Lessons from Nkosenhle Sondezi in Vryheid.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E4C4A",
          color: "#FFF8EF",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "6px solid #F6A63A",
              marginRight: 18,
            }}
          />
          <div style={{ fontSize: 32, letterSpacing: 8, fontWeight: 700 }}>HEAL</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, fontWeight: 700, maxWidth: 980 }}>
            Nine lessons for a steadier week.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#F6A63A", fontWeight: 700 }}>
            Health · Education · Awareness
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>Nkosenhle Sondezi · Vryheid, KwaZulu-Natal</div>
      </div>
    ),
    { ...size },
  );
}
