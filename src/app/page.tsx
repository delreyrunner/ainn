export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: "1360px",
        margin: "0 auto",
        background: "var(--card)",
        borderLeft: "1px solid var(--rule)",
        borderRight: "1px solid var(--rule)",
        minHeight: "100vh",
        padding: "var(--pad)",
      }}
    >
      {/* Masthead */}
      <header
        style={{
          borderBottom: "2px solid var(--ink)",
          paddingBottom: "var(--s3)",
          marginBottom: "var(--s6)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 800,
            fontSize: "28px",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          AINN
        </h1>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--mute)",
          }}
        >
          AI News Network
        </span>
      </header>

      {/* Placeholder content */}
      <div style={{ textAlign: "center", padding: "var(--s8) 0" }}>
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--mute)",
            margin: "0 0 var(--s4)",
          }}
        >
          Coming soon
        </p>
        <h2
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 700,
            fontSize: "clamp(24px, 4vw, 40px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: "0 0 var(--s4)",
            maxWidth: "20ch",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          The wire that retests the claims.
        </h2>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: "19px",
            lineHeight: 1.5,
            color: "#3B444E",
            maxWidth: "50ch",
            margin: "0 auto",
          }}
        >
          Independent AI news with verification marks on every claim.
          We retest vendor benchmarks ourselves.
        </p>
      </div>

      {/* Verification marks legend */}
      <div
        style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: "var(--s4)",
          marginTop: "var(--s8)",
          display: "flex",
          gap: "var(--s5)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { label: "Verified", style: "solid" },
          { label: "Company claim", style: "claim" },
          { label: "Reported", style: "half" },
          { label: "Unconfirmed", style: "dashed" },
        ].map((mark) => (
          <span
            key={mark.label}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: mark.style === "claim" ? "var(--signal)" : "var(--mute)",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                border: `1.5px ${mark.style === "dashed" ? "dashed" : "solid"} ${mark.style === "claim" ? "var(--signal)" : mark.style === "dashed" ? "var(--mute)" : "var(--ink)"}`,
                background:
                  mark.style === "solid"
                    ? "var(--ink)"
                    : mark.style === "half"
                    ? "linear-gradient(90deg, var(--ink) 50%, transparent 50%)"
                    : "transparent",
                display: "inline-block",
              }}
            />
            {mark.label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "var(--s8)",
          paddingTop: "var(--s5)",
          borderTop: "1px solid var(--rule)",
          fontFamily: "var(--mono)",
          fontSize: "10px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--mute)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--s3)",
        }}
      >
        <span>&copy; 2026 AINN</span>
        <span>Standards &middot; Corrections &middot; Disclosure</span>
      </footer>
    </div>
  );
}
