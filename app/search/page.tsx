import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/EditorialPage";

export const metadata: Metadata = {
  title: "Search Preview",
  description: "Preview the planned cross-directory search interface.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <EditorialPage
      eyebrow="SEARCH / PREVIEW"
      title="SEARCH THE INDEX"
      lead="The route is available, but cross-directory search is not yet connected to every content type."
      status="preview"
      links={[
        { label: "GPT DIRECTORY", href: "/gpts" },
        { label: "TOPICS", href: "/topics" },
        { label: "START HERE", href: "/start-here" },
      ]}
    >
      <section>
        <h2>WHAT WORKS NOW</h2>
        <p>
          The GPT Directory includes its own client-side filtering and comparison
          tools. The topic and Start Here indexes are statically generated and
          browsable through their directory pages.
        </p>
      </section>
      <section>
        <h2>WHAT IS NOT CLAIMED</h2>
        <p>
          This preview does not expose a nonfunctional search form, and the site
          does not publish SearchAction structured data until a working unified
          search endpoint exists.
        </p>
      </section>
    </EditorialPage>
  );
}
