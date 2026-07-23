import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AuthenticityNotice,
  BookCard,
  Breadcrumbs,
  CollectionCard,
  DirectoryCard,
  DefinitionList,
  EmptyState,
  EssayCard,
  JsonLd,
  LectureCard,
  NewsletterCTA,
  PageIntro,
  QuoteCard,
  RelatedContent,
  ResourceCard,
  SectionHeading,
  SourceCitation,
  TopicCard,
  VerificationBadge,
  VideoCard,
} from "../components";
import {
  allRoutes,
  books,
  collections,
  directoryPages,
  essays,
  footerBusinessLinks,
  lectures,
  navGroups,
  quotes,
  resourceCategories,
  topics,
  videos,
  topicTitle,
} from "../content";
import { SearchInput } from "../search-client";

type Params = Promise<{ slug: string[] }>;

export function generateStaticParams() {
  return allRoutes
    .filter((route) => route !== "/")
    .map((route) => ({ slug: route.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const segments = (await params).slug;
  const path = segments.join("/");
  const itemSlug = segments[1];
  const item =
    topics.find((entry) => entry.slug === itemSlug) ??
    lectures.find((entry) => entry.slug === itemSlug) ??
    collections.find((entry) => entry.slug === itemSlug) ??
    books.find((entry) => entry.slug === itemSlug) ??
    quotes.find((entry) => entry.slug === itemSlug) ??
    essays.find((entry) => entry.slug === itemSlug) ??
    videos.find((entry) => entry.slug === itemSlug);
  const title = item?.title ?? sectionTitle(path);
  const description =
    ("description" in (item ?? {}) && String((item as { description?: string }).description)) ||
    ("summary" in (item ?? {}) && String((item as { summary?: string }).summary)) ||
    ("overview" in (item ?? {}) && String((item as { overview?: string }).overview)) ||
    `${title} in the source-grounded Alan Watts Wisdom archive.`;
  return {
    title,
    description,
    alternates: { canonical: `/${path}/` },
    openGraph: { title, description, type: segments[0] === "essays" ? "article" : "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function sectionTitle(path: string) {
  const names: Record<string, string> = {
    explore: "Explore",
    "start-here": "Start Here",
    "listening-paths": "Listening Paths",
    timeline: "Timeline",
    comparisons: "Comparisons",
    "interactive-experiences": "Interactive Experiences",
    library: "Library",
    topics: "Topics",
    lectures: "Lectures",
    collections: "Collections",
    books: "Books",
    quotes: "Quotes",
    transcripts: "Transcripts",
    resources: "Resources",
    essays: "Essays",
    media: "Media",
    newsletter: "Newsletter",
    podcasts: "Podcasts",
    videos: "Videos",
    shorts: "Shorts",
    community: "Community",
    discussions: "Discussions",
    "listening-club": "Listening Club",
    groups: "Groups",
    events: "Events",
    "member-essays": "Member Essays",
    tools: "Tools",
    "ask-the-archive": "Ask the Archive",
    "gpt-directory": "GPT Directory",
    "prompt-library": "Prompt Library",
    "quote-verifier": "Quote Verifier",
    "lecture-finder": "Lecture Finder",
    "archive-importer": "Archive Importer",
    "creator-studio": "Creator Studio",
    search: "Search",
    about: "About",
    "about/authenticity": "Authenticity",
    "about/editorial-standards": "Editorial Standards",
    "about/sources": "Sources",
    speaking: "Speaking",
    services: "Services",
    partners: "Partners",
    accelerator: "Accelerator",
    sponsor: "Sponsor",
    "licensing-information": "Licensing Information",
    contact: "Contact",
  };
  return names[path] ?? resourceCategories.find((item) => `resources/${item.slug}` === path)?.title ?? "Alan Watts Wisdom";
}

export default async function ArchiveRoute({ params }: { params: Params }) {
  const segments = (await params).slug;
  const [section, slug] = segments;
  if (section === "start-here" && !slug) return <StartHere />;
  if (section === "topics") return slug ? <TopicDetail slug={slug} /> : <TopicsIndex />;
  if (section === "lectures") return slug ? <LectureDetail slug={slug} /> : <LectureIndex />;
  if (section === "collections") return slug ? <CollectionDetail slug={slug} /> : <CollectionIndex />;
  if (section === "books") return slug ? <BookDetail slug={slug} /> : <BookIndex />;
  if (section === "quotes") return slug ? <QuoteDetail slug={slug} /> : <QuoteIndex />;
  if (section === "essays") return slug ? <EssayDetail slug={slug} /> : <EssayIndex />;
  if (section === "videos") return slug ? <VideoDetail slug={slug} /> : <VideoIndex />;
  if (section === "resources") return slug ? <ResourceDetail slug={slug} /> : <ResourceIndex />;
  if (section === "archive-importer" && !slug) return <ArchiveImporterPage />;
  if (section === "search" && !slug) return <SearchPage />;
  if (section === "about") {
    if (!slug) return <AboutPage />;
    if (slug === "authenticity") return <AuthenticityPage />;
    if (slug === "editorial-standards") return <EditorialStandardsPage />;
    if (slug === "sources") return <SourcesPage />;
  }
  const directoryPage = directoryPages.find((page) => page.path === `/${segments.join("/")}/`);
  if (directoryPage) return <DirectoryPageView page={directoryPage} />;
  notFound();
}

function Frame({ children, crumbs }: { children: React.ReactNode; crumbs: { label: string; href?: string }[] }) {
  return <main className="page shell"><Breadcrumbs items={crumbs} />{children}</main>;
}

function StartHere() {
  return (
    <Frame crumbs={[{ label: "Start Here" }]}>
      <PageIntro eyebrow="Orientation, not initiation" title="Start with Alan Watts" description="Three honest paths into the archive—no belief test, secret handshake, or promise to optimize your soul.">
        <div className="intro-note">New material is added as sources are verified. Missing metadata is shown as missing.</div>
      </PageIntro>
      <div className="path-grid">
        <article><span>01</span><h2>Listen first</h2><p>Begin with a historical recording, then use the source notes to keep the lecture and our commentary distinct.</p><Link className="button primary" href="/lectures/the-joker-part-1a/">Play The Joker — Part 1A</Link></article>
        <article><span>02</span><h2>Follow a question</h2><p>Choose the tension already following you around: control, identity, time, mortality, authority, or technology.</p><Link className="button primary" href="/topics/">Browse twelve topics</Link></article>
        <article><span>03</span><h2>Read with context</h2><p>Book records explain the archive’s editorial direction while bibliographic details are independently checked.</p><Link className="button primary" href="/books/">Open the books shelf</Link></article>
      </div>
      <section className="section compact">
        <SectionHeading eyebrow="Suggested first hour" title="A simple listening path" />
        <ol className="listening-path">
          <li><span>10 min</span><div><strong>Read the authenticity standard</strong><p>Know what labels mean before entering the catalog.</p></div><Link href="/about/authenticity/">Open →</Link></li>
          <li><span>27 min</span><div><strong>Listen to The Joker — Part 1A</strong><p>A supplied historical recording with the unresolved date shown openly.</p></div><Link href="/lectures/the-joker-part-1a/">Listen →</Link></li>
          <li><span>15 min</span><div><strong>Explore spiritual authority</strong><p>Compare the lecture record, essay source, and modern interpretation.</p></div><Link href="/topics/tricksters-gurus-spiritual-authority/">Explore →</Link></li>
        </ol>
      </section>
      <NewsletterCTA />
    </Frame>
  );
}

function TopicsIndex() {
  return (
    <Frame crumbs={[{ label: "Topics" }]}>
      <PageIntro eyebrow="Twelve ways in" title="Topics" description="Question-led paths through historical material and clearly labeled editorial interpretation." />
      <div className="topic-grid index-grid">{topics.map((topic, index) => <TopicCard topic={topic} index={index} key={topic.slug} />)}</div>
    </Frame>
  );
}

function TopicDetail({ slug }: { slug: string }) {
  const topic = topics.find((entry) => entry.slug === slug);
  if (!topic) notFound();
  const relatedLectures = lectures.filter((lecture) => lecture.topics.includes(slug));
  const relatedQuotes = quotes.filter((quote) => quote.topics.includes(slug));
  const relatedBooks = books.filter((book) => book.topics.includes(slug));
  const relatedEssays = essays.filter((essay) => essay.topics.includes(slug));
  const relatedVideos = videos.filter((video) => video.topics.includes(slug));
  return (
    <Frame crumbs={[{ label: "Topics", href: "/topics/" }, { label: topic.title }]}>
      <JsonLd data={{ "@type": "CollectionPage", name: topic.title, description: topic.description, about: topic.questions }} />
      <PageIntro eyebrow={topic.eyebrow} title={topic.title} description={topic.description}>
        {slug === "ai-technology-modern-life" && <div className="interpretation-label">Contemporary interpretation based on documented ideas—not speculation about what Alan Watts “would say.”</div>}
      </PageIntro>
      <div className="topic-layout">
        <aside className="question-panel"><p className="kicker">Key questions</p>{topic.questions.map((question) => <p key={question}>{question}</p>)}</aside>
        <div>
          <SectionHeading title="Related lectures" />
          {relatedLectures.length ? <div className="card-stack">{relatedLectures.map((lecture) => <LectureCard lecture={lecture} key={lecture.slug} />)}</div> : <EmptyState />}
        </div>
      </div>
      <section className="section compact">
        <SectionHeading title="Books & essays" />
        <div className="split-grid">
          <div>{relatedBooks.length ? relatedBooks.map((book, index) => <BookCard book={book} index={index} key={book.slug} />) : <EmptyState />}</div>
          <div>{relatedEssays.length ? relatedEssays.map((essay) => <EssayCard essay={essay} key={essay.slug} />) : <EmptyState />}</div>
        </div>
      </section>
      <section className="section compact">
        <SectionHeading title="Quotation records" />
        <div className="quote-grid light-quotes">{relatedQuotes.slice(0, 3).map((quote) => <QuoteCard quote={quote} key={quote.slug} />)}</div>
      </section>
      <RelatedContent links={[
        ...relatedVideos.slice(0, 2).map((video) => ({ label: video.title, href: `/videos/${video.slug}/`, meta: "Video guide" })),
        { label: "Suggested listening: The Joker — Part 1A", href: "/lectures/the-joker-part-1a/", meta: "Historical audio" },
      ]} />
    </Frame>
  );
}

function LectureIndex() {
  return (
    <Frame crumbs={[{ label: "Lectures" }]}>
      <PageIntro eyebrow="Historical audio & catalog records" title="Lectures" description="Known titles remain separate from dates, transcripts, and relationships that still require verification." />
      <div className="card-grid">{lectures.map((lecture) => <LectureCard lecture={lecture} key={lecture.slug} />)}</div>
    </Frame>
  );
}

function LectureDetail({ slug }: { slug: string }) {
  const lecture = lectures.find((entry) => entry.slug === slug);
  if (!lecture) notFound();
  const relatedBooks = books.filter((book) => book.topics.some((topic) => lecture.topics.includes(topic)));
  const relatedQuotes = quotes.filter((quote) => quote.lecture === slug);
  return (
    <Frame crumbs={[{ label: "Lectures", href: "/lectures/" }, { label: lecture.title }]}>
      <JsonLd data={{ "@type": "AudioObject", name: lecture.title, description: lecture.summary, creator: { "@type": "Person", name: lecture.speaker }, encodingFormat: "audio/mpeg", transcript: lecture.transcript }} />
      <PageIntro eyebrow="Lecture record" title={lecture.title} description={lecture.summary} />
      <DefinitionList items={[
        { term: "Speaker", detail: lecture.speaker },
        { term: "Series or collection", detail: lecture.series },
        { term: "Album", detail: lecture.album },
        { term: "Date", detail: lecture.date },
        { term: "Transcript status", detail: lecture.transcript },
      ]} />
      <div className="media-panel">
        <div className="media-label"><span>Historical audio</span><strong>{lecture.title}</strong></div>
        {lecture.audio ? <audio controls preload="metadata"><source src={lecture.audio} type="audio/mpeg" /></audio> : <EmptyState title="Audio not published on this record." copy="The catalog confirms a supplied source file, but playback remains unavailable while metadata and rights are reviewed." />}
      </div>
      <AuthenticityNotice />
      <div className="article-grid">
        <section><h2>Key ideas</h2><ul>{lecture.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul></section>
        <section><h2>Related topics</h2><ul>{lecture.topics.map((topic) => <li key={topic}><Link href={`/topics/${topic}/`}>{topicTitle(topic)}</Link></li>)}</ul></section>
      </div>
      <section className="section compact"><SectionHeading title="Verified quotations" />{relatedQuotes.length ? <div className="quote-grid light-quotes">{relatedQuotes.map((quote) => <QuoteCard quote={quote} key={quote.slug} />)}</div> : <EmptyState title="No quotations tied to this audio yet." />}</section>
      <SourceCitation><strong>{lecture.source}.</strong> {lecture.sourceNote}</SourceCitation>
      {lecture.audio ? <SourceCitation><strong>Playback file.</strong> Public audio is served from the supplied MP3 when practical; larger archive tracks use web-optimized MP3 derivatives so the site can publish reliably while preserving the source record separately.</SourceCitation> : null}
      <RelatedContent links={relatedBooks.slice(0, 3).map((book) => ({ label: book.title, href: `/books/${book.slug}/`, meta: "Related book" }))} />
    </Frame>
  );
}

function CollectionIndex() {
  return <Frame crumbs={[{ label: "Collections" }]}><PageIntro eyebrow="Curated listening & reading paths" title="Collections" description="Source-led groupings and editorial pathways are labeled separately." /><div className="card-grid">{collections.map((collection) => <CollectionCard collection={collection} key={collection.slug} />)}</div></Frame>;
}

function CollectionDetail({ slug }: { slug: string }) {
  const collection = collections.find((entry) => entry.slug === slug);
  if (!collection) notFound();
  return (
    <Frame crumbs={[{ label: "Collections", href: "/collections/" }, { label: collection.title }]}>
      <PageIntro eyebrow={collection.kind} title={collection.title} description={collection.description} />
      <ol className="collection-list">{collection.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>
      <SourceCitation>Collection relationships described as editorial are reading aids, not claims about the structure of an original lecture series or commercial audio release.</SourceCitation>
      <RelatedContent links={[{ label: "Browse all lectures", href: "/lectures/", meta: "Library" }, { label: "Explore all topics", href: "/topics/", meta: "Topic paths" }]} />
    </Frame>
  );
}

function BookIndex() {
  return <Frame crumbs={[{ label: "Books" }]}><PageIntro eyebrow="Reader’s shelf" title="Books" description="Six foundational records prepared for verified publication data, source notes, and linked listening." /><div className="books-grid">{books.map((book, index) => <BookCard book={book} index={index} key={book.slug} />)}</div></Frame>;
}

function BookDetail({ slug }: { slug: string }) {
  const book = books.find((entry) => entry.slug === slug);
  if (!book) notFound();
  const relatedLectures = lectures.filter((lecture) => lecture.topics.some((topic) => book.topics.includes(topic)));
  const relatedEssays = essays.filter((essay) => essay.topics.some((topic) => book.topics.includes(topic)));
  return (
    <Frame crumbs={[{ label: "Books", href: "/books/" }, { label: book.title }]}>
      <JsonLd data={{ "@type": "Book", name: book.title, author: { "@type": "Person", name: "Alan Watts" }, description: book.overview }} />
      <div className="book-hero">
        <div className="book-cover large"><span>Alan Watts</span><strong>{book.title}</strong><small>Bibliographic record</small></div>
        <PageIntro eyebrow="Book record" title={book.title} description={book.overview}>
          <p className="publication-details">{book.details}</p>
        </PageIntro>
      </div>
      <div className="article-grid three">
        <section><h2>Core ideas</h2><ul>{book.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul></section>
        <section><h2>Recommended audience</h2><p>{book.audience}</p></section>
        <section><h2>Common misunderstanding</h2><p>{book.misunderstanding}</p></section>
      </div>
      <section className="section compact"><SectionHeading title="Important passages & verified quotations" /><EmptyState title="Passage records await edition-level citations." copy="No quotation is published here until the exact edition and page can be checked." /></section>
      <RelatedContent links={[
        ...relatedLectures.slice(0, 2).map((lecture) => ({ label: lecture.title, href: `/lectures/${lecture.slug}/`, meta: "Lecture" })),
        ...relatedEssays.slice(0, 2).map((essay) => ({ label: essay.title, href: `/essays/${essay.slug}/`, meta: "Editorial essay" })),
      ]} />
    </Frame>
  );
}

function QuoteIndex() {
  return (
    <Frame crumbs={[{ label: "Quotes" }]}>
      <PageIntro eyebrow="Verification before virality" title="Quotations" description="Twelve research records. Three carry exact supplied-page citations; nine deliberately withhold wording until a source is confirmed." />
      <div className="legend">{(["Verified source", "Probable attribution", "Source not yet confirmed", "Commonly misattributed"] as const).map((status) => <VerificationBadge status={status} key={status} />)}</div>
      <div className="quote-grid light-quotes">{quotes.map((quote) => <QuoteCard quote={quote} key={quote.slug} />)}</div>
    </Frame>
  );
}

function QuoteDetail({ slug }: { slug: string }) {
  const quote = quotes.find((entry) => entry.slug === slug);
  if (!quote) notFound();
  return (
    <Frame crumbs={[{ label: "Quotes", href: "/quotes/" }, { label: quote.title }]}>
      <PageIntro eyebrow="Quotation record" title={quote.title} description="Exact words, status, source, context, and editorial interpretation are kept in separate fields." />
      <div className="quote-detail">
        <VerificationBadge status={quote.verification} />
        {quote.quotation ? <blockquote>“{quote.quotation}”</blockquote> : <EmptyState title="Exact quotation not published." copy="This research slot remains empty until an edition, page, recording, or timestamp is independently checked." />}
      </div>
      <DefinitionList items={[{ term: "Attribution", detail: "Alan Watts — subject to the verification status above" }, { term: "Original source", detail: quote.source }, { term: "Surrounding context", detail: quote.context }]} />
      <section className="prose-section"><h2>Brief interpretation</h2><p>{quote.interpretation}</p></section>
      <div className="quote-card-placeholder"><span>Shareable quote card placeholder</span><strong>{quote.quotation ?? "Source verification in progress"}</strong><small>Alan Watts Wisdom · source label always included</small></div>
      <RelatedContent links={quote.topics.map((topic) => ({ label: topicTitle(topic), href: `/topics/${topic}/`, meta: "Related topic" }))} />
    </Frame>
  );
}

function EssayIndex() {
  return <Frame crumbs={[{ label: "Essays" }]}><PageIntro eyebrow="Philosophical magazine" title="Essays" description="Original editorial work, explicit interpretation labels, and visible source references." /><div className="essay-grid">{essays.map((essay) => <EssayCard essay={essay} key={essay.slug} />)}</div></Frame>;
}

function EssayDetail({ slug }: { slug: string }) {
  const essay = essays.find((entry) => entry.slug === slug);
  if (!essay) notFound();
  return (
    <Frame crumbs={[{ label: "Essays", href: "/essays/" }, { label: essay.title }]}>
      <JsonLd data={{ "@type": "Article", headline: essay.title, description: essay.description, author: { "@type": "Person", name: essay.author }, datePublished: essay.date }} />
      <article className="longform">
        <PageIntro eyebrow={essay.label} title={essay.title} description={essay.description}>
          <div className="essay-meta"><span>{essay.author}</span><span>{essay.date}</span><span>{essay.readingTime} read</span></div>
        </PageIntro>
        <div className="interpretation-label">This essay is editorial interpretation. It is not a transcript, quotation, or claim about what Alan Watts “would say.”</div>
        <div className="prose">{essay.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <SourceCitation>{essay.sources.join(" · ")}</SourceCitation>
      </article>
      <RelatedContent links={essay.topics.map((topic) => ({ label: topicTitle(topic), href: `/topics/${topic}/`, meta: "Topic hub" }))} />
    </Frame>
  );
}

function VideoIndex() {
  return <Frame crumbs={[{ label: "Videos" }]}><PageIntro eyebrow="Listening companions & editorial video" title="Videos" description="Six demonstration records, each separating video commentary from its original lecture source." /><div className="video-grid">{videos.map((video) => <VideoCard video={video} key={video.slug} />)}</div></Frame>;
}

function VideoDetail({ slug }: { slug: string }) {
  const video = videos.find((entry) => entry.slug === slug);
  if (!video) notFound();
  const lecture = lectures.find((entry) => entry.slug === video.lecture);
  return (
    <Frame crumbs={[{ label: "Videos", href: "/videos/" }, { label: video.title }]}>
      <JsonLd data={{ "@type": "CreativeWork", name: video.title, description: video.description, isBasedOn: lecture?.title, creativeWorkStatus: "Editorial video record" }} />
      <PageIntro eyebrow="Video record" title={video.title} description={video.description} />
      <div className="video-stage"><span className="play">▶</span><p>Video placeholder</p><small>No synthetic voice or invented transcript</small></div>
      <AuthenticityNotice />
      <div className="article-grid">
        <section><h2>Transcript status</h2><p>{video.transcript}</p></section>
        <section><h2>Original lecture source</h2><p>{lecture ? <Link href={`/lectures/${lecture.slug}/`}>{lecture.title}</Link> : "Source record pending"}</p></section>
      </div>
      <section className="prose-section"><h2>Discussion questions</h2><ol>{video.questions.map((question) => <li key={question}>{question}</li>)}</ol></section>
      <RelatedContent links={video.topics.map((topic) => ({ label: topicTitle(topic), href: `/topics/${topic}/`, meta: "Related topic" }))} />
    </Frame>
  );
}

function ResourceIndex() {
  return (
    <Frame crumbs={[{ label: "Resources" }]}>
      <PageIntro eyebrow="Root resource hub" title="Resources" description="A structured directory for organizations, archives, books, lectures, communities, creators, tools, transcripts, libraries, and research. Entries are organized before they are overclaimed." />
      <div className="resource-map">
        {resourceCategories.map((resource) => <ResourceCard resource={resource} key={resource.slug} />)}
      </div>
      <SourceCitation>The resource hub is a taxonomy layer. Individual listings will be promoted from “source not yet confirmed” only when their URL, ownership, relevance, and source value are reviewed.</SourceCitation>
    </Frame>
  );
}

function ResourceDetail({ slug }: { slug: string }) {
  const resource = resourceCategories.find((entry) => entry.slug === slug);
  if (!resource) notFound();
  const relatedLinks = [
    ...(resource.slug === "books" ? books.slice(0, 4).map((book) => ({ label: book.title, href: `/books/${book.slug}/`, meta: "Book record" })) : []),
    ...(resource.slug === "lectures" ? lectures.slice(0, 4).map((lecture) => ({ label: lecture.title, href: `/lectures/${lecture.slug}/`, meta: "Lecture record" })) : []),
    ...(resource.slug === "transcripts" ? lectures.map((lecture) => ({ label: lecture.title, href: `/lectures/${lecture.slug}/`, meta: lecture.transcript })) : []),
    ...(resource.slug === "tools" || resource.slug === "gpts" ? navGroups.find((group) => group.label === "Tools")?.links.map((link) => ({ label: link.label, href: link.href, meta: "Tool concept" })) ?? [] : []),
    ...(resource.slug === "communities" || resource.slug === "events" ? navGroups.find((group) => group.label === "Community")?.links.map((link) => ({ label: link.label, href: link.href, meta: "Community layer" })) ?? [] : []),
  ];
  return (
    <Frame crumbs={[{ label: "Resources", href: "/resources/" }, { label: resource.title }]}>
      <PageIntro eyebrow="Resource category" title={resource.title} description={resource.description}>
        <div className="intro-note"><VerificationBadge status={resource.verification} /> Category listings are placeholders until each external source is reviewed.</div>
      </PageIntro>
      <div className="article-grid">
        <section><h2>What belongs here</h2><ul>{resource.examples.map((example) => <li key={example}>{example}</li>)}</ul></section>
        <section><h2>Publication standard</h2><p>Each listing should include title, URL, owner or publisher when known, category, relevance note, source value, verification status, and last-reviewed date.</p></section>
      </div>
      {relatedLinks.length ? <RelatedContent title="Current internal records" links={relatedLinks} /> : <EmptyState title="No external listings published yet." copy="This category is ready for curation, but public entries wait for source review." />}
    </Frame>
  );
}

function DirectoryPageView({ page }: { page: typeof directoryPages[number] }) {
  const childPages = directoryPages.filter((entry) => page.links?.some((link) => link.href === entry.path));
  const businessPage = footerBusinessLinks.some((link) => link.href === page.path);
  return (
    <Frame crumbs={[{ label: page.title }]}>
      <PageIntro eyebrow={page.eyebrow} title={page.title} description={page.description}>
        <div className="intro-note">{page.status}</div>
      </PageIntro>
      {page.links?.length ? (
        <div className="directory-grid">
          {page.links.map((link) => (
            <article className="directory-card" key={link.href}>
              <p className="mini-label">{link.meta ?? "Section"}</p>
              <h3><Link href={link.href}>{link.label}</Link></h3>
              <p>{childPages.find((entry) => entry.path === link.href)?.description ?? "Open this section to continue through the archive."}</p>
              <Link className="text-link" href={link.href}>Open →</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="directory-grid">
          {navGroups.map((group) => <DirectoryCard page={{ path: group.href, title: group.label, eyebrow: "Section", description: `Open the ${group.label.toLowerCase()} layer of the Alan Watts Wisdom archive.`, status: "Navigation layer" }} key={group.href} />)}
        </div>
      )}
      {businessPage && (
        <SourceCitation>Business pages are intentionally separated from the public archive navigation. The archive stays source-first; offers, partnerships, sponsorships, and licensing sit in the footer layer.</SourceCitation>
      )}
    </Frame>
  );
}

function ArchiveImporterPage() {
  return (
    <Frame crumbs={[{ label: "Tools", href: "/tools/" }, { label: "Archive Importer" }]}>
      <PageIntro
        eyebrow="URL to source record"
        title="Archive Importer"
        description="Fetch a public source URL, parse the page, and produce a review-ready JSON record for the archive without pretending automation equals verification."
      >
        <div className="intro-note">Local utility: <code>npm run import:url</code>. Imported records stay unconfirmed until reviewed.</div>
      </PageIntro>
      <div className="article-grid">
        <section>
          <h2>What it imports</h2>
          <ul>
            <li>Lecture and transcript pages</li>
            <li>Video, audio, book, article, and resource pages</li>
            <li>Page title, description, author, dates, canonical URL, headings, JSON-LD, media links, and transcript-like body text</li>
          </ul>
        </section>
        <section>
          <h2>Run it locally</h2>
          <pre><code>{`npm run import:url -- https://www.organism.earth/library/document/out-of-your-mind-1
npm run import:url -- https://www.organism.earth/library/document/out-of-your-mind-1 --type transcript --out data/imports/organism-earth
npm run import:url -- https://example.com/source-page --stdout`}</code></pre>
        </section>
      </div>
      <section className="section compact">
        <SectionHeading eyebrow="Output contract" title="Review-ready JSON fields" />
        <DefinitionList items={[
          { term: "source", detail: "Original URL, final URL, canonical URL, host, fetch status, content type, and timestamp." },
          { term: "asset", detail: "Inferred type, title, slug, description, author, publication date, and language." },
          { term: "verification", detail: "Always starts as Source not yet confirmed with human review notes." },
          { term: "media", detail: "Detected audio, video, and image links resolved to absolute URLs." },
          { term: "transcript", detail: "Draft text, excerpt, and word count when transcript-like body content is detected." },
          { term: "editorial", detail: "Recommended archive destination, empty topic map, and next review actions." },
        ]} />
      </section>
      <SourceCitation>
        The importer is intentionally conservative. It structures evidence from a public page; it does not grant rights, confirm attribution, verify transcript accuracy, or publish long excerpts without editorial review.
      </SourceCitation>
      <RelatedContent title="Related tools" links={[
        { label: "Lecture Finder", href: "/lecture-finder/", meta: "Find source candidates" },
        { label: "Quote Verifier", href: "/quote-verifier/", meta: "Check attribution" },
        { label: "Sources", href: "/about/sources/", meta: "Review standard" },
      ]} />
    </Frame>
  );
}

function SearchPage() {
  return <Frame crumbs={[{ label: "Search" }]}><PageIntro eyebrow="Static index · client-side filtering" title="Search the archive" description="Search topics, lectures, books, source records, essays, and videos without a database or runtime API." /><SearchInput /></Frame>;
}

function AboutPage() {
  return (
    <Frame crumbs={[{ label: "About" }]}>
      <PageIntro eyebrow="Why this archive exists" title="About Alan Watts Wisdom" description="A modern editorial library for people who want the recordings and ideas without the incense-machine theatrics." />
      <div className="prose large-prose">
        <p>The project brings authentic lectures, catalog records, books, verified quotations, essays, and video companions into one navigable system.</p>
        <p>It is independent, source-conscious, and deliberately unfinished. Historical records become richer as evidence improves. Contemporary pages remain visibly contemporary.</p>
      </div>
      <div className="card-grid">
        {[
          ["Authenticity", "How recordings, quotations, interpretations, corrections, and synthetic media are handled.", "/about/authenticity/", "Core policy"],
          ["Editorial standards", "The boundary between historical speech, source notes, and modern commentary.", "/about/editorial-standards/", "Core policy"],
          ["Sources", "What materials currently ground the archive and where verification is still open.", "/about/sources/", "Research ledger"],
        ].map(([title, copy, href, label]) => (
          <article className="content-card" key={href}>
            <p className="mini-label">{label}</p>
            <h3><Link href={href}>{title}</Link></h3>
            <p>{copy}</p>
            <Link className="text-link" href={href}>Read policy →</Link>
          </article>
        ))}
      </div>
    </Frame>
  );
}

function AuthenticityPage() {
  return (
    <Frame crumbs={[{ label: "About", href: "/about/" }, { label: "Authenticity" }]}>
      <PageIntro eyebrow="Core policy" title="Authenticity" description="A historical voice should not have to compete with its own synthetic ghost." />
      <AuthenticityNotice />
      <div className="standards-grid">
        <section><span>01</span><h2>How recordings are identified</h2><p>We inspect file provenance, embedded metadata, archive naming, related editions, and—when available—documented timestamps. Known facts and unresolved fields remain separate.</p></section>
        <section><span>02</span><h2>How quotations are verified</h2><p>A quotation earns “Verified source” only with a checkable book edition and page or a recording and timestamp. Popularity is not provenance.</p></section>
        <section><span>03</span><h2>How interpretations are labeled</h2><p>Modern applications are credited to their authors and labeled as editorial interpretation. They do not speak on Watts’ behalf.</p></section>
        <section><span>04</span><h2>How corrections are submitted</h2><p>Readers may submit a source, edition, page, timestamp, and concise correction. Corrections are reviewed against the record before publication.</p></section>
        <section><span>05</span><h2>How synthetic audio is handled</h2><p>Synthetic Alan Watts audio is not published as historical speech. If synthetic media is ever discussed, it is labeled clearly and kept separate from authentic recordings.</p></section>
      </div>
      <div className="correction-box"><p className="kicker">Submit a correction</p><h2>Bring the receipt, not merely the confidence.</h2><p>Include the page URL, proposed correction, exact source, edition or recording details, and a timestamp where relevant.</p><a className="button primary" href="mailto:editor@alanwattswisdom.org?subject=Source%20correction">Prepare an email</a></div>
    </Frame>
  );
}

function EditorialStandardsPage() {
  return (
    <Frame crumbs={[{ label: "About", href: "/about/" }, { label: "Editorial Standards" }]}>
      <PageIntro eyebrow="Signal over noise" title="Editorial standards" description="The archive preserves the difference between Alan Watts’ words, source metadata, and our own thinking." />
      <div className="standards-list">
        {[
          ["Authenticity first", "Historical audio is identified as historical. No synthetic voice is allowed to drift through the archive wearing a fake moustache."],
          ["No guru posturing", "Watts is presented as an invitation to inquiry—not a productivity coach, moral referee, or supernatural customer-support agent."],
          ["Context before virality", "Short quotations require a source. Records with missing evidence withhold the wording rather than laundering uncertainty through design."],
          ["Interpretation stays labeled", "Contemporary essays and videos are credited as editorial work and never framed as what Watts would say."],
          ["Corrections remain possible", "Every record is revisable when stronger source evidence appears. Confidence is not a substitute for provenance."],
          ["Copyright stays bounded", "The archive uses short, contextual excerpts and avoids reproducing long copyrighted passages or full transcripts without appropriate rights."],
        ].map(([title, copy], index) => <section key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{copy}</p></div></section>)}
      </div>
    </Frame>
  );
}

function SourcesPage() {
  return (
    <Frame crumbs={[{ label: "About", href: "/about/" }, { label: "Sources" }]}>
      <PageIntro eyebrow="Research ledger" title="Sources" description="The initial archive is grounded in supplied project files and connected working documents. Scope and gaps are stated plainly." />
      <div className="source-table">
        <div className="source-row header"><span>Source</span><span>Use in this release</span><span>Status</span></div>
        <div className="source-row"><strong>The Joker, six MP3 tracks</strong><span>Six playable audio records; inventory grounded in embedded metadata</span><VerificationBadge status="Verified source" /></div>
        <div className="source-row"><strong><a href="/documents/the-trickster-guru.pdf">The Trickster Guru, supplied PDF</a></strong><span>Served source document, essay source note, and three short quotation records with page citations</span><VerificationBadge status="Verified source" /></div>
        <div className="source-row"><strong>Alan Watts lecture archive, supplied ZIP</strong><span>Eight playable web-optimized lecture-title records; dates and original collection boundaries still withheld</span><VerificationBadge status="Probable attribution" /></div>
        <div className="source-row"><strong>Notion: Alan Watts Wisdom Archive</strong><span>Product direction and editorial design context</span><span className="editorial-label">Project source</span></div>
        <div className="source-row"><strong>Google Drive editorial files</strong><span>Earlier essay history and modern-application context</span><span className="editorial-label">Editorial source</span></div>
      </div>
      <SourceCitation>File modification dates and commercial audio-edition dates are not treated as original lecture dates. Bibliographic details marked “pending” must be verified before publication. Larger archive playback files are web-optimized derivatives of the supplied audio files.</SourceCitation>
    </Frame>
  );
}
