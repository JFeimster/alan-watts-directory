import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description:
    "Standards for source status, quotation verification, uncertainty, corrections, and contemporary interpretation.",
  alternates: { canonical: "/about/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <EditorialPage
      eyebrow="PUBLIC EDITORIAL STANDARD"
      title="EDITORIAL STANDARDS"
      lead="Confidence is not evidence. Every record should make its source, review state, uncertainty, and editorial layer legible."
      links={[
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "SOURCES + ATTRIBUTION", href: "/about/sources-and-attribution" },
        { label: "AI POLICY", href: "/about/ai-policy" },
        { label: "CORRECTIONS", href: "/corrections" },
      ]}
    >
      <section>
        <h2>DO NOT INVENT</h2>
        <p>
          The directory does not invent quotations, lecture titles, recording
          dates, timestamps, page references, book relationships, or verification
          claims. Missing evidence remains a visible gap.
        </p>
      </section>
      <section>
        <h2>LABEL THE LAYER</h2>
        <p>
          Historical record, imported listing claim, editorial interpretation,
          contemporary application, and synthetic simulation are separate
          content layers and must not be presented as interchangeable.
        </p>
      </section>
      <section>
        <h2>SHOW UNCERTAINTY</h2>
        <p>
          Review status and provenance notes should explain what is supported,
          what is probable, what is unconfirmed, and what appears misattributed.
          The directory does not imply that every record has been verified.
        </p>
      </section>
      <section>
        <h2>CORRECT IN PUBLIC</h2>
        <p>
          Corrections should preserve a clear record of the issue, the supporting
          source, the editorial decision, and the date of the update when a
          correction workflow is connected.
        </p>
      </section>
    </EditorialPage>
  );
}
