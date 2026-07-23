import type { Metadata } from "next";
import { GptCategoryPage } from "@/components/gpts/GptCategoryPage";

export const metadata: Metadata = {
  title: "First-Person Simulations",
  description: "GPTs that present themselves as speaking as, embodying, roleplaying, or simulating Alan Watts.",
};

export default function Page() {
  return (
    <GptCategoryPage
      category="first-person-simulations"
      title="First-Person Simulations"
      description="GPTs that present themselves as speaking as, embodying, roleplaying, or simulating Alan Watts."
    />
  );
}
