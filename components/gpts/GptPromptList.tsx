"use client";

import { useState } from "react";
import styles from "./gpts.module.css";

export function GptPromptList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function copy(value: string, index: number) {
    await navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1600);
  }

  if (!items.length) {
    return <p className={styles.emptyInline}>{emptyText}</p>;
  }

  return (
    <div className={styles.promptList}>
      {items.map((item, index) => (
        <article className={styles.promptItem} key={`${item}-${index}`}>
          <p>{item}</p>
          <button type="button" onClick={() => copy(item, index)}>
            {copiedIndex === index ? "Copied" : "Copy"}
          </button>
        </article>
      ))}
    </div>
  );
}
