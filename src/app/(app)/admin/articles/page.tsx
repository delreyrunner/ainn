import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser, canEditArticles } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminArticlesPage() {
  const user = await getCurrentUser();
  if (!user || !canEditArticles(user.role)) {
    redirect("/");
  }

  const allArticles = await db.query.articles.findMany({
    orderBy: [desc(articles.createdAt)],
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--s5)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          Articles
        </h1>
        <Link
          href="/admin/articles/new"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "9px 14px",
            border: "1px solid var(--ink)",
            background: "var(--ink)",
            color: "#fff",
          }}
        >
          New article
        </Link>
      </div>

      {allArticles.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--mute)",
            textAlign: "center",
            padding: "var(--s8) 0",
          }}
        >
          No articles yet. Create your first one.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--mono)",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr>
              {["Headline", "Section", "Status", "Mark", "Published", ""].map(
                (h) => (
                  <th
                    key={h}
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
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {allArticles.map((a) => (
              <tr key={a.id}>
                <td
                  style={{
                    padding: "11px 10px 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    fontFamily: "var(--sans)",
                    fontWeight: 600,
                    fontSize: 14,
                    maxWidth: 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.headline}
                </td>
                <td
                  style={{
                    padding: "11px 10px 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "10px",
                    color: "var(--mute)",
                  }}
                >
                  {a.section}
                </td>
                <td
                  style={{
                    padding: "11px 10px 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "10px",
                    color:
                      a.status === "live"
                        ? "var(--ink)"
                        : a.status === "review"
                        ? "var(--signal)"
                        : "var(--mute)",
                  }}
                >
                  {a.status}
                </td>
                <td
                  style={{
                    padding: "11px 10px 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "10px",
                    color: "var(--mute)",
                  }}
                >
                  {a.verificationMark}
                </td>
                <td
                  style={{
                    padding: "11px 10px 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    fontSize: "10px",
                    color: "var(--mute)",
                  }}
                >
                  {a.datePublished
                    ? new Date(a.datePublished).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
                <td
                  style={{
                    padding: "11px 0 11px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                  }}
                >
                  <Link
                    href={`/admin/articles/${a.id}`}
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--signal)",
                    }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
