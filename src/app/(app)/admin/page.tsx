import { getCurrentUser, canAccessAdmin } from "@/lib/get-current-user";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || !canAccessAdmin(user.role)) {
    redirect("/");
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 700,
          fontSize: "22px",
          letterSpacing: "-0.015em",
          margin: "0 0 var(--s4)",
        }}
      >
        Dashboard
      </h1>
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: "12px",
          color: "var(--mute)",
        }}
      >
        Signed in as {user.email} ({user.role})
      </p>

      <div
        style={{
          marginTop: "var(--s6)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--s4)",
        }}
      >
        <div
          style={{
            border: "1px solid var(--rule)",
            background: "var(--card)",
            padding: "var(--s4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--mute)",
              display: "block",
              marginBottom: "var(--s2)",
            }}
          >
            Articles
          </span>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            0
          </span>
        </div>
        <div
          style={{
            border: "1px solid var(--rule)",
            background: "var(--card)",
            padding: "var(--s4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--mute)",
              display: "block",
              marginBottom: "var(--s2)",
            }}
          >
            Subscribers
          </span>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            0
          </span>
        </div>
        <div
          style={{
            border: "1px solid var(--rule)",
            background: "var(--card)",
            padding: "var(--s4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--mute)",
              display: "block",
              marginBottom: "var(--s2)",
            }}
          >
            Radar Alerts
          </span>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
