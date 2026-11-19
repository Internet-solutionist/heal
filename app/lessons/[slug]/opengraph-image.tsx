import { ImageResponse } from "next/og";
import { getLesson, getPublishedLessons } from "@/lib/lessons";
import { PILLARS } from "@/lib/pillars";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A HEAL lesson";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedLessons().map((lesson) => ({ slug: lesson.slug }));
}

const colors = {
  health: "#0E4C4A",
  education: "#C2410C",
  awareness: "#24356E",
} as const;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  const title = lesson?.title ?? "HEAL";
  const pillar = lesson ? PILLARS[lesson.pillar].label : "HEAL";
  const background = lesson ? colors[lesson.pillar] : "#0E4C4A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background,
          color: "#FFF8EF",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
          <div>HEAL</div>
          <div style={{ color: "#F6A63A" }}>{pillar}</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, fontWeight: 700, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>Nkosenhle Sondezi · Vryheid</div>
      </div>
    ),
    { ...size },
  );
}
