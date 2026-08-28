import { ImageResponse } from "next/og";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

const markLabels: Record<string, string> = {
  verified: "VERIFIED",
  claim: "COMPANY CLAIM",
  reported: "REPORTED",
  unconfirmed: "UNCONFIRMED",
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Strip .png extension if present
  const cleanSlug = slug.replace(/\.png$/, "");

  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, cleanSlug),
  });

  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  const markLabel = markLabels[article.verificationMark] || "UNCONFIRMED";
  const section = article.section.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FCFCFB",
          padding: "0",
        }}
      >
        {/* Top oxblood rule */}
        <div style={{ width: "100%", height: 6, backgroundColor: "#8A1C2B" }} />

        {/* Content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px 40px",
          }}
        >
          {/* Top row: section + mark */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                letterSpacing: "0.12em",
                color: "#8A1C2B",
              }}
            >
              {section}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                letterSpacing: "0.1em",
                color: article.verificationMark === "claim" ? "#8A1C2B" : "#626C79",
                border: `1px solid ${article.verificationMark === "claim" ? "#8A1C2B" : "#CBD1D9"}`,
                padding: "6px 12px",
              }}
            >
              {markLabel}
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "32px 0" }}>
            <h1
              style={{
                fontSize: article.headline.length > 80 ? 38 : article.headline.length > 50 ? 46 : 54,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "#10141A",
                margin: 0,
                maxWidth: "18ch",
              }}
            >
              {article.headline}
            </h1>
          </div>

          {/* Bottom row: AINN wordmark */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#10141A",
              }}
            >
              AINN
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#626C79",
              }}
            >
              ainewsnet.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
