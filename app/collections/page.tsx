import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse supported lecture and media collections when records are available.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const module = getHomepageData().libraryModules.find((item) => item.label === "Collections");
  return (
    <IndexBuildingPage
      eyebrow="RELATIONSHIP INDEX"
      title="COLLECTIONS"
      description="Collections will group supported records while keeping source, edition, and provenance distinctions visible."
      count={module?.count ?? 0}
      recordLabel="COLLECTION RECORDS"
      related={[
        { label: "LECTURES", href: "/lectures" },
        { label: "BOOKS", href: "/books" },
        { label: "TOPICS", href: "/topics" },
      ]}
    />
  );
}
