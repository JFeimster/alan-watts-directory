import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Quotes in Context",
  description:
    "Browse documented wording, popular variants, source locations, verification status, and surrounding context when supported.",
  alternates: { canonical: "/quotes" },
};

export default function QuotesPage() {
  const data = getHomepageData();
  return (
    <IndexBuildingPage
      eyebrow="WORDING + SOURCE CONTROL"
      title="QUOTES"
      description="No quotation is published from the repository without wording and provenance data. Page numbers, timestamps, variants, and verification states are never invented."
      count={data.quoteRecordCount}
      recordLabel="QUOTE RECORDS"
      related={[
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "SOURCES", href: "/about/sources-and-attribution" },
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "TOPICS", href: "/topics" },
      ]}
    />
  );
}
