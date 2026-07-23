import type { Metadata } from "next";
import { getRecentlyReviewedGpts } from "@/lib/gpts";
import { GptDirectory } from "@/components/gpts/GptDirectory";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Recently Reviewed Alan Watts GPTs",
  description: "Recently reviewed listings in the Alan Watts GPT Directory.",
};

export default function RecentlyReviewedGptsPage() {
  const records = getRecentlyReviewedGpts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Editorial activity</p>
        <h1>Recently Reviewed</h1>
        <p>
          Listings ordered by their most recent documented directory review.
        </p>
      </header>

      {records.length ? (
        <GptDirectory records={records} />
      ) : (
        <div className={styles.empty}>
          <h2>No completed reviews yet</h2>
          <p>Imported listings remain available elsewhere in the directory.</p>
        </div>
      )}
    </main>
  );
}
