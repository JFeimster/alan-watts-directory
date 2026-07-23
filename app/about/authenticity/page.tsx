import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "Authenticity",
  description:
    "How the directory distinguishes historical recordings, uncertain provenance, editorial interpretation, and synthetic recreations.",
  alternates: { canonical: "/about/authenticity" },
};

export default function AuthenticityPage() {
  return (
    <EditorialPage
      eyebrow="RECORDING + PROVENANCE STANDARD"
      title="AUTHENTICITY"
      lead="Historical recordings, remixes, excerpts, transcriptions, synthetic voices, and editorial interpretation must remain visibly distinct."
      links={[
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "SOURCES + ATTRIBUTION", href: "/about/sources-and-attribution" },
        { label: "AI POLICY", href: "/about/ai-policy" },
        { label: "CORRECTIONS", href: "/corrections" },
      ]}
    >
      <section>
        <h2>REAL RECORDING?</h2>
        <p>
          A recording is not labeled authentic merely because it sounds
          convincing or is widely reposted. The repository needs a supported
          provenance record before the strongest authenticity language is used.
        </p>
      </section>
      <section>
        <h2>SOURCE LOCATED?</h2>
        <p>
          Source status should identify what was located, where it was found,
          what can be independently reviewed, and which details remain unknown.
          A platform upload title is not automatically a historical lecture title.
        </p>
      </section>
      <section>
        <h2>CONTEXT PRESERVED?</h2>
        <p>
          Excerpts and quotations should remain connected to surrounding
          argument, available transcript location, series or publication
          context, and uncertainty. Interpretation is labeled as editorial.
        </p>
      </section>
      <section>
        <h2>SYNTHETIC MEDIA</h2>
        <p>
          AI-generated voices and recreated performances must not be presented as
          historical speech. The directory does not infer authenticity from
          voice resemblance alone.
        </p>
      </section>
    </EditorialPage>
  );
}
