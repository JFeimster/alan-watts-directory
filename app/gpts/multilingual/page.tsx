import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Multilingual GPTs",
  description: "GPTs whose public listings indicate language support beyond English.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="multilingual"
      title="Multilingual GPTs"
      description="GPTs whose public listings indicate language support beyond English."
    />
  );
}
