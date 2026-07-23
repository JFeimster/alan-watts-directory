import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Meditation GPTs",
  description: "GPTs focused on meditation, mindfulness, calm, contemplative practice, or spiritual reflection.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="meditation"
      title="Meditation GPTs"
      description="GPTs focused on meditation, mindfulness, calm, contemplative practice, or spiritual reflection."
    />
  );
}
