import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, gte, desc } from "drizzle-orm";

/**
 * Google News Sitemap — only articles published within the last 48 hours.
 * Articles older than 48h are served by the standard sitemap instead.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainewsnet.com";
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const recentArticles = await db.query.articles.findMany({
    where: (a, { and }) =>
      and(eq(a.status, "live"), gte(a.datePublished, fortyEightHoursAgo)),
    orderBy: [desc(articles.datePublished)],
    limit: 1000,
  });

  const urls = recentArticles
    .map((a) => {
      const pubDate = a.datePublished?.toISOString() || new Date().toISOString();
      return `  <url>
    <loc>${baseUrl}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>AINN</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(a.headline)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
