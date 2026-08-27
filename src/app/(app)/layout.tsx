export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      <header
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "var(--s3) var(--pad)",
          fontFamily: "var(--mono)",
          fontSize: "10.5px",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>AINN — Admin</span>
        <nav style={{ display: "flex", gap: "var(--s4)" }}>
          <a href="/admin" style={{ color: "var(--signal-lift)" }}>Dashboard</a>
          <a href="/admin/articles" style={{ color: "#A8B1BB" }}>Articles</a>
          <a href="/admin/monitoring" style={{ color: "#A8B1BB" }}>Radar</a>
        </nav>
      </header>
      <main style={{ padding: "var(--s6) var(--pad)", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
