import Link from "next/link";
import { getGptsByCategory } from "@/lib/gpts";
import { GptDirectory } from "./GptDirectory";
import styles from "./gpts.module.css";

export function GptCategoryPage({
  category,
  title,
  description,
}: {
  category: string;
  title: string;
  description: string;
}) {
  const records = getGptsByCategory(category);

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/gpts/">GPT Directory</Link>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </nav>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>Directory category</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <GptDirectory records={records} />
    </main>
  );
}
