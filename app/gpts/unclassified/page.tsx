import type { Metadata } from "next";
import { getUnclassifiedGpts } from "@/lib/gpts";
import { GptDirectory } from "@/components/gpts/GptDirectory";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Unclassified Alan Watts GPTs",
  description:
    "GPT listings awaiting editorial classification in the Alan Watts GPT Directory.",
};

export default function UnclassifiedGptsPage() {
  const records = getUnclassifiedGpts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Editorial queue</p>
        <h1>Pending Classification</h1>
        <p>
          These listings did not match the current deterministic category rules.
          They remain visible without being forced into inaccurate categories.
        </p>
      </header>

      <GptDirectory records={records} />
    </main>
  );
}
