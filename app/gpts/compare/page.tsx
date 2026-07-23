import type { Metadata } from "next";
import { getAllCanonicalGpts } from "@/lib/gpts";
import { GptCompareClient } from "@/components/gpts/GptCompareClient";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Compare Alan Watts GPTs",
  description:
    "Compare Alan Watts-related GPTs by purpose, source transparency, simulation disclosure, availability, capabilities, and review status.",
};

export default function CompareGptsPage() {
  const records = getAllCanonicalGpts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Side-by-side inspection</p>
        <h1>Compare GPTs</h1>
        <p>
          Select three listings and compare their imported claims, review
          status, source transparency, simulation disclosure, languages, and
          observed capabilities.
        </p>
      </header>

      <GptCompareClient records={records} />
    </main>
  );
}
