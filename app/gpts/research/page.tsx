import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Research GPTs",
  description: "GPTs positioned for archival research, transcript analysis, passage retrieval, or source discovery.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="research"
      title="Research GPTs"
      description="GPTs positioned for archival research, transcript analysis, passage retrieval, or source discovery."
    />
  );
}
