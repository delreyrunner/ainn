import { Mark } from "./marks";

export interface RecordItem {
  text: string;
  citation: string;
  mark: "verified" | "claim" | "reported" | "unconfirmed";
}

interface RecordPanelProps {
  confirmed: RecordItem[];
  claimed: RecordItem[];
}

export function RecordPanel({ confirmed, claimed }: RecordPanelProps) {
  if (confirmed.length === 0 && claimed.length === 0) return null;

  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        borderTop: "3px solid var(--signal)",
        background: "#fff",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--s3)",
          padding: "9px 14px",
          borderBottom: "1px solid var(--rule-soft)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10.5px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          The Record
        </h2>
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Confirmed column */}
        <div style={{ padding: 14 }}>
          <h3
            style={{
              margin: "0 0 11px",
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            Confirmed by AINN
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {confirmed.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, lineHeight: 1.42, alignItems: "flex-start" }}>
                <span style={{ marginTop: 6 }}>
                  <Mark type={item.mark} />
                </span>
                <span>
                  {item.text}
                  <cite
                    style={{
                      display: "block",
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      fontStyle: "normal",
                      color: "var(--mute)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {item.citation}
                  </cite>
                </span>
              </li>
            ))}
            {confirmed.length === 0 && (
              <li style={{ fontSize: 13, color: "var(--mute)", fontFamily: "var(--mono)" }}>None yet</li>
            )}
          </ul>
        </div>

        {/* Claimed column */}
        <div
          style={{
            padding: 14,
            borderLeft: "1px solid var(--rule-soft)",
            background: "var(--signal-tint)",
          }}
        >
          <h3
            style={{
              margin: "0 0 11px",
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--signal)",
            }}
          >
            Claimed, not yet verified
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {claimed.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, lineHeight: 1.42, alignItems: "flex-start" }}>
                <span style={{ marginTop: 6 }}>
                  <Mark type={item.mark} />
                </span>
                <span>
                  {item.text}
                  <cite
                    style={{
                      display: "block",
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      fontStyle: "normal",
                      color: "var(--mute)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {item.citation}
                  </cite>
                </span>
              </li>
            ))}
            {claimed.length === 0 && (
              <li style={{ fontSize: 13, color: "var(--mute)", fontFamily: "var(--mono)" }}>None</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
