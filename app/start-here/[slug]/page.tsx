import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStartHereRecord,
  getStartHereRecords,
} from "@/lib/start-here";

export function generateStaticParams() {
  return getStartHereRecords().map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getStartHereRecord(slug);
  if (!record) return { title: "Guide not found" };

  return {
    title: record.title,
    description: record.description,
    alternates: { canonical: `/start-here/${record.slug}` },
  };
}

export default async function StartHereDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getStartHereRecord(slug);
  if (!record) notFound();

  return (
    <main className="editorial-page">
      <header className="editorial-hero">
        <nav className="breadcrumbs-brutal" aria-label="Breadcrumb">
          <Link href="/">HOME</Link>
          <span>/</span>
          <Link href="/start-here">START HERE</Link>
          <span>/</span>
          <span>{record.title.toUpperCase()}</span>
        </nav>
        <div className="editorial-hero__meta">
          <p className="system-label">GUIDE {String(record.order).padStart(2, "0")}</p>
          <span className="route-status" data-status={record.status}>{record.status}</span>
        </div>
        <h1>{record.title}</h1>
        <p>{record.intro}</p>
      </header>

      <article className="editorial-content">
        <div className="guide-modules">
          {record.sections.map((section, index) => (
            <section className="guide-module" key={section.label}>
              <p className="system-label">
                {String(index + 1).padStart(2, "0")} / {section.label}
              </p>
              <h2>{section.label}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
