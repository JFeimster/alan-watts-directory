import Link from "next/link";
import type { ReactNode } from "react";
import {
  type Book,
  type Collection,
  type DirectoryPage,
  type Essay,
  type Lecture,
  type ResourceCategory,
  type Quote,
  type Topic,
  type Verification,
  type Video,
  footerBusinessLinks,
  navGroups,
  topicTitle,
} from "./content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Alan Watts Wisdom home">
          <span className="monogram" aria-hidden="true">AW</span>
          <span>Alan Watts <i>Wisdom</i></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <details key={group.label}>
              <summary>{group.label}</summary>
              <div className="mega-menu">
                <Link className="mega-overview" href={group.href}>{group.label} Overview</Link>
                {group.links.map((item) => (
                  <Link href={item.href} key={item.href}>{item.label}</Link>
                ))}
              </div>
            </details>
          ))}
          <Link className="search-link" href="/search/" aria-label="Search">⌕</Link>
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}

export function MobileNavigation() {
  return (
    <details className="mobile-nav">
      <summary aria-label="Open navigation">Menu</summary>
      <nav aria-label="Mobile navigation">
        {navGroups.map((group) => (
          <div className="mobile-nav-group" key={group.label}>
            <Link className="mobile-nav-parent" href={group.href}>{group.label}</Link>
            {group.links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </div>
        ))}
        <Link href="/search/">Search</Link>
      </nav>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="wordmark footer-mark"><span className="monogram">AW</span><span>Alan Watts <i>Wisdom</i></span></div>
          <p>A source-grounded library for listening, reading, and asking better questions.</p>
        </div>
        <FooterColumn title="Explore" links={navGroups[0].links.slice(0, 4).map((link) => [link.label, link.href])} />
        <FooterColumn title="Library" links={navGroups[1].links.map((link) => [link.label, link.href])} />
        <FooterColumn title="Business" links={footerBusinessLinks.map((link) => [link.label, link.href])} />
        <FooterColumn title="Standards" links={[["Authenticity", "/about/authenticity/"], ["Editorial standards", "/about/editorial-standards/"], ["Sources", "/about/sources/"], ["Search", "/search/"]]} />
      </div>
      <div className="shell footer-bottom">
        <span>Independent editorial archive · Temporary project name</span>
        <span>Clarity over comfort. Sources over slogans.</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      {links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero shell">
      <div className="hero-copy">
        <p className="kicker">A listening library for the incurably curious</p>
        <h1>Explore Alan Watts through authentic lectures, books, quotations, and ideas.</h1>
        <p className="lede">An editorial archive built for context—not guru worship, algorithmic mysticism, or quotes that mysteriously appeared on Pinterest.</p>
        <div className="button-row">
          <Link className="button primary" href="/topics/">Explore the Topics <span>→</span></Link>
          <Link className="button secondary" href="/start-here/">Start With Alan Watts</Link>
        </div>
        <div className="trust-row">
          <span>12 topic paths</span><span>Source labels</span><span>Human editorial standards</span>
        </div>
      </div>
      <div className="hero-object" aria-label="Abstract archival composition">
        <div className="sun-disc" />
        <div className="record-sleeve">
          <span>Listening guide № 01</span>
          <strong>The Joker</strong>
          <small>historical recording · source notes inside</small>
        </div>
        <div className="archival-note">A quiet place<br />for difficult questions.</div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={item.label}>
          <b aria-hidden="true">/</b>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionHeading({ eyebrow, title, copy, link }: { eyebrow?: string; title: string; copy?: string; link?: { label: string; href: string } }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="kicker">{eyebrow}</p>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {link && <Link className="text-link" href={link.href}>{link.label} <span>→</span></Link>}
    </div>
  );
}

export function TopicCard({ topic, index }: { topic: Topic; index?: number }) {
  return (
    <Link className="topic-card" href={`/topics/${topic.slug}/`} style={{ "--topic": topic.tone } as React.CSSProperties}>
      <span className="card-number">{String((index ?? 0) + 1).padStart(2, "0")}</span>
      <p>{topic.eyebrow}</p>
      <h3>{topic.title}</h3>
      <span className="arrow">↗</span>
    </Link>
  );
}

export function LectureCard({ lecture }: { lecture: Lecture }) {
  return (
    <article className="content-card lecture-card">
      <div className="card-topline"><span>Lecture</span><span>{lecture.audio ? "Audio available" : lecture.transcript}</span></div>
      <h3><Link href={`/lectures/${lecture.slug}/`}>{lecture.title}</Link></h3>
      <p>{lecture.summary}</p>
      <div className="tag-row">{lecture.topics.slice(0, 2).map((slug) => <span key={slug}>{topicTitle(slug)}</span>)}</div>
      <Link className="text-link" href={`/lectures/${lecture.slug}/`}>Open source record →</Link>
    </article>
  );
}

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <article className="content-card">
      <p className="mini-label">{collection.kind}</p>
      <h3><Link href={`/collections/${collection.slug}/`}>{collection.title}</Link></h3>
      <p>{collection.description}</p>
      <Link className="text-link" href={`/collections/${collection.slug}/`}>View collection →</Link>
    </article>
  );
}

export function BookCard({ book, index }: { book: Book; index?: number }) {
  return (
    <article className="book-card">
      <Link className="book-cover" href={`/books/${book.slug}/`} aria-label={`View ${book.title}`}>
        <span>Alan Watts</span><strong>{book.title}</strong><small>Reader’s record {String((index ?? 0) + 1).padStart(2, "0")}</small>
      </Link>
      <div><h3><Link href={`/books/${book.slug}/`}>{book.title}</Link></h3><p>{book.overview}</p></div>
    </article>
  );
}

export function VerificationBadge({ status }: { status: Verification }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`verification ${key}`}>{status === "Verified source" ? "✓ " : ""}{status}</span>;
}

export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <article className={`quote-card ${quote.quotation ? "" : "quote-empty"}`}>
      <VerificationBadge status={quote.verification} />
      {quote.quotation ? <blockquote>“{quote.quotation}”</blockquote> : <p className="withheld">Quotation withheld pending exact source verification.</p>}
      <p className="quote-source">{quote.source}</p>
      <Link className="text-link" href={`/quotes/${quote.slug}/`}>Open verification record →</Link>
    </article>
  );
}

export function EssayCard({ essay }: { essay: Essay }) {
  return (
    <article className="essay-card">
      <p className="mini-label">{essay.label}</p>
      <h3><Link href={`/essays/${essay.slug}/`}>{essay.title}</Link></h3>
      <p>{essay.description}</p>
      <div className="byline"><span>{essay.author}</span><span>{essay.readingTime}</span></div>
    </article>
  );
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="video-card">
      <Link className="video-placeholder" href={`/videos/${video.slug}/`} aria-label={`Open ${video.title}`}>
        <span className="play">▶</span><small>Editorial video record</small>
      </Link>
      <p className="mini-label">Video guide</p>
      <h3><Link href={`/videos/${video.slug}/`}>{video.title}</Link></h3>
      <p>{video.description}</p>
    </article>
  );
}

export function DirectoryCard({ page }: { page: DirectoryPage }) {
  return (
    <article className="directory-card">
      <p className="mini-label">{page.status}</p>
      <h3><Link href={page.path}>{page.title}</Link></h3>
      <p>{page.description}</p>
      <Link className="text-link" href={page.path}>Open section →</Link>
    </article>
  );
}

export function ResourceCard({ resource }: { resource: ResourceCategory }) {
  return (
    <article className="resource-card">
      <VerificationBadge status={resource.verification} />
      <h3><Link href={`/resources/${resource.slug}/`}>{resource.title}</Link></h3>
      <p>{resource.description}</p>
      <div className="tag-row">{resource.examples.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
      <Link className="text-link" href={`/resources/${resource.slug}/`}>Open category →</Link>
    </article>
  );
}

export function SourceCitation({ children }: { children: ReactNode }) {
  return <aside className="source-citation"><span>Source note</span><p>{children}</p></aside>;
}

export function AuthenticityNotice() {
  return (
    <aside className="authenticity-notice">
      <span className="seal">A</span>
      <div><strong>Authentic historical audio</strong><p>This is a genuine recording of Alan Watts from historical lectures—not an AI-generated voice or synthetic recreation.</p></div>
    </aside>
  );
}

export function EmptyState({ title = "Nothing verified here—yet.", copy = "The absence is intentional. Records appear only when source evidence is ready." }: { title?: string; copy?: string }) {
  return <div className="empty-state"><span>○</span><h3>{title}</h3><p>{copy}</p></div>;
}

export function RelatedContent({ title = "Continue exploring", links }: { title?: string; links: { label: string; href: string; meta?: string }[] }) {
  return (
    <section className="related">
      <SectionHeading eyebrow="Related content" title={title} />
      <div className="related-list">
        {links.map((link) => <Link href={link.href} key={link.href}><span>{link.label}</span><small>{link.meta}</small><b>→</b></Link>)}
      </div>
    </section>
  );
}

export function NewsletterCTA() {
  return (
    <section className="newsletter-cta">
      <div><p className="kicker">New essays & listening paths</p><h2>Follow the questions, not the guru.</h2><p>Occasional notes on newly sourced lectures, verified quotations, and contemporary applications.</p></div>
      <div className="newsletter-actions"><Link className="button light" href="/videos/">Explore the video archive</Link><span>No synthetic Alan Watts voice. Ever.</span></div>
    </section>
  );
}

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <header className="page-intro">
      <p className="kicker">{eyebrow}</p><h1>{title}</h1><p className="lede">{description}</p>{children}
    </header>
  );
}

export function DefinitionList({ items }: { items: { term: string; detail: string }[] }) {
  return <dl className="definition-list">{items.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.detail}</dd></div>)}</dl>;
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replaceAll("<", "\\u003c") }}
    />
  );
}
