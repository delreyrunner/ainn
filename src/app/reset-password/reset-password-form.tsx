"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, token }),
      });
      router.push("/login");
    } catch {
      setError("Something went wrong. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background: "var(--signal-tint)", border: "1px solid var(--signal)", padding: "var(--s3)", marginBottom: "var(--s4)" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--signal)", margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={{ marginBottom: "var(--s3)" }}>
        <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>
          New password
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

      <div style={{ marginBottom: "var(--s4)" }}>
        <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>
          Confirm password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "Resetting..." : "Set new password"}
      </button>
    </form>
  );
}
