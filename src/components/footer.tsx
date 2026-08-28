import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        padding: "var(--s5) var(--pad) var(--s8)",
        display: "flex",
        gap: "var(--s5)",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        fontFamily: "var(--mono)",
        fontSize: "10px",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "var(--mute)",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <span>&copy; {new Date().getFullYear()} AINN</span>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link href="/standards" style={{ color: "inherit" }}>
          Standards
        </Link>
        <Link href="/corrections" style={{ color: "inherit" }}>
          Corrections
        </Link>
        <Link href="/disclosure" style={{ color: "inherit" }}>
          Disclosure
        </Link>
        <Link href="/about" style={{ color: "inherit" }}>
          About
        </Link>
      </div>
      {/* Social links — footer only, never in masthead */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <a href="https://x.com/ainewsnet" rel="noopener" style={{ color: "inherit" }}>
          X
        </a>
        <a href="https://reddit.com/r/AINN" rel="noopener" style={{ color: "inherit" }}>
          Reddit
        </a>
        <a href="https://linkedin.com/company/ainewsnet" rel="noopener" style={{ color: "inherit" }}>
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
