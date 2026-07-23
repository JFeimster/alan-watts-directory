import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "AI Policy",
  description:
    "Policy for synthetic voices, generated text, GPT listings, editorial assistance, and historical integrity.",
  alternates: { canonical: "/about/ai-policy" },
};

export default function AiPolicyPage() {
  return (
    <EditorialPage
      eyebrow="SYNTHETIC MEDIA + AUTOMATION"
      title="AI POLICY"
      lead="Automation may support indexing and editorial workflows, but it does not convert an unsupported claim into a historical fact."
      links={[
        { label: "GPT DIRECTORY", href: "/gpts" },
        { label: "GPT METHODOLOGY", href: "/gpts/methodology" },
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
      ]}
    >
      <section>
        <h2>SYNTHETIC VOICES</h2>
        <p>
          Generated or recreated voices must be disclosed and must not be framed
          as authentic historical recordings. Voice resemblance is not
          provenance.
        </p>
      </section>
      <section>
        <h2>GENERATED TEXT</h2>
        <p>
          Generated summaries, descriptions, prompts, and contemporary
          interpretations require editorial labeling and source review. They
          must not be presented as quotations or historical speech.
        </p>
      </section>
      <section>
        <h2>GPT LISTINGS</h2>
        <p>
          Directory inclusion does not imply endorsement, source accuracy,
          creator verification, affiliation with OpenAI, or affiliation with the
          Alan Watts estate. Public product claims remain distinct from
          directory findings.
        </p>
      </section>
      <section>
        <h2>AUTOMATION</h2>
        <p>
          Import, enrichment, link-checking, and index-building scripts may
          process structured data. Their outputs retain review status and do not
          silently upgrade evidence.
        </p>
      </section>
    </EditorialPage>
  );
}
