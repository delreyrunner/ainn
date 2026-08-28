import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About AINN — AI News Network. Independent AI journalism with verification marks on every claim.",
};

export default function AboutPage() {
  return (
    <article style={{ padding: "var(--s5) var(--pad) var(--s8)", maxWidth: "var(--measure)", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--s4)" }}>
        About AINN
      </h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "#3B444E", margin: "0 0 var(--s6)" }}>
        AINN (AI News Network) is an independent wire service covering the AI industry. We independently verify vendor claims, retest benchmarks, and map real-time public sentiment.
      </p>

      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          What we do
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          Every story carries a verification mark showing how much of it we can stand behind. We run independent benchmark tests using real infrastructure, collect and analyse public sentiment data, and present findings with full transparency. When a vendor says their model does something, we test it.
        </p>
      </section>

      <section style={{ marginBottom: "var(--s6)" }} id="editorial">
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          AINN Research Desk
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          Articles are published under the institutional byline "AINN Research Desk." This represents our editorial team and testing infrastructure working together to produce verified reporting. Individual reporters are credited by name when they are the primary source of original reporting.
        </p>
      </section>

      <section style={{ marginBottom: "var(--s6)" }}>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Founding
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          AINN was founded in 2026 by Adam Radly, who also founded IIMAGINE.AI — an AI platform with model testing capabilities. The relationship between the two entities is fully disclosed on our <a href="/disclosure" style={{ color: "var(--signal)" }}>disclosure page</a>.
        </p>
      </section>

      <section>
        <h2 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.015em", margin: "0 0 var(--s3)" }}>
          Contact
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          For press inquiries, corrections, or tips: editorial@ainewsnet.com
        </p>
      </section>
    </article>
  );
}
