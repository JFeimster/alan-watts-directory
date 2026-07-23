import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "Creator-Verified GPTs",
  description: "Listings whose creators have claimed and verified control through this directory.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="creator-verified"
      title="Creator-Verified GPTs"
      description="Listings whose creators have claimed and verified control through this directory."
    />
  );
}
