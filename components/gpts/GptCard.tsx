import Link from "next/link";
import type { GptIndexRecord } from "@/lib/gpts";
import { GptAvatar } from "./GptAvatar";
import styles from "./gpts.module.css";

function availabilityLabel(value?: string): string {
  if (!value || value === "unknown") return "Status pending";
  return value.replaceAll("-", " ");
}

export function GptCard({ gpt }: { gpt: GptIndexRecord }) {
  const categories = gpt.categories ?? [];

  return (
    <article className={styles.card}>
      <div className={styles.cardTopline}>
        <GptAvatar
          name={gpt.name}
          imagePath={gpt.imageLocalPath}
          size="small"
        />
        <div className={styles.cardIdentity}>
          <p className={styles.eyebrow}>
            {gpt.creatorVerified ? "Creator verified" : "Imported listing"}
          </p>
          <h2 className={styles.cardTitle}>
            <Link href={`/gpts/${gpt.slug}/`}>{gpt.name}</Link>
          </h2>
          <p className={styles.creator}>By {gpt.creator || "Unknown creator"}</p>
        </div>
        {gpt.usersDisplay ? (
          <span className={styles.usage}>{gpt.usersDisplay}</span>
        ) : null}
      </div>

      <p className={gpt.description ? styles.description : styles.descriptionMuted}>
        {gpt.description || "Description has not been reviewed."}
      </p>

      {categories.length > 0 ? (
        <ul className={styles.tags} aria-label="Categories">
          {categories.slice(0, 4).map((category) => (
            <li key={category}>
              <Link href={`/gpts/${category}/`}>
                {category.replaceAll("-", " ")}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.unclassified}>Classification pending</p>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.statusDot} data-status={gpt.availability ?? "unknown"}>
          {availabilityLabel(gpt.availability)}
        </span>
        <Link href={`/gpts/${gpt.slug}/`}>Inspect profile →</Link>
      </div>
    </article>
  );
}
