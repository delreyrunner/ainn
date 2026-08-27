import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--pad)" }}>
        <div style={{ width: "100%", maxWidth: "380px", border: "1px solid var(--rule)", background: "var(--card)", padding: "var(--s6)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--signal)", margin: 0 }}>
            Invalid or expired reset link.
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
              Set new password
            </p>
          </div>
          <Suspense fallback={null}>
            <ResetPasswordForm token={token} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
