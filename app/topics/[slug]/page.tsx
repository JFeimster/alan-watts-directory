import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, getTopics } from "@/lib/topics";

export function generateStaticParams() {
  return getTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };

  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: `/topics/${topic.slug}` },
  };
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <main className="editorial-page">
      <header className="editorial-hero">
        <nav className="breadcrumbs-brutal" aria-label="Breadcrumb">
          <Link href="/">HOME</Link>
          <span>/</span>
          <Link href="/topics">TOPICS</Link>
          <span>/</span>
          <span>{topic.title.toUpperCase()}</span>
        </nav>
        <div className="editorial-hero__meta">
          <p className="system-label">{topic.label ?? `TOPIC ${String(topic.order).padStart(2, "0")}`}</p>
          <span className="route-status" data-status={topic.status}>{topic.status}</span>
        </div>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </header>

      <div className="editorial-layout">
        <article className="editorial-content">
          <section>
            <h2>EDITORIAL SCOPE</h2>
            <p>{topic.editorialNote}</p>
          </section>
          <section>
            <h2>RECORD STATUS</h2>
            <p>
              This taxonomy record is live. Related lecture, book, quotation, and
              transcript relationships remain empty until supported records are
              imported into the repository.
            </p>
          </section>
        </article>
        <aside className="editorial-related" aria-label="Related directories">
          <p className="system-label">RELATED INDEXES</p>
          <ul>
            {topic.relatedRoutes.map((href, index) => (
              <li key={href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Link href={href}>{href.slice(1).toUpperCase()} →</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
