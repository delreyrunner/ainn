import { notFound } from "next/navigation";
import { db } from "@/db";
import { articles, claims, corrections as correctionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Status, type MarkType } from "@/components/marks";
import { RecordPanel, type RecordItem } from "@/components/record-panel";
import { ShareRow } from "@/components/share-row";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  });

  if (!article || article.status !== "live") return {};

  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://ainewsnet.com"}/news/${slug}`;
  const ogImage = `${process.env.NEXT_PUBLIC_APP_URL || "https://ainewsnet.com"}/api/og/${slug}.png`;

  return {
    title: article.headline,
    description: article.dek || undefined,
    openGraph: {
      title: article.headline,
      description: article.dek || undefined,
      type: "article",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      publishedTime: article.datePublished?.toISOString(),
      modifiedTime: article.dateModified?.toISOString(),
      section: article.section,
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.dek || undefined,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  });

  if (!article || article.status !== "live") {
    notFound();
  }

  // Fetch claims for this article
  const articleClaims = await db.query.claims.findMany({
    where: eq(claims.articleId, article.id),
  });

  // Fetch corrections
  const articleCorrections = await db.query.corrections.findMany({
    where: eq(correctionsTable.articleId, article.id),
  });

  // Build Record items
  const confirmedItems: RecordItem[] = articleClaims
    .filter((c) => c.isRecordItem && c.recordColumn === "confirmed")
    .map((c) => ({
      text: c.claimText,
      citation: c.citation || "",
      mark: c.mark as MarkType,
    }));

  const claimedItems: RecordItem[] = articleClaims
    .filter((c) => c.isRecordItem && c.recordColumn === "claimed")
    .map((c) => ({
      text: c.claimText,
      citation: c.citation || "",
      mark: c.mark as MarkType,
    }));

  // Build bench table items (claims with delta data)
  const benchItems = articleClaims.filter((c) => c.deltaVendor && c.deltaOurs);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainewsnet.com";
  const articleUrl = `${baseUrl}/news/${slug}`;

  const publishedDate = article.datePublished
    ? new Date(article.datePublished).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const publishedTime = article.datePublished
    ? new Date(article.datePublished).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: article.headline,
    datePublished: article.datePublished?.toISOString(),
    dateModified: article.dateModified?.toISOString() || article.datePublished?.toISOString(),
    author: { "@type": "Organization", name: article.byline, url: `${baseUrl}/about#editorial` },
    publisher: {
      "@type": "Organization",
      name: "AINN",
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
    },
    description: article.dek || "",
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={{ padding: "var(--s5) var(--pad) var(--s8)" }}>
        {/* Kicker + status */}
        <div style={{ marginBottom: "var(--s3)" }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "9.5px",
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "var(--signal)",
            }}
          >
            {article.section}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4.2vw, 48px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            margin: "0 0 var(--s3)",
            maxWidth: "22ch",
          }}
        >
          {article.headline}
        </h1>

        {/* Dek */}
        {article.dek && (
          <p
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 300,
              fontSize: 21,
              lineHeight: 1.42,
              color: "#333C46",
              maxWidth: "56ch",
              margin: "0 0 var(--s4)",
            }}
          >
            {article.dek}
          </p>
        )}

        {/* Byline + meta */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            color: "var(--mute)",
            fontFamily: "var(--mono)",
            fontSize: "10.5px",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom: "var(--s4)",
          }}
        >
          <b style={{ color: "var(--ink)", fontWeight: 500 }}>{article.byline}</b>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--rule)" }} />
          {publishedDate && <span>{publishedDate}</span>}
          {publishedTime && <span>{publishedTime}</span>}
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--rule)" }} />
          <Status type={article.verificationMark as MarkType} />
        </div>

        {/* The Record */}
        {(confirmedItems.length > 0 || claimedItems.length > 0) && (
          <div style={{ marginBottom: "var(--s5)" }}>
            <RecordPanel confirmed={confirmedItems} claimed={claimedItems} />
          </div>
        )}

        {/* Article body */}
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 17,
            lineHeight: 1.6,
            maxWidth: "var(--measure)",
            color: "var(--ink)",
          }}
        >
          {article.body?.split("\n\n").map((paragraph, i) => (
            <p key={i} style={{ margin: "0 0 1.4em" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bench table */}
        {benchItems.length > 0 && (
          <div style={{ margin: "var(--s6) 0" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--mono)",
                fontSize: "12.5px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: "9.5px",
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      padding: "0 10px 8px 0",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    Metric
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      fontWeight: 500,
                      fontSize: "9.5px",
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      padding: "0 10px 8px 0",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    Their claim
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      fontWeight: 500,
                      fontSize: "9.5px",
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      padding: "0 10px 8px 0",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    Our test
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      fontWeight: 500,
                      fontSize: "9.5px",
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      padding: "0 0 8px 0",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    Delta
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchItems.map((item, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "11px 10px 11px 0",
                        borderBottom: "1px solid var(--rule-soft)",
                        fontFamily: "var(--sans)",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {item.claimText}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "11px 10px 11px 0",
                        borderBottom: "1px solid var(--rule-soft)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.deltaVendor}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "11px 10px 11px 0",
                        borderBottom: "1px solid var(--rule-soft)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.deltaOurs}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "11px 0 11px 0",
                        borderBottom: "1px solid var(--rule-soft)",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        color: item.deltaPassed ? "var(--mute)" : "var(--signal)",
                      }}
                    >
                      {item.deltaValue}
                      {item.logsUrl && (
                        <a
                          href={item.logsUrl}
                          style={{
                            display: "block",
                            fontSize: "9px",
                            color: "var(--signal)",
                            marginTop: 2,
                          }}
                        >
                          View logs →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Share row */}
        <div style={{ margin: "var(--s6) 0" }}>
          <ShareRow url={articleUrl} title={article.headline} />
        </div>

        {/* Corrections */}
        <div
          style={{
            margin: "var(--s6) 0",
            padding: "var(--s4)",
            border: "1px solid var(--rule-soft)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--mute)",
              margin: "0 0 var(--s2)",
            }}
          >
            Corrections
          </h3>
          {articleCorrections.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "12px",
                color: "var(--mute)",
                margin: 0,
              }}
            >
              None
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {articleCorrections.map((c) => (
                <li key={c.id} style={{ fontSize: 14, lineHeight: 1.45 }}>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      color: "var(--mute)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {new Date(c.correctedAt!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {" — "}
                  {c.correctionText}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </>
  );
}
