import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Comparative Philosophy GPTs",
  description: "GPTs that combine Alan Watts with other thinkers, traditions, or philosophical schools.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="comparative-philosophy"
      title="Comparative Philosophy GPTs"
      description="GPTs that combine Alan Watts with other thinkers, traditions, or philosophical schools."
    />
  );
}
