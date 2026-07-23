import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Project",
  description:
    "About the independent Alan Watts research, discovery, and source-conscious directory project.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const site = getSiteConfig();

  return (
    <EditorialPage
      eyebrow="INDEPENDENT PROJECT"
      title="THE PROJECT"
      lead={`${site.name} is a source-conscious directory, research guide, discovery engine, listening companion, and creator utility platform.`}
      links={[
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "SOURCES + ATTRIBUTION", href: "/about/sources-and-attribution" },
        { label: "AI POLICY", href: "/about/ai-policy" },
        { label: "CORRECTIONS", href: "/corrections" },
      ]}
    >
      <section>
        <h2>POSITION</h2>
        <p>
          The project helps visitors find, understand, verify, compare, listen,
          read, connect, create, and contribute without presenting itself as an
          official archive or rights holder.
        </p>
      </section>
      <section>
        <h2>BOUNDARIES</h2>
        <p>
          The project is not the official Alan Watts website, the Alan Watts
          estate, the Alan Watts Organization, or the definitive steward of all
          authentic recordings. It does not claim affiliation with OpenAI or
          third-party GPT creators.
        </p>
      </section>
      <section>
        <h2>METHOD</h2>
        <p>
          Structured records expose source status, review status, uncertainty,
          editorial interpretation, and gaps. Empty indexes remain visible
          rather than being filled with unsupported prototype content.
        </p>
      </section>
    </EditorialPage>
  );
}
