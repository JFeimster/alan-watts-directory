import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Source-Grounded GPTs",
  description: "GPTs whose public descriptions claim use of books, lectures, transcripts, passages, or citations. Claims remain subject to review.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="source-grounded"
      title="Source-Grounded GPTs"
      description="GPTs whose public descriptions claim use of books, lectures, transcripts, passages, or citations. Claims remain subject to review."
    />
  );
}
