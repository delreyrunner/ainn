import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, canEditArticles } from "@/lib/get-current-user";
import { redirect, notFound } from "next/navigation";
import { EditArticleForm } from "./edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user || !canEditArticles(user.role)) {
    redirect("/");
  }

  const { id } = await params;

  const article = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (!article) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "-0.015em",
          margin: "0 0 var(--s5)",
        }}
      >
        Edit article
      </h1>
      <EditArticleForm article={article} />
    </div>
  );
}
