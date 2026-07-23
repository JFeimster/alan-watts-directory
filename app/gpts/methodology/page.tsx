import type { Metadata } from "next";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "GPT Directory Methodology",
  description:
    "How GPT listings are imported, classified, reviewed, compared, and corrected.",
};

export default function MethodologyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Editorial standards</p>
        <h1>GPT Directory Methodology</h1>
        <p>
          The directory separates imported claims, automated classifications,
          creator-confirmed details, and editorial observations.
        </p>
      </header>

      <div className={styles.detailGrid}>
        <section>
          <div className={styles.panel}>
            <h2>1. Import</h2>
            <p>
              Public listing metadata is normalized, deduplicated, and stored
              without treating marketing descriptions as verified facts.
            </p>
          </div>
          <div className={styles.panel}>
            <h2>2. Classification</h2>
            <p>
              Categories are seeded from deterministic text rules and may be
              revised through editorial review.
            </p>
          </div>
          <div className={styles.panel}>
            <h2>3. Creator verification</h2>
            <p>
              Creator verification means the directory confirmed control of a
              listing. It does not imply endorsement by OpenAI or the Alan
              Watts estate.
            </p>
          </div>
          <div className={styles.panel}>
            <h2>4. Evaluation</h2>
            <p>
              Standardized prompts evaluate source transparency, attribution,
              uncertainty, simulation disclosure, and practical utility.
            </p>
          </div>
        </section>

        <aside>
          <div className={styles.notice}>
            Directory inclusion is informational. Scores and badges should be
            based on documented review—not merely a GPT description claiming
            access to books, lectures, or transcripts.
          </div>
        </aside>
      </div>
    </main>
  );
}
