import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "Sources and Attribution",
  description:
    "How the directory records provenance, attribution, source locations, imported claims, and unresolved gaps.",
  alternates: { canonical: "/about/sources-and-attribution" },
};

export default function SourcesAndAttributionPage() {
  return (
    <EditorialPage
      eyebrow="PROVENANCE SYSTEM"
      title="SOURCES + ATTRIBUTION"
      lead="A source record should say what was found, where it came from, what it supports, and what remains unresolved."
      links={[
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "AI POLICY", href: "/about/ai-policy" },
        { label: "CORRECTIONS", href: "/corrections" },
      ]}
    >
      <section>
        <h2>SOURCE RECORDS</h2>
        <p>
          The repository is designed to connect lectures, books, quotations,
          transcripts, media, people, and editorial records through structured
          identifiers. A source field is not treated as verified merely because
          it is populated.
        </p>
      </section>
      <section>
        <h2>ATTRIBUTION</h2>
        <p>
          Creator, publisher, uploader, editor, rights holder, and historical
          speaker are different roles. Attribution should preserve those
          distinctions and avoid implying rights or official affiliation.
        </p>
      </section>
      <section>
        <h2>IMPORTED CLAIMS</h2>
        <p>
          Third-party listing descriptions and claimed knowledge sources remain
          imported claims until separately reviewed. The GPT Directory follows
          this rule explicitly.
        </p>
      </section>
      <section>
        <h2>CITATION GAPS</h2>
        <p>
          When a page number, timestamp, edition, recording date, or original
          source is unavailable, the directory should say so rather than provide
          a plausible-looking substitute.
        </p>
      </section>
    </EditorialPage>
  );
}
