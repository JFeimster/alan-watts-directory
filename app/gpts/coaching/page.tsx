import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Coaching GPTs",
  description: "GPTs positioned as personal coaches, mentors, advisors, or decision companions.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="coaching"
      title="Coaching GPTs"
      description="GPTs positioned as personal coaches, mentors, advisors, or decision companions."
    />
  );
}
