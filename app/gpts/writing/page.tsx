import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Writing GPTs",
  description: "GPTs designed for writing, scripting, formatting, narration, or creative production.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="writing"
      title="Writing GPTs"
      description="GPTs designed for writing, scripting, formatting, narration, or creative production."
    />
  );
}
