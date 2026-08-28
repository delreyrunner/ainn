import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Standard sitemap — all live articles + static pages.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainewsnet.com";

  const allArticles = await db.query.articles.findMany({
    where: eq(articles.status, "live"),
    orderBy: [desc(articles.datePublished)],
  });

  const staticPages = [
    { loc: "", priority: "1.0" },
    { loc: "/standards", priority: "0.5" },
    { loc: "/corrections", priority: "0.5" },
    { loc: "/about", priority: "0.5" },
    { loc: "/disclosure", priority: "0.5" },
  ];

  const staticUrls = staticPages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const articleUrls = allArticles
    .map((a) => {
      const lastmod = (a.dateModified || a.datePublished)?.toISOString() || "";
      return `  <url>
    <loc>${baseUrl}/news/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${articleUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
