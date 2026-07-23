"use client";

import { useMemo, useState } from "react";
import type { GptRecord } from "@/lib/gpts";
import styles from "./gpts.module.css";

function creatorName(record: GptRecord): string {
  return record.creator?.displayName || "Unknown creator";
}

function capabilitySummary(record: GptRecord): string {
  const demonstrated = Object.entries(record.capabilities ?? {})
    .filter(([, value]) => !["unknown", "no", ""].includes(value))
    .map(([key]) => key.replaceAll(/([A-Z])/g, " $1").trim());

  return demonstrated.length ? demonstrated.join(", ") : "Not evaluated";
}

export function GptCompareClient({ records }: { records: GptRecord[] }) {
  const defaults = records.slice(0, 3).map((record) => record.slug);
  const [selected, setSelected] = useState<string[]>(defaults);

  const compared = useMemo(
    () =>
      selected
        .map((slug) => records.find((record) => record.slug === slug))
        .filter((record): record is GptRecord => Boolean(record)),
    [records, selected],
  );

  function setSlot(index: number, value: string) {
    setSelected((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  const rows: Array<[string, (record: GptRecord) => string]> = [
    ["Creator", creatorName],
    ["Purpose", (record) => (record.categories ?? []).join(", ") || "Pending"],
    ["Usage snapshot", (record) => record.usage?.display || "Not available"],
    [
      "Availability",
      (record) =>
        record.review?.availability || record.url?.status || "Unknown",
    ],
    ["Review", (record) => record.review?.status || "Unreviewed"],
    [
      "Source grounding",
      (record) =>
        record.knowledge?.sourceGroundingStatus || "Not evaluated",
    ],
    [
      "Simulation",
      (record) =>
        record.disclosures?.firstPersonSimulation
          ? "First-person simulation indicated"
          : "Not currently flagged",
    ],
    [
      "Languages",
      (record) =>
        (record.supportedLanguages ?? []).join(", ") ||
        record.listingLanguage ||
        "Unknown",
    ],
    ["Capabilities", capabilitySummary],
  ];

  return (
    <section>
      <div className={styles.compareSelectors}>
        {[0, 1, 2].map((index) => (
          <label key={index}>
            <span>GPT {index + 1}</span>
            <select
              value={selected[index] ?? ""}
              onChange={(event) => setSlot(index, event.target.value)}
            >
              {records.map((record) => (
                <option key={record.slug} value={record.slug}>
                  {record.name} — {creatorName(record)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th>Criterion</th>
              {compared.map((record) => (
                <th key={record.slug}>{record.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label}>
                <th>{label}</th>
                {compared.map((record) => (
                  <td key={`${label}-${record.slug}`}>{render(record)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
