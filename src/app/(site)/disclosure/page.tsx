import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ownership and Funding Disclosure",
  description: "AINN's ownership structure, funding sources, and relationship with IIMAGINE.AI.",
};

export default function DisclosurePage() {
  return (
    <article style={{ padding: "var(--s5) var(--pad) var(--s8)", maxWidth: "var(--measure)", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--s4)" }}>
        Ownership and funding disclosure
      </h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "#3B444E", margin: "0 0 var(--s6)" }}>
        Transparency about who owns and funds this publication.
      </p>

      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Ownership
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          AINN (AI News Network) is owned and operated by Adam Radly, who is also the founder of IIMAGINE.AI, an AI platform with model testing and benchmarking capabilities.
        </p>
      </section>

      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Relationship with IIMAGINE.AI
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: "0 0 var(--s3)" }}>
          AINN uses IIMAGINE.AI&apos;s testing infrastructure to run independent benchmark tests on AI models. When we publish test results, the data source is attributed: &ldquo;Benchmark data from IIMAGINE.AI model testing platform.&rdquo;
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          AINN does not publish articles comparing IIMAGINE.AI with its competitors. We publish objective model-versus-model comparisons using standardised testing methodology. AINN maintains absolute editorial independence regarding analysis and reporting outcomes.
        </p>
      </section>

      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Funding
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          AINN is funded by reader memberships and, in the future, by non-editorial advertising. We accept no lab funding, sponsored content, or vendor review units. No AI company has any financial relationship with this publication.
        </p>
      </section>

      <section>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Summary
        </h2>
        <div style={{ border: "1px solid var(--rule)", padding: "var(--s4)", fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.8, color: "var(--mute)" }}>
          <p style={{ margin: 0 }}>Owner: Adam Radly</p>
          <p style={{ margin: 0 }}>Testing infrastructure: IIMAGINE.AI</p>
          <p style={{ margin: 0 }}>Lab funding: None</p>
          <p style={{ margin: 0 }}>Sponsored content: None</p>
          <p style={{ margin: 0 }}>Vendor review units: None</p>
          <p style={{ margin: 0 }}>Revenue: Reader memberships</p>
        </div>
      </section>
    </article>
  );
}
