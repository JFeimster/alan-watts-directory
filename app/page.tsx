import Link from "next/link";
import {
  AuthenticityNotice,
  BookCard,
  EmptyState,
  EssayCard,
  Hero,
  LectureCard,
  NewsletterCTA,
  QuoteCard,
  SectionHeading,
  TopicCard,
  VideoCard,
} from "./components";
import { books, essays, lectures, quotes, topics, videos } from "./content";

export default function Home() {
  const verifiedQuotes = quotes.filter((quote) => quote.verification === "Verified source");
  return (
    <main>
      <Hero />

      <section className="start-strip">
        <div className="shell start-grid">
          <div><span className="big-number">01</span><p className="kicker">New to Watts?</p><h2>Begin with a question, not a quotation.</h2></div>
          <p>Choose a listening path that keeps lectures, books, and editorial interpretation visibly distinct. The point is orientation—not instant enlightenment before lunch.</p>
          <Link className="button ink" href="/start-here/">Open Start Here →</Link>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Featured recording" title="The Joker — Part 1A" copy="A genuine historical recording from the supplied six-part audio set, presented with honest gaps in its metadata." link={{ label: "Open the lecture record", href: "/lectures/the-joker-part-1a/" }} />
        <div className="featured-audio">
          <div className="audio-art"><span>AW / 01</span><strong>The<br />Joker</strong><small>Part 1A · historical recording</small></div>
          <div className="audio-copy">
            <p className="mini-label">Alan Watts · The Joker audio edition</p>
            <h3>Listen with the source notes open.</h3>
            <p>The file metadata identifies the artist, album, and track. The original lecture date has not yet been established, so the archive does not pretend otherwise.</p>
            <audio controls preload="metadata"><source src="/audio/the-joker/1a.mp3" type="audio/mpeg" />Your browser does not support audio playback.</audio>
            <AuthenticityNotice />
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Ways into the work" title="Explore by topic" copy="Twelve editorial paths connect recordings, books, essays, and open research questions." link={{ label: "View all topics", href: "/topics/" }} />
        <div className="topic-grid">{topics.slice(0, 6).map((topic, index) => <TopicCard topic={topic} index={index} key={topic.slug} />)}</div>
      </section>

      <section className="section dark-section">
        <div className="shell">
          <SectionHeading eyebrow="Source desk" title="Verified quotations, with receipts" copy="Short excerpts appear only when an exact page or recording reference is available." link={{ label: "Visit the quote index", href: "/quotes/" }} />
          {verifiedQuotes.length ? <div className="quote-grid">{verifiedQuotes.map((quote) => <QuoteCard quote={quote} key={quote.slug} />)}</div> : <EmptyState />}
        </div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="New editorial work" title="Latest essays" copy="Contemporary interpretations are labeled plainly and never passed off as Alan Watts’ own words." link={{ label: "Read all essays", href: "/essays/" }} />
        <div className="essay-grid">{essays.slice(0, 3).map((essay) => <EssayCard essay={essay} key={essay.slug} />)}</div>
      </section>

      <section className="section library-band">
        <div className="shell">
          <SectionHeading eyebrow="Browse the shelves" title="Explore the library" copy="Catalog records designed to become richer as source work is completed." />
          <div className="library-columns">
            <div><h3>Lectures</h3>{lectures.slice(0, 3).map((lecture) => <LectureCard lecture={lecture} key={lecture.slug} />)}<Link className="button secondary" href="/lectures/">All lectures</Link></div>
            <div><h3>Books</h3>{books.slice(0, 3).map((book, index) => <BookCard book={book} index={index} key={book.slug} />)}<Link className="button secondary" href="/books/">All books</Link></div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Modern applications" title="Documented ideas, contemporary questions" copy="These pages apply themes found in identifiable sources. They do not speculate about what Alan Watts “would say.”" link={{ label: "See the editorial standard", href: "/about/editorial-standards/" }} />
        <div className="video-grid">{videos.slice(3).map((video) => <VideoCard video={video} key={video.slug} />)}</div>
      </section>

      <section className="shell authenticity-band">
        <span className="large-seal">A</span>
        <div><p className="kicker">The authenticity promise</p><h2>Historical voice stays historical.</h2><p>Real recordings are identified. Synthetic audio is never passed off as Alan Watts. Quotes carry verification status, and modern interpretations carry their own label.</p></div>
        <Link className="button secondary" href="/about/authenticity/">How verification works →</Link>
      </section>

      <div className="shell"><NewsletterCTA /></div>
    </main>
  );
}
