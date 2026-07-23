import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Essays",
  description: "Editorial essays and source notes published by the independent project.",
  alternates: { canonical: "/essays" },
};

export default function EssaysPage() {
  const count = getHomepageData().mediaCounts.essays;
  return (
    <IndexBuildingPage
      eyebrow="EDITORIAL MEDIA"
      title="ESSAYS"
      description="This index will contain original editorial work, source notes, and clearly labeled contemporary interpretation."
      count={count}
      recordLabel="ESSAY RECORDS"
      related={[
        { label: "TOPICS", href: "/topics" },
        { label: "EDITORIAL STANDARDS", href: "/about/editorial-standards" },
        { label: "AI POLICY", href: "/about/ai-policy" },
      ]}
    />
  );
}
