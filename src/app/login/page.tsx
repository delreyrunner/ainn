"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--pad)" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: "var(--s6)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--s5)" }}>
            <h1 style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.02em", margin: "0 0 var(--s1)" }}>
              AINN
            </h1>
            <p style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", margin: 0 }}>
              Editorial access
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "var(--signal-tint)", border: "1px solid var(--signal)", padding: "var(--s3)", marginBottom: "var(--s4)" }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--signal)", margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: "var(--s3)" }}>
              <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", fontFamily: "var(--mono)", fontSize: "13px", padding: "10px 12px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
              />
            </div>

            <div style={{ marginBottom: "var(--s4)" }}>
              <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", fontFamily: "var(--mono)", fontSize: "13px", padding: "10px 12px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "12px",
                border: "1px solid var(--ink)",
                background: "var(--ink)",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "var(--s4)" }}>
            <Link
              href="/forgot-password"
              style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--signal)" }}
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
