import { MarkLegend } from "@/components/marks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description: "How AINN verifies claims, sources stories, and maintains editorial integrity.",
};

export default function StandardsPage() {
  return (
    <article style={{ padding: "var(--s5) var(--pad) var(--s8)", maxWidth: "var(--measure)", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--s4)" }}>
        Editorial standards
      </h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "#3B444E", margin: "0 0 var(--s6)" }}>
        AINN exists to tell readers what is actually real in AI. Every story carries a verification mark. We retest vendor benchmarks ourselves. We never launder a company claim into a fact.
      </p>

      {/* Verification marks */}
      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Verification marks
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: "0 0 var(--s4)" }}>
          Every story, wire item, and article header carries one of four marks. They indicate the epistemic status of the primary claim — how much of it we can stand behind.
        </p>
        <div style={{ border: "1px solid var(--rule)", padding: "var(--s4)", marginBottom: "var(--s4)" }}>
          <MarkLegend />
        </div>
        <dl style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
          <dt style={{ fontFamily: "var(--sans)", fontWeight: 600, marginTop: "var(--s3)" }}>Verified</dt>
          <dd style={{ margin: "var(--s1) 0 0 0" }}>We saw the document, ran the test, or confirmed with two independent sources.</dd>
          <dt style={{ fontFamily: "var(--sans)", fontWeight: 600, marginTop: "var(--s3)" }}>Company claim</dt>
          <dd style={{ margin: "var(--s1) 0 0 0" }}>A lab or vendor says so. We have not independently tested or confirmed it.</dd>
          <dt style={{ fontFamily: "var(--sans)", fontWeight: 600, marginTop: "var(--s3)" }}>Reported</dt>
          <dd style={{ margin: "var(--s1) 0 0 0" }}>Sourced to named people or a credible outlet. Not independently confirmed by us.</dd>
          <dt style={{ fontFamily: "var(--sans)", fontWeight: 600, marginTop: "var(--s3)" }}>Unconfirmed</dt>
          <dd style={{ margin: "var(--s1) 0 0 0" }}>Circulating and consequential, but unsettled. We are tracking it.</dd>
        </dl>
      </section>

      {/* Sourcing */}
      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Sourcing policy
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          Every number gets a source or a mark. No orphan statistics. When we cite a benchmark figure, we state whether it comes from our own testing, a vendor claim, or a third-party report. If we cannot attribute a number, we do not publish it.
        </p>
      </section>

      {/* Testing methodology */}
      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Testing methodology
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          When we retest a vendor benchmark, we use the same public APIs and model weights available to anyone. Testing infrastructure is provided by IIMAGINE.AI. Raw logs are available to members. We publish the delta between vendor claims and our results, with a link to the full test output.
        </p>
      </section>

      {/* Corrections */}
      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Corrections
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          When AINN makes an error of fact, we correct it publicly. Corrections appear at the bottom of the affected article with a timestamped note explaining what was wrong and what is now correct. The correction is permanent — we do not silently edit published claims. A running log is maintained at <a href="/corrections" style={{ color: "var(--signal)" }}>/corrections</a>.
        </p>
      </section>

      {/* Images */}
      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          No generated or stock imagery
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          An outlet that tells readers what is real cannot illustrate with fabrications. AINN never uses AI-generated images, stock photography, or illustration. Permitted visuals: data graphics, documentary photography of real subjects, and document scans.
        </p>
      </section>

      {/* Independence */}
      <section>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Independence
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          AINN accepts no lab funding, sponsored content, or vendor review units. Our testing uses the same public APIs and weights available to anyone. See our full <a href="/disclosure" style={{ color: "var(--signal)" }}>ownership and funding disclosure</a>.
        </p>
      </section>
    </article>
  );
}
