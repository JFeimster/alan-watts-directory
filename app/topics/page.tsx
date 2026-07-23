import type { Metadata } from "next";
import Link from "next/link";
import { getTopics } from "@/lib/topics";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Explore a source-conscious topic taxonomy connecting Alan Watts lectures, books, quotes, and contemporary editorial questions.",
  alternates: { canonical: "/topics" },
};

export default function TopicsPage() {
  const topics = getTopics();

  return (
    <main className="index-page">
      <header className="index-hero">
        <div>
          <p className="system-label">MODULAR TAXONOMY</p>
          <h1>TOPICS</h1>
        </div>
        <div className="index-hero__readout">
          <span>TOPIC RECORDS</span>
          <strong>{topics.length}</strong>
          <small>EDITORIAL DISCOVERY PATHS</small>
        </div>
      </header>

      <section className="home-section">
        <div className="record-grid">
          {topics.map((topic) => (
            <Link className="record-card" href={`/topics/${topic.slug}`} key={topic.slug}>
              <div className="record-card__meta">
                <span>T{String(topic.order).padStart(2, "0")}</span>
                <span className="route-status" data-status={topic.status}>{topic.status}</span>
              </div>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
              <b>OPEN TOPIC →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
