import { db } from "@/db";
import { corrections, articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corrections",
  description: "A running log of all corrections made to AINN articles.",
};

export default async function CorrectionsPage() {
  const allCorrections = await db
    .select({
      id: corrections.id,
      correctionText: corrections.correctionText,
      whatWasWrong: corrections.whatWasWrong,
      correctedAt: corrections.correctedAt,
      articleSlug: articles.slug,
      articleHeadline: articles.headline,
    })
    .from(corrections)
    .leftJoin(articles, eq(corrections.articleId, articles.id))
    .orderBy(desc(corrections.correctedAt));

  return (
    <article style={{ padding: "var(--s5) var(--pad) var(--s8)", maxWidth: "var(--measure)", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--s4)" }}>
        Corrections
      </h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "#3B444E", margin: "0 0 var(--s6)" }}>
        When AINN makes an error of fact, we correct it publicly. This is a running log of all corrections.
      </p>

      {allCorrections.length === 0 ? (
        <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--mute)" }}>
          No corrections.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
          {allCorrections.map((c) => (
            <li key={c.id} style={{ borderBottom: "1px solid var(--rule-soft)", paddingBottom: "var(--s4)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "9.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--mute)" }}>
                {c.correctedAt ? new Date(c.correctedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>
              {c.articleSlug && (
                <a href={`/news/${c.articleSlug}`} style={{ display: "block", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 15, margin: "var(--s1) 0", color: "var(--signal)" }}>
                  {c.articleHeadline}
                </a>
              )}
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, margin: "var(--s1) 0 0" }}>
                <strong>What was wrong:</strong> {c.whatWasWrong}
              </p>
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, margin: "var(--s1) 0 0" }}>
                <strong>Correction:</strong> {c.correctionText}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
