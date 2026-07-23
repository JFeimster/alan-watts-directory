import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Videos",
  description: "Rights-aware video records with source and authenticity status when available.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  const count = getHomepageData().mediaCounts.videos;
  return (
    <IndexBuildingPage
      eyebrow="VISUAL MEDIA INDEX"
      title="VIDEOS"
      description="Video records will distinguish historical footage, licensed excerpts, editorial video, and synthetic media disclosures."
      count={count}
      recordLabel="VIDEO RECORDS"
      related={[
        { label: "AUTHENTICITY", href: "/about/authenticity" },
        { label: "LECTURES", href: "/lectures" },
        { label: "AI POLICY", href: "/about/ai-policy" },
      ]}
    />
  );
}
