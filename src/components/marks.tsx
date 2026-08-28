/**
 * Verification marks — the core AINN system.
 * Four marks. Never invent a fifth. Never use colour alone to distinguish.
 */

export type MarkType = "verified" | "claim" | "reported" | "unconfirmed";

const markStyles: Record<MarkType, React.CSSProperties> = {
  verified: {
    width: 9,
    height: 9,
    border: "1.5px solid var(--ink)",
    background: "var(--ink)",
    display: "inline-block",
    flexShrink: 0,
  },
  claim: {
    width: 9,
    height: 9,
    border: "1.5px solid var(--signal)",
    background: "transparent",
    display: "inline-block",
    flexShrink: 0,
  },
  reported: {
    width: 9,
    height: 9,
    border: "1.5px solid var(--ink)",
    background: "linear-gradient(90deg, var(--ink) 50%, transparent 50%)",
    display: "inline-block",
    flexShrink: 0,
  },
  unconfirmed: {
    width: 9,
    height: 9,
    border: "1.5px dashed var(--mute)",
    background: "transparent",
    display: "inline-block",
    flexShrink: 0,
  },
};

const markLabels: Record<MarkType, string> = {
  verified: "Verified",
  claim: "Company claim",
  reported: "Reported",
  unconfirmed: "Unconfirmed",
};

interface MarkProps {
  type: MarkType;
  className?: string;
}

export function Mark({ type }: MarkProps) {
  return <span style={markStyles[type]} aria-hidden="true" />;
}

interface StatusProps {
  type: MarkType;
  showLabel?: boolean;
}

export function Status({ type, showLabel = true }: StatusProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        color: type === "claim" ? "var(--signal)" : "var(--mute)",
        fontFamily: "var(--mono)",
        fontSize: "10px",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
      }}
    >
      <Mark type={type} />
      {showLabel && <span>{markLabels[type]}</span>}
    </span>
  );
}

export function MarkLegend() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--s5)",
        flexWrap: "wrap",
        fontFamily: "var(--mono)",
        fontSize: "10px",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "var(--mute)",
      }}
    >
      {(["verified", "claim", "reported", "unconfirmed"] as MarkType[]).map(
        (type) => (
          <Status key={type} type={type} />
        )
      )}
    </div>
  );
}
