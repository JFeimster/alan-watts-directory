import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Lectures",
  description:
    "Browse Alan Watts lecture records with source, date, transcript, topic, and authenticity status when supported.",
  alternates: { canonical: "/lectures" },
};

export default function LecturesPage() {
  const data = getHomepageData();
  return (
    <IndexBuildingPage
      eyebrow="AUDIO + PROVENANCE INDEX"
      title="LECTURES"
      description="Lecture titles, dates, series relationships, audio availability, transcript coverage, and authenticity labels will appear only after supported records are imported."
      count={data.listeningRecordCount}
      recordLabel="LECTURE RECORDS"
      related={[
        { label: "START HERE", href: "/start-here" },
        { label: "TOPICS", href: "/topics" },
        { label: "BOOKS", href: "/books" },
        { label: "AUTHENTICITY", href: "/about/authenticity" },
      ]}
    />
  );
}
