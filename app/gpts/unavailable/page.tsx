import type { Metadata } from "next";
import { getUnavailableGpts } from "@/lib/gpts";
import { GptDirectory } from "@/components/gpts/GptDirectory";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Unavailable Alan Watts GPTs",
  description:
    "Unavailable, removed, or inaccessible listings retained for directory history.",
};

export default function UnavailableGptsPage() {
  const records = getUnavailableGpts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Availability history</p>
        <h1>Unavailable GPTs</h1>
        <p>
          Listings are retained when a GPT becomes unavailable so changes do not
          silently erase the directory’s historical record.
        </p>
      </header>

      {records.length ? (
        <GptDirectory records={records} />
      ) : (
        <div className={styles.empty}>
          <h2>No confirmed unavailable listings</h2>
          <p>Availability checks have not marked any records unavailable.</p>
        </div>
      )}
    </main>
  );
}
