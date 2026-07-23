"use client";

import { useMemo, useState } from "react";
import type { GptIndexRecord } from "@/lib/gpts";
import { GptCard } from "./GptCard";
import styles from "./gpts.module.css";

export function GptDirectory({
  records,
}: {
  records: GptIndexRecord[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "name" | "reviewed">("popular");
  const [classification, setClassification] = useState<
    "all" | "classified" | "unclassified"
  >("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const result = records.filter((record) => {
      const classified = (record.categories ?? []).length > 0;

      if (classification === "classified" && !classified) return false;
      if (classification === "unclassified" && classified) return false;

      if (!normalized) return true;

      return [
        record.name,
        record.creator,
        record.description,
        ...(record.categories ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });

    return [...result].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "reviewed") {
        return Number(Boolean(b.lastReviewedAt)) - Number(Boolean(a.lastReviewedAt));
      }

      return (
        (b.usersLowerBound ?? 0) - (a.usersLowerBound ?? 0) ||
        a.name.localeCompare(b.name)
      );
    });
  }, [classification, query, records, sort]);

  return (
    <>
      <div className={styles.toolbar}>
        <label className={styles.searchField}>
          <span className={styles.srOnly}>Search GPTs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search GPTs, creators, uses, or categories…"
          />
        </label>

        <label>
          <span className={styles.srOnly}>Classification filter</span>
          <select
            value={classification}
            onChange={(event) =>
              setClassification(
                event.target.value as "all" | "classified" | "unclassified",
              )
            }
          >
            <option value="all">All classifications</option>
            <option value="classified">Classified</option>
            <option value="unclassified">Pending classification</option>
          </select>
        </label>

        <label>
          <span className={styles.srOnly}>Sort directory</span>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "popular" | "name" | "reviewed")
            }
          >
            <option value="popular">Most used</option>
            <option value="name">Name A–Z</option>
            <option value="reviewed">Recently reviewed</option>
          </select>
        </label>
      </div>

      <div className={styles.resultBar}>
        <p>
          <strong>{filtered.length}</strong> of {records.length} listings
        </p>
        <p>Imported claims remain distinct from directory verification.</p>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((record) => (
            <GptCard key={record.id} gpt={record} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>No matching GPTs</h2>
          <p>Try a broader name, creator, purpose, or category.</p>
        </div>
      )}
    </>
  );
}
