import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "Corrections Preview",
  description: "Correction standards and connection status for the directory.",
  robots: { index: false, follow: true },
};

export default function CorrectionsPage() {
  return (
    <EditorialPage
      eyebrow="CORRECTIONS / PREVIEW"
      title="REPORT AN ISSUE"
      lead="The correction standard is public. The submission connection is not yet configured."
      status="preview"
      links={[
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "SOURCES + ATTRIBUTION", href: "/about/sources-and-attribution" },
        { label: "REPORT A GPT", href: "/gpts/report" },
      ]}
    >
      <section>
        <h2>STATUS</h2>
        <blockquote>STATUS: CORRECTION FORM CONNECTION PENDING</blockquote>
        <p>
          No form is displayed because the repository does not contain a contact
          endpoint. This page does not pretend to submit or store a report.
        </p>
      </section>
      <section>
        <h2>USEFUL EVIDENCE</h2>
        <p>
          A future correction report should identify the affected URL or record,
          the disputed wording or field, the supporting source, and the requested
          change.
        </p>
      </section>
    </EditorialPage>
  );
}
