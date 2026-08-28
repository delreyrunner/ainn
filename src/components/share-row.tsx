"use client";

interface ShareRowProps {
  url: string;
  title: string;
}

export function ShareRow({ url, title }: ShareRowProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback — do nothing
    }
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    border: "1px solid var(--rule)",
    background: "transparent",
    color: "var(--mute)",
    padding: "8px 11px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--s2)",
        flexWrap: "wrap",
        padding: "var(--s4) 0",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "9.5px",
          letterSpacing: "0.11em",
          textTransform: "uppercase",
          color: "var(--mute)",
          marginRight: "var(--s1)",
        }}
      >
        Share
      </span>
      <button
        onClick={handleCopy}
        style={{ ...buttonStyle, borderColor: "var(--ink)", color: "var(--ink)" }}
      >
        Copy link
      </button>
      <a
        href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}
        rel="noopener"
        target="_blank"
        style={buttonStyle}
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        rel="noopener"
        target="_blank"
        style={buttonStyle}
      >
        LinkedIn
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`}
        rel="noopener"
        target="_blank"
        style={buttonStyle}
      >
        Bluesky
      </a>
      <a
        href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`}
        rel="noopener"
        target="_blank"
        style={buttonStyle}
      >
        Hacker News
      </a>
    </div>
  );
}
