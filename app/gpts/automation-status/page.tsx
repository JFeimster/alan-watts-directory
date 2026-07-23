import type { Metadata } from "next";
import { getAutomationSummaries } from "@/lib/gpts";
import styles from "@/components/gpts/gpts.module.css";

export const metadata: Metadata = {
  title: "GPT Directory Automation Status",
  description:
    "Latest link validation, URL discovery, and metadata refresh summaries.",
};

function SummaryCard({
  title,
  summary,
}: {
  title: string;
  summary: ReturnType<typeof getAutomationSummaries>["links"];
}) {
  return (
    <article className={styles.automationCard}>
      <h2>{title}</h2>
      {summary ? (
        <>
          <p>Last run: {summary.generatedAt ?? "Unknown"}</p>
          <p>Processed: {summary.processed ?? 0}</p>
          <p>Changed: {summary.changed ?? 0}</p>
          <p>Errors: {summary.errors ?? 0}</p>
        </>
      ) : (
        <p>No automation run has been recorded.</p>
      )}
    </article>
  );
}

export default function AutomationStatusPage() {
  const summaries = getAutomationSummaries();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Operations</p>
        <h1>Automation Status</h1>
        <p>
          Last recorded results for URL discovery, public-link validation, and
          listing-metadata refresh.
        </p>
      </header>

      <div className={styles.automationGrid}>
        <SummaryCard title="URL discovery" summary={summaries.discovery} />
        <SummaryCard title="Link validation" summary={summaries.links} />
        <SummaryCard title="Metadata refresh" summary={summaries.metadata} />
      </div>
    </main>
  );
}
