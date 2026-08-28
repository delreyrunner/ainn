import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Status, MarkLegend, type MarkType } from "@/components/marks";
import Link from "next/link";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  // Fetch live articles
  const liveArticles = await db.query.articles.findMany({
    where: eq(articles.status, "live"),
    orderBy: [desc(articles.datePublished)],
    limit: 13,
  });

  const lead = liveArticles[0] || null;
  const wireItems = liveArticles.slice(0, 8);
  const gridArticles = liveArticles.slice(lead ? 1 : 0, 10);

  const hasContent = liveArticles.length > 0;

  return (
    <div style={{ padding: "0 var(--pad)" }}>
      {/* Header metrics */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "var(--s3) 0",
          fontFamily: "var(--mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--mute)",
        }}
      >
        {liveArticles.length} stories logged
      </div>

      {hasContent ? (
        <>
          {/* Lead + Wire layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: "var(--s5)",
              marginBottom: "var(--s6)",
            }}
          >
            {/* Lead story */}
            {lead && (
              <div>
                <Link href={`/news/${lead.slug}`} style={{ display: "block" }}>
                  <div style={{ marginBottom: "var(--s2)" }}>
                    <Status type={lead.verificationMark as MarkType} />
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--sans)",
                      fontWeight: 800,
                      fontSize: "clamp(26px, 3.8vw, 42px)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.08,
                      margin: "0 0 var(--s3)",
                    }}
                  >
                    {lead.headline}
                  </h2>
                  {lead.dek && (
                    <p
                      style={{
                        fontFamily: "var(--serif)",
                        fontWeight: 300,
                        fontSize: 19,
                        lineHeight: 1.42,
                        color: "#333C46",
                        maxWidth: "48ch",
                        margin: 0,
                      }}
                    >
                      {lead.dek}
                    </p>
                  )}
                </Link>
              </div>
            )}

            {/* Wire column */}
            <aside
              style={{
                borderLeft: "1px solid var(--rule)",
                paddingLeft: "var(--s4)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--mute)",
                  margin: "0 0 var(--s3)",
                  paddingBottom: "var(--s2)",
                  borderBottom: "1px solid var(--rule-soft)",
                }}
              >
                The Wire
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--s3)",
                }}
              >
                {wireItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "9.5px",
                          color: "var(--mute)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {item.datePublished
                          ? new Date(item.datePublished).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          lineHeight: 1.25,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.headline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Section rule */}
          <div
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
              padding: "10px 0",
              borderTop: "2px solid var(--ink)",
              borderBottom: "1px solid var(--rule)",
              marginBottom: "var(--s4)",
            }}
          >
            Latest
          </div>

          {/* Story grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              marginBottom: "var(--s6)",
            }}
          >
            {gridArticles.map((item, i) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                style={{
                  padding: "20px 22px 22px 0",
                  borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--rule-soft)" : "none",
                  borderBottom: "1px solid var(--rule-soft)",
                  paddingLeft: i % 3 !== 0 ? 22 : 0,
                  paddingRight: (i + 1) % 3 === 0 ? 0 : 22,
                  display: "block",
                }}
              >
                <div style={{ marginBottom: "var(--s2)" }}>
                  <Status type={item.verificationMark as MarkType} showLabel={false} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 700,
                    fontSize: 18,
                    lineHeight: 1.17,
                    letterSpacing: "-0.015em",
                    margin: "0 0 var(--s2)",
                  }}
                >
                  {item.headline}
                </h3>
                {item.dek && (
                  <p
                    style={{
                      margin: "0 0 var(--s3)",
                      fontSize: "14.5px",
                      lineHeight: 1.45,
                      color: "#3B444E",
                    }}
                  >
                    {item.dek}
                  </p>
                )}
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9.5px",
                    color: "var(--mute)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.section}
                  {item.datePublished && (
                    <>
                      {" · "}
                      {new Date(item.datePublished).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        /* Empty state when no articles yet */
        <div style={{ textAlign: "center", padding: "var(--s8) 0" }}>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--mute)",
              margin: "0 0 var(--s4)",
            }}
          >
            Coming soon
          </p>
          <h2
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: "clamp(24px, 4vw, 40px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: "0 0 var(--s4)",
              maxWidth: "20ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The wire that retests the claims.
          </h2>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: 19,
              lineHeight: 1.5,
              color: "#3B444E",
              maxWidth: "50ch",
              margin: "0 auto",
            }}
          >
            Independent AI news with verification marks on every claim.
            We retest vendor benchmarks ourselves.
          </p>
        </div>
      )}

      {/* Mark legend */}
      <div
        style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: "var(--s4)",
          marginBottom: "var(--s6)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MarkLegend />
      </div>
    </div>
  );
}
