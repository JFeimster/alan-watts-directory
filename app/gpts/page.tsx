import type { Metadata } from "next";
import Link from "next/link";
import { getAllGpts, getCategoryCounts } from "@/lib/gpts";
import { GptDirectory } from "@/components/gpts/GptDirectory";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Alan Watts GPT Directory",
  description:
    "Explore, compare, and evaluate public GPTs related to Alan Watts, philosophy, meditation, research, coaching, and writing.",
};

export default function GptsPage() {
  const records = getAllGpts();
  const categoryCounts = getCategoryCounts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Research tools, companions, and simulations</p>
        <h1>Alan Watts GPT Directory</h1>
        <p>
          A transparent directory that separates research utilities, editorial
          companions, coaching products, and first-person simulations instead
          of presenting them as interchangeable forms of “Alan Watts.”
        </p>
      </header>

      <div className={styles.notice}>
        Inclusion does not imply endorsement, source accuracy, creator
        verification, affiliation with OpenAI, or affiliation with the Alan
        Watts estate.
      </div>

      <div className={styles.categoryRail}>
        {(categoryCounts.categories ?? []).map((category) => (
          <Link
            className={styles.categoryTile}
            href={`/gpts/${category.id}/`}
            key={category.id}
          >
            <strong>{category.count}</strong>
            <span>{category.label}</span>
          </Link>
        ))}
        <Link className={styles.categoryTile} href="/gpts/unclassified/">
          <strong>{categoryCounts.unclassified ?? 0}</strong>
          <span>Pending classification</span>
        </Link>
      </div>

      <GptDirectory records={records} />
    </main>
  );
}
