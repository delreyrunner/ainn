import Link from "next/link";

const sections = [
  { name: "Models", href: "/section/models" },
  { name: "Benchmarks", href: "/section/benchmarks" },
  { name: "Sentiment", href: "/section/sentiment" },
  { name: "Infrastructure", href: "/section/infrastructure" },
];

export function Masthead() {
  return (
    <header
      style={{
        padding: "var(--s4) var(--pad)",
        borderBottom: "2px solid var(--ink)",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "var(--s4)",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        AINN
      </Link>
      <nav
        style={{
          display: "flex",
          gap: "var(--s4)",
          fontFamily: "var(--mono)",
          fontSize: "10.5px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--mute)",
        }}
      >
        {sections.map((s) => (
          <Link key={s.name} href={s.href} style={{ color: "inherit" }}>
            {s.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
