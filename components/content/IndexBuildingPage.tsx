import Link from "next/link";

type IndexBuildingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  recordLabel: string;
  related?: Array<{ label: string; href: string }>;
};

export function IndexBuildingPage({
  eyebrow,
  title,
  description,
  count,
  recordLabel,
  related = [],
}: IndexBuildingPageProps) {
  return (
    <main className="index-page">
      <header className="index-hero">
        <div>
          <p className="system-label">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="index-hero__readout">
          <span>REPOSITORY COUNT</span>
          <strong>{count > 0 ? count.toLocaleString("en-US") : "INDEX BUILDING"}</strong>
          <small>{recordLabel}</small>
        </div>
      </header>

      <section className="index-empty">
        <div aria-hidden="true">00</div>
        <div>
          <p className="system-label">STATIC-FIRST DATA STATUS</p>
          <h2>{count > 0 ? "RECORDS AVAILABLE" : "NO RECORDS IMPORTED"}</h2>
          <p>{description}</p>
          {count === 0 ? (
            <p>
              This preview does not substitute unverified mock entries for missing
              source data.
            </p>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <nav className="index-related" aria-label="Related directories">
          {related.map((item) => (
            <Link href={item.href} key={item.href}>{item.label} →</Link>
          ))}
        </nav>
      ) : null}
    </main>
  );
}
