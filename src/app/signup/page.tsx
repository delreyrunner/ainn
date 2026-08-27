"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message || "Signup failed");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--pad)" }}>
        <div style={{ width: "100%", maxWidth: "380px", border: "1px solid var(--rule)", background: "var(--card)", padding: "var(--s6)", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "18px", margin: "0 0 var(--s3)" }}>Check your email</h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: "15px", color: "#3B444E", margin: 0 }}>
            We sent a verification link to <strong>{email}</strong>. Click it to activate your account.
          </p>
        </div>
      </main>
    );
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
              Create account
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
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", fontFamily: "var(--mono)", fontSize: "13px", padding: "10px 12px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
              />
            </div>

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
                minLength={8}
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "var(--s4)" }}>
            <Link
              href="/login"
              style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--signal)" }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
