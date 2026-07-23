import type { Metadata } from "next";
import Link from "next/link";
import { getAllGpts } from "@/lib/gpts";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "Alan Watts GPT Resources",
  description:
    "Browse Alan Watts-related GPTs as part of the wider resources directory.",
};

export default function GptResourcesPage() {
  const records = getAllGpts();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Resources directory</p>
        <h1>GPTs</h1>
        <p>
          A compact resources view generated from the canonical GPT directory.
        </p>
      </header>

      <div className={styles.panel}>
        <ul className={styles.list}>
          {records.map((record) => (
            <li key={record.id}>
              <Link href={`/gpts/${record.slug}/`}>{record.name}</Link>
              {" — "}
              {record.creator || "Unknown creator"}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
