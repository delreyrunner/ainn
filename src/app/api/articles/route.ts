import { db } from "@/db";
import { articles } from "@/db/schema";
import { getCurrentUser, canEditArticles } from "@/lib/get-current-user";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !canEditArticles(user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { headline, dek, body: articleBody, section, verificationMark, status } = body;

  if (!headline || !headline.trim()) {
    return Response.json({ error: "Headline is required" }, { status: 400 });
  }

  const slug = slugify(headline);

  // Check slug uniqueness
  const existing = await db.query.articles.findFirst({
    where: (a, { eq }) => eq(a.slug, slug),
  });

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  const now = new Date();
  const isLive = status === "live";

  const [created] = await db
    .insert(articles)
    .values({
      slug: finalSlug,
      headline: headline.trim(),
      dek: dek?.trim() || null,
      body: articleBody || null,
      section: section || "general",
      verificationMark: verificationMark || "unconfirmed",
      status: status || "draft",
      datePublished: isLive ? now : null,
      dateModified: isLive ? now : null,
    })
    .returning();

  return Response.json({ id: created.id, slug: created.slug }, { status: 201 });
}
