import Link from "next/link";
import type { ReactNode } from "react";

type EditorialPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  status?: "live" | "preview";
  children: ReactNode;
  links?: Array<{ label: string; href: string }>;
};

export function EditorialPage({
  eyebrow,
  title,
  lead,
  status = "live",
  children,
  links = [],
}: EditorialPageProps) {
  return (
    <main className="editorial-page">
      <header className="editorial-hero">
        <div className="editorial-hero__meta">
          <p className="system-label">{eyebrow}</p>
          <span className="route-status" data-status={status}>{status}</span>
        </div>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>

      <div className="editorial-layout">
        <article className="editorial-content">{children}</article>
        {links.length ? (
          <aside className="editorial-related" aria-label="Related pages">
            <p className="system-label">RELATED INDEX</p>
            <ul>
              {links.map((link, index) => (
                <li key={link.href}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Link href={link.href}>{link.label} →</Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
