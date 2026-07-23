import styles from "@/components/gpts/gpts.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>GPT Directory</p>
        <h1>Submit a GPT</h1>
        <p>
          This page is scaffolded and ready for its form, workflow, or reviewed dataset.
        </p>
      </header>
    </main>
  );
}
