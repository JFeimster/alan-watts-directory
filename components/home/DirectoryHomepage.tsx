import Link from "next/link";
import { ContextDrawer } from "@/components/content/ContextDrawer";
import { Hero } from "@/components/home/Hero";
import { SectionHeader } from "@/components/home/SectionHeader";
import { getCreatorName } from "@/lib/gpts";
import { getHomepageData } from "@/lib/home";
import { getRouteRecord, getSiteConfig, type RouteStatus } from "@/lib/site";

type StatusLinkProps = {
  href: string;
  label: string;
  className?: string;
};

function StatusLink({ href, label, className }: StatusLinkProps) {
  const route = getRouteRecord(href);
  if (route.status === "planned" || route.status === "hidden") {
    return (
      <span className={className} aria-disabled="true">
        {label}
        <span className="route-status" data-status={route.status}>
          {route.status}
        </span>
      </span>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
      {route.status === "preview" ? (
        <span className="route-status" data-status="preview">preview</span>
      ) : null}
    </Link>
  );
}

function MetricValue({ value }: { value: number }) {
  return value > 0 ? <>{value.toLocaleString("en-US")}</> : <>INDEX BUILDING</>;
}

const contextEngine = [
  ["01", "FIND", "Discover lectures, books, topics, quotations, and related records."],
  ["02", "UNDERSTAND", "Return excerpts to the argument and setting from which they emerged."],
  ["03", "VERIFY", "Distinguish supported sources, uncertainty, and misattribution."],
  ["04", "CONNECT", "Reveal relationships among texts, recordings, topics, people, and modern questions."],
  ["05", "CREATE", "Produce source-aware citations, descriptions, discussion prompts, and creator assets."],
] as const;

const questions = [
  ["Why can’t I stop thinking?", "/topics/overthinking-anxiety-mental-noise"],
  ["What is the ego?", "/topics/ego-identity-separate-self"],
  ["Why are we afraid of death?", "/topics/death-mortality-rebirth"],
  ["What does letting go mean?", "/topics/letting-go-control-backwards-law"],
  ["Why does life feel like a race?", "/topics/time-present-insecurity"],
  ["What did Watts mean by play?", "/topics/life-play-work-purpose"],
  ["Where should a skeptic begin?", "/topics/tricksters-gurus-spiritual-authority"],
] as const;

const tools = [
  ["Quote Verifier", "/tools/quote-verifier", "RESEARCH PROTOTYPE", "Check wording, variants, source notes, and uncertainty without manufacturing certainty."],
  ["Lecture Finder", "/tools/lecture-finder", "PLANNED", "Find a talk from a topic, phrase, collection, or available metadata."],
  ["Misquote Graveyard", "/tools/misquote-graveyard", "PLANNED", "Track popular wording that lacks a supported source or has been altered."],
  ["Transcript Studio", "/tools/transcript-studio", "PLANNED", "Review transcript segments, timestamps, and correction notes."],
  ["Ask the Archive", "/tools/ask-the-archive", "RESEARCH PROTOTYPE", "A future source-aware question interface with citations and uncertainty labels."],
  ["Citation Builder", "/tools/citation-builder", "PLANNED", "Format source-conscious references for lectures, books, pages, and timestamps."],
  ["Creator Studio", "/tools/creator-studio", "PLANNED", "Build descriptions, prompts, and assets from records with visible provenance."],
  ["Authenticity Lab", "/tools/authenticity-lab", "RESEARCH PROTOTYPE", "Compare historical provenance, synthetic media disclosures, and review signals."],
] as const;

const modernApplications = [
  ["AI AND THE CONSTRUCTED SELF", "A contemporary editorial lens on identity, representation, and systems that speak in borrowed voices."],
  ["AGENTIC AI AND CONTROL", "A modern question about control, delegation, uncertainty, and the desire for predictable outcomes."],
  ["SYNTHETIC VOICES + HISTORICAL INTEGRITY", "A provenance problem: how to distinguish authentic recordings from generated performance."],
  ["ATTENTION ECONOMIES + MENTAL NOISE", "A present-day reading of distraction, repetition, and commercial systems built around attention."],
  ["PRODUCTIVITY IDENTITY + LIFE AS PLAY", "An editorial comparison between output-based identity and less instrumental ways of living."],
  ["THE TRICKSTER IN DIGITAL CULTURE", "A contemporary study of authority, persona, irony, performance, and credibility online."],
] as const;

const contributions = [
  ["Submit a correction", "/corrections", "PREVIEW"],
  ["Submit a source", "/contact", "CONNECTION PENDING"],
  ["Suggest a GPT", "/gpts/submit", "PREVIEW"],
  ["Report a GPT", "/gpts/report", "PREVIEW"],
  ["Contribute transcript review", "/contact", "CONNECTION PENDING"],
  ["Suggest a resource", "/contact", "CONNECTION PENDING"],
  ["Join a listening discussion", "/discussions", "PLANNED"],
] as const;

export function DirectoryHomepage() {
  const site = getSiteConfig();
  const data = getHomepageData();
  const firstFeaturedGpt = data.featuredGpts[0] ?? null;

  return (
    <main className="home-page">
      <Hero site={site} />

      <section className="status-console" aria-labelledby="directory-status-title">
        <div className="status-console__header">
          <div>
            <p className="system-label">BUILD-TIME REPOSITORY READOUT</p>
            <h2 id="directory-status-title">DIRECTORY STATUS CONSOLE</h2>
          </div>
          <span className="status-console__live">
            <span aria-hidden="true" />
            STATIC DATA READ
          </span>
        </div>
        <div className="status-console__grid">
          {data.metrics.map((metric, index) => (
            <div className="status-metric" key={metric.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong><MetricValue value={metric.value} /></strong>
              <small>{metric.label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="context-engine-title">
        <SectionHeader
          number="01"
          eyebrow="DISCOVERY METHOD"
          title="THE CONTEXT ENGINE"
          copy="Five moves turn a loose search into a source-conscious path."
        />
        <div className="context-engine" id="context-engine-title">
          {contextEngine.map(([number, title, copy]) => (
            <article className="context-engine__module" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="authenticity-strip" aria-labelledby="authenticity-title">
        <div className="authenticity-strip__signal" aria-hidden="true">!</div>
        <div>
          <p className="system-label">AUTHENTICITY CHECK</p>
          <h2 id="authenticity-title">
            REAL RECORDING?
            <span>SOURCE LOCATED?</span>
            CONTEXT PRESERVED?
          </h2>
        </div>
        <div className="authenticity-strip__copy">
          <p>
            Historical recordings must be distinguished from AI-generated or
            synthetic recreations. Sources, review status, and editorial
            interpretation are labeled wherever possible.
          </p>
          <nav aria-label="Authenticity standards">
            <StatusLink href="/about/authenticity" label="AUTHENTICITY" />
            <StatusLink href="/about/editorial-standards" label="EDITORIAL STANDARDS" />
            <StatusLink href="/about/sources-and-attribution" label="SOURCES + ATTRIBUTION" />
            <StatusLink href="/about/ai-policy" label="AI POLICY" />
            <StatusLink href="/corrections" label="CORRECTIONS" />
          </nav>
        </div>
      </section>

      <section className="home-section" aria-labelledby="start-here-title">
        <SectionHeader
          number="02"
          eyebrow="ORIENTATION"
          title="START HERE"
          copy="Six editorial guides for entering the index without mistaking confidence for provenance."
        />
        <div className="number-card-grid" id="start-here-title">
          {data.startHere.map((record) => (
            <article className="number-card" key={record.slug}>
              <div className="number-card__top">
                <span>{String(record.order).padStart(2, "0")}</span>
                <span className="route-status" data-status={record.status}>{record.status}</span>
              </div>
              <h3>{record.title}</h3>
              <p>{record.description}</p>
              <Link href={`/start-here/${record.slug}`}>{record.cta} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--ink" aria-labelledby="questions-title">
        <SectionHeader
          number="03"
          eyebrow="DISCOVER BY QUESTION"
          title="BEGIN WITH THE QUESTION YOU ACTUALLY HAVE."
          copy="These paths organize records for inquiry and education. They do not provide mental-health treatment."
          inverted
        />
        <div className="question-grid" id="questions-title">
          {questions.map(([question, href], index) => (
            <Link href={href} className="question-card" key={question}>
              <span>Q{String(index + 1).padStart(2, "0")}</span>
              <h3>{question}</h3>
              <small>OPEN TOPIC PATH →</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="listening-title">
        <SectionHeader
          number="04"
          eyebrow="AUDIO INDEX"
          title="FEATURED LISTENING"
          copy="A recording appears here only when the repository contains an approved source record."
        />
        <div className="audio-console" id="listening-title">
          <div className="audio-console__rail">
            <span>REC</span>
            <span>TRX</span>
            <span>SRC</span>
            <span>AUTH</span>
          </div>
          <div className="audio-console__body">
            {data.listeningRecordCount === 0 ? (
              <>
                <p className="system-label">FEATURED LISTENING</p>
                <h3>STATUS: SOURCE SELECTION PENDING</h3>
                <p>
                  No lecture record with approved audio is present in the repository.
                  No play control is displayed.
                </p>
              </>
            ) : (
              <>
                <p className="system-label">INDEX AVAILABLE</p>
                <h3>{data.listeningRecordCount} LECTURE RECORDS READY FOR EDITORIAL SELECTION</h3>
              </>
            )}
          </div>
          <div className="audio-console__meter" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => <span key={index} />)}
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="topics-title">
        <SectionHeader
          number="05"
          eyebrow="MODULAR TAXONOMY"
          title="TOPIC EXPLORER"
          copy="Editorial topic records connect future lectures, books, quotes, people, and modern questions."
        />
        <div className="topic-matrix" id="topics-title">
          {data.topics.map((topic, index) => (
            <Link className="topic-module" href={`/topics/${topic.slug}`} key={topic.slug}>
              <div>
                <span>T{String(index + 1).padStart(2, "0")}</span>
                {topic.label ? <small>{topic.label}</small> : null}
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <b>OPEN INDEX →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section quote-context-section" aria-labelledby="quotes-context-title">
        <SectionHeader
          number="06"
          eyebrow="QUOTATION CONTROL"
          title="A QUOTE IS NOT THE WHOLE ARGUMENT."
          copy="A sentence becomes clearer when returned to the lecture, book, conversation, or argument from which it emerged."
        />
        <div className="quote-context-console" id="quotes-context-title">
          <div className="quote-context-console__labels">
            <span>DOCUMENTED WORDING</span>
            <span>POPULAR VARIANT</span>
            <span>SOURCE</span>
            <span>LOCATION</span>
            <span>VERIFICATION</span>
            <span>CONTEXT EXCERPT</span>
            <span>RELATED TOPICS</span>
          </div>
          <div className="empty-state empty-state--quote">
            <strong>NO VERIFIED QUOTE RECORD SELECTED</strong>
            <p>
              The quote dataset is empty. This section will not invent wording,
              sources, pages, timestamps, or verification states.
            </p>
          </div>
          <nav className="inline-index-links" aria-label="Quote directories">
            <StatusLink href="/quotes" label="ALL QUOTES" />
            <StatusLink href="/quotes/source-verified" label="SOURCE VERIFIED" />
            <StatusLink href="/quotes/misattributed" label="MISATTRIBUTED" />
            <StatusLink href="/misquotes" label="MISQUOTES" />
            <StatusLink href="/tools/quote-verifier" label="QUOTE VERIFIER" />
          </nav>
        </div>
      </section>

      <section className="home-section home-section--grid-paper" aria-labelledby="library-title">
        <SectionHeader
          number="07"
          eyebrow="ARCHIVAL INDEX"
          title="LIBRARY DIRECTORY"
          copy="Every count is read from the repository. Empty collections remain visible as work to be done."
        />
        <div className="library-directory" id="library-title">
          {data.libraryModules.map((module, index) => (
            <article className="library-module" key={module.href}>
              <div className="library-module__meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="route-status" data-status={module.status}>{module.status}</span>
              </div>
              <strong className="library-module__count"><MetricValue value={module.count} /></strong>
              <h3>{module.label}</h3>
              <p>{module.purpose}</p>
              <StatusLink href={module.href} label="OPEN DIRECTORY →" className="library-module__link" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-section gpt-feature" aria-labelledby="gpt-directory-title">
        <SectionHeader
          number="08"
          eyebrow="RESEARCH EVALUATION CONSOLE"
          title="GPT DIRECTORY"
          copy="Imported listings are indexed, classified, and disclosed without treating their public claims as editorial findings."
        />

        <div className="gpt-metric-strip" id="gpt-directory-title">
          {[
            ["TOTAL LISTINGS", data.gptMetrics.total],
            ["CLASSIFIED", data.gptMetrics.classified],
            ["PENDING", data.gptMetrics.pending],
            ["SOURCE-GROUNDED", data.gptMetrics.sourceGrounded],
            ["FIRST-PERSON SIMULATIONS", data.gptMetrics.simulations],
            ["CREATOR-VERIFIED", data.gptMetrics.creatorVerified],
            ["UNAVAILABLE", data.gptMetrics.unavailable],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{Number(value).toLocaleString("en-US")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="gpt-profile-grid">
          {data.featuredGpts.map((record, index) => {
            const sourceClaim = record.sourceGroundingStatus === "claimed-in-listing";
            const firstPerson = Boolean(record.firstPersonSimulation);
            const sourceHref = record.canonicalUrl ?? record.candidateUrl ?? null;

            return (
              <article className="gpt-profile-card" key={record.slug}>
                <div className="gpt-profile-card__index">
                  <span>GPT-{String(index + 1).padStart(3, "0")}</span>
                  <span className="route-status" data-status={record.availability === "available" ? "live" : "preview"}>
                    {record.availability ?? "unknown"}
                  </span>
                </div>
                <h3>{record.name}</h3>
                <p className="gpt-profile-card__creator">
                  CREATOR: {getCreatorName(record)}
                </p>
                <p>
                  {record.description ?? "Description pending editorial review."}
                </p>
                <dl>
                  <div>
                    <dt>USAGE SNAPSHOT</dt>
                    <dd>{record.usersDisplay ?? "NOT AVAILABLE"}</dd>
                  </div>
                  <div>
                    <dt>SOURCE GROUNDING</dt>
                    <dd>{sourceClaim ? "CLAIMED IN LISTING" : (record.sourceGroundingStatus ?? "NOT EVALUATED").replaceAll("-", " ")}</dd>
                  </div>
                  <div>
                    <dt>DIRECTORY REVIEW</dt>
                    <dd>{(record.reviewStatus ?? "unreviewed").replaceAll("-", " ")}</dd>
                  </div>
                </dl>
                <div className="gpt-profile-card__flags">
                  {sourceClaim ? <span data-state="claim">LISTING CLAIM — NOT VERIFIED</span> : null}
                  {firstPerson ? <span data-state="warning">FIRST-PERSON SIMULATION</span> : null}
                  {!sourceClaim && !firstPerson ? <span>CLASSIFICATION RECORD</span> : null}
                </div>
                <div className="gpt-profile-card__actions">
                  <Link href={`/gpts/${record.slug}`}>OPEN PROFILE →</Link>
                  {index === 0 && firstFeaturedGpt ? (
                    <ContextDrawer
                      context={{
                        title: `${firstFeaturedGpt.name} directory record`,
                        source: sourceHref ? "Imported public GPT listing" : "Imported directory record",
                        sourceHref,
                        verificationStatus:
                          "Listing imported; creator and source claims are not editorially verified.",
                        relatedTopic: "AI, technology, and modern life",
                        surroundingContext:
                          "This profile is part of a third-party GPT directory. Public listing language, creator information, usage snapshots, and category flags are stored separately from editorial review.",
                        whyItMatters:
                          "A source-grounding claim in a product listing is not the same as evidence that outputs accurately represent Alan Watts or cite historical sources.",
                        relatedContent: [
                          { label: "Open full GPT profile", href: `/gpts/${firstFeaturedGpt.slug}` },
                          { label: "Read GPT methodology", href: "/gpts/methodology" },
                          { label: "Review AI policy", href: "/about/ai-policy" },
                        ],
                        citation: `${firstFeaturedGpt.name}. Public GPT listing indexed by ${site.name}. Imported listing claims remain unverified unless explicitly documented.`,
                        reportHref: "/gpts/report",
                      }}
                    />
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <p className="directory-disclaimer">
          Directory inclusion does not imply endorsement, source accuracy,
          creator verification, affiliation with OpenAI, or affiliation with the
          Alan Watts estate.
        </p>
        <div className="section-actions">
          <Link className="button button--ink" href="/gpts">OPEN DIRECTORY</Link>
          <Link className="button button--paper" href="/gpts/compare">COMPARE GPTS</Link>
          <Link className="button button--paper" href="/gpts/methodology">VIEW METHODOLOGY</Link>
        </div>
      </section>

      <section className="home-section home-section--ink" aria-labelledby="tools-title">
        <SectionHeader
          number="09"
          eyebrow="UTILITY ROADMAP"
          title="FEATURED TOOLS"
          copy="Status labels describe what exists now—not what a concept might become."
          inverted
        />
        <div className="tool-grid" id="tools-title">
          {tools.map(([title, href, status, copy], index) => {
            const route = getRouteRecord(href);
            const inner = (
              <>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{status}</b>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <small>{route.status === "planned" ? "ROUTE NOT PUBLIC" : "OPEN TOOL →"}</small>
              </>
            );

            return route.status === "planned" ? (
              <article className="tool-card" aria-disabled="true" key={title}>{inner}</article>
            ) : (
              <Link className="tool-card" href={href} key={title}>{inner}</Link>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="modern-title">
        <SectionHeader
          number="10"
          eyebrow="CONTEMPORARY EDITORIAL INTERPRETATION"
          title="MODERN APPLICATIONS"
          copy="These modules ask current questions through an editorial lens. They are not statements Alan Watts made about present-day technology."
        />
        <div className="modern-grid" id="modern-title">
          {modernApplications.map(([title, copy], index) => (
            <article key={title}>
              <span>M{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>CONTEMPORARY EDITORIAL INTERPRETATION</small>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section media-index" aria-labelledby="media-title">
        <SectionHeader
          number="11"
          eyebrow="PUBLISHING LAYER"
          title="MEDIA"
          copy="Only repository-backed publication records are counted. No dates, reach, or engagement metrics are fabricated."
        />
        <div className="media-grid" id="media-title">
          {[
            ["ESSAYS", "/essays", data.mediaCounts.essays],
            ["VIDEOS", "/videos", data.mediaCounts.videos],
            ["SHORTS", "/shorts", data.mediaCounts.shorts],
            ["PLAYLISTS", "/playlists", data.mediaCounts.playlists],
            ["NEWSLETTER", "/newsletter", data.mediaCounts.newsletters],
            ["PODCASTS", "/podcasts", data.mediaCounts.podcasts],
          ].map(([label, href, count], index) => (
            <article key={String(label)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <strong><MetricValue value={Number(count)} /></strong>
              <StatusLink href={String(href)} label="OPEN INDEX →" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-section contribution-section" aria-labelledby="contribution-title">
        <SectionHeader
          number="12"
          eyebrow="COMMUNITY + CONTRIBUTION"
          title="IMPROVE THE INDEX."
          copy="Corrections, sources, reviews, and reports matter more than passive engagement counts."
        />
        <div className="contribution-grid" id="contribution-title">
          {contributions.map(([label, href, status], index) => {
            const route = getRouteRecord(href);
            const content = (
              <>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                <small>{status}</small>
              </>
            );
            return route.status === "planned" ? (
              <article aria-disabled="true" key={label}>{content}</article>
            ) : (
              <Link href={href} key={label}>{content}</Link>
            );
          })}
        </div>
      </section>

      <section className="newsletter-block" aria-labelledby="newsletter-title">
        <div>
          <p className="system-label">OCCASIONAL SOURCE NOTES</p>
          <h2 id="newsletter-title">
            A LISTENING NOTE.
            <span>NOT ANOTHER FEED.</span>
          </h2>
        </div>
        <div>
          <p>
            Occasional source notes, lecture discoveries, contextualized quotes,
            essays, and questions worth carrying into the week.
          </p>
          {site.newsletter.endpoint ? (
            <form action={site.newsletter.endpoint} method="post">
              <label>
                <span className="sr-only">Email address</span>
                <input type="email" name="email" autoComplete="email" required placeholder="EMAIL ADDRESS" />
              </label>
              <button type="submit">SUBSCRIBE</button>
            </form>
          ) : (
            <div className="newsletter-status">
              STATUS: NEWSLETTER CONNECTION PENDING
            </div>
          )}
        </div>
      </section>

      <section className="independent-notice" aria-labelledby="independent-title">
        <span aria-hidden="true">AW</span>
        <div>
          <p className="system-label">INDEPENDENT PROJECT NOTICE</p>
          <h2 id="independent-title">NO OFFICIAL AFFILIATION CLAIMED.</h2>
          <p>
            {site.name} is an independent editorial, research, and discovery
            project. It is not the official Alan Watts estate website and does
            not claim affiliation with the Alan Watts Organization, OpenAI, or
            individual third-party GPT creators unless explicitly documented.
          </p>
        </div>
      </section>
    </main>
  );
}
