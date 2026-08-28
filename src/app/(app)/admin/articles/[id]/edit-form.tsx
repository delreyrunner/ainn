"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = ["models", "benchmarks", "sentiment", "infrastructure", "general"];
const marks = ["verified", "claim", "reported", "unconfirmed"];
const statuses = ["draft", "review", "live", "archived"];

interface Article {
  id: string;
  headline: string;
  dek: string | null;
  body: string | null;
  section: string;
  verificationMark: string;
  status: string;
  slug: string;
}

export function EditArticleForm({ article }: { article: Article }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      headline: form.get("headline") as string,
      dek: form.get("dek") as string,
      body: form.get("body") as string,
      section: form.get("section") as string,
      verificationMark: form.get("verificationMark") as string,
      status: form.get("status") as string,
    };

    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to update article");
      } else {
        router.push("/admin/articles");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--mute)",
    display: "block",
    marginBottom: "var(--s1)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "var(--mono)",
    fontSize: "13px",
    padding: "10px 12px",
    border: "1px solid var(--rule)",
    background: "#fff",
    color: "var(--ink)",
    marginBottom: "var(--s3)",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3e%3cpath fill='%23626C79' d='M6 8L1 3h10z'/%3e%3c/svg%3e\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 36,
  };

  return (
    <>
      {error && (
        <div
          style={{
            background: "var(--signal-tint)",
            border: "1px solid var(--signal)",
            padding: "var(--s3)",
            marginBottom: "var(--s4)",
          }}
        >
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--signal)", margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "10px",
          color: "var(--mute)",
          marginBottom: "var(--s4)",
          letterSpacing: "0.06em",
        }}
      >
        Slug: /news/{article.slug}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Headline</label>
          <input
            name="headline"
            required
            maxLength={110}
            defaultValue={article.headline}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Dek (subheadline)</label>
          <input
            name="dek"
            maxLength={200}
            defaultValue={article.dek || ""}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s3)" }}>
          <div>
            <label style={labelStyle}>Section</label>
            <select name="section" defaultValue={article.section} style={selectStyle}>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Verification mark</label>
            <select name="verificationMark" defaultValue={article.verificationMark} style={selectStyle}>
              {marks.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" defaultValue={article.status} style={selectStyle}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Body</label>
          <textarea
            name="body"
            rows={18}
            defaultValue={article.body || ""}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "var(--serif)",
              fontSize: "15px",
              lineHeight: 1.55,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--s3)", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "12px 20px",
              border: "1px solid var(--ink)",
              background: "var(--ink)",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          {article.status === "live" && (
            <a
              href={`/news/${article.slug}`}
              target="_blank"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "var(--signal)",
              }}
            >
              View live →
            </a>
          )}
        </div>
      </form>
    </>
  );
}
