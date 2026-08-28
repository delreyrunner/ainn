/**
 * Shell — the max-width content container with side borders.
 * Used on all public pages.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "0 auto",
        background: "var(--card)",
        borderLeft: "1px solid var(--rule)",
        borderRight: "1px solid var(--rule)",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
