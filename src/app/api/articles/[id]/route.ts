import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, canEditArticles } from "@/lib/get-current-user";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();

  if (!user || !canEditArticles(user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { headline, dek, body: articleBody, section, verificationMark, status } = body;

  // Fetch existing to check status transitions
  const existing = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (!existing) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }

  const now = new Date();
  const wasLive = existing.status === "live";
  const isNowLive = status === "live";

  // Set datePublished only on first publish
  const datePublished = isNowLive && !existing.datePublished ? now : existing.datePublished;
  // Always update dateModified on live edits
  const dateModified = isNowLive ? now : existing.dateModified;

  const [updated] = await db
    .update(articles)
    .set({
      headline: headline?.trim() || existing.headline,
      dek: dek?.trim() || null,
      body: articleBody ?? existing.body,
      section: section || existing.section,
      verificationMark: verificationMark || existing.verificationMark,
      status: status || existing.status,
      datePublished,
      dateModified,
    })
    .where(eq(articles.id, id))
    .returning();

  return Response.json({ id: updated.id, slug: updated.slug, status: updated.status });
}
