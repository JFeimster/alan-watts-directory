import type { Metadata } from "next";
import Link from "next/link";
import { getStartHereRecords } from "@/lib/start-here";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "Six source-conscious guides for beginning with Alan Watts lectures, books, ideas, and recording authenticity.",
  alternates: { canonical: "/start-here" },
};

export default function StartHerePage() {
  const records = getStartHereRecords();

  return (
    <main className="index-page">
      <header className="index-hero">
        <div>
          <p className="system-label">ORIENTATION LAYER</p>
          <h1>START HERE</h1>
        </div>
        <div className="index-hero__readout">
          <span>GUIDE RECORDS</span>
          <strong>{records.length}</strong>
          <small>EDITORIAL ENTRY POINTS</small>
        </div>
      </header>

      <section className="home-section">
        <div className="record-grid">
          {records.map((record) => (
            <Link className="record-card" href={`/start-here/${record.slug}`} key={record.slug}>
              <div className="record-card__meta">
                <span>{String(record.order).padStart(2, "0")}</span>
                <span className="route-status" data-status={record.status}>{record.status}</span>
              </div>
              <h2>{record.title}</h2>
              <p>{record.description}</p>
              <b>{record.cta} →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
