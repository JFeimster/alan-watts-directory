import Link from "next/link";
import type { FooterGroup, SiteConfig } from "@/lib/site";

type SiteFooterProps = {
  site: Pick<SiteConfig, "name" | "logoText" | "tagline" | "copyright">;
  groups: FooterGroup[];
};

export function SiteFooter({ site, groups }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__masthead">
        <div>
          <p className="system-label">INDEPENDENT RESEARCH + DISCOVERY</p>
          <h2>{site.tagline}</h2>
        </div>
        <p>
          {site.name} is an independent editorial, research, and discovery
          project. It is not an official estate website.
        </p>
      </div>

      <div className="site-footer__grid">
        {groups.map((group, index) => (
          <section className="site-footer__group" key={group.label}>
            <h3>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {group.label}
            </h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  {item.status === "planned" ? (
                    <span aria-disabled="true">
                      {item.label}
                      <small>PLANNED</small>
                    </span>
                  ) : (
                    <Link href={item.href}>
                      {item.label}
                      {item.status === "preview" ? <small>PREVIEW</small> : null}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="site-footer__legal">
        <span>{site.copyright}</span>
        <span>NO OFFICIAL AFFILIATION CLAIMED</span>
      </div>
      <div className="site-footer__wordmark" aria-label={site.logoText}>
        {site.logoText}
      </div>
    </footer>
  );
}
