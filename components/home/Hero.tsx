import Link from "next/link";
import type { SiteConfig } from "@/lib/site";

type HeroProps = {
  site: Pick<SiteConfig, "tagline">;
};

export function Hero({ site }: HeroProps) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__copy">
        <p className="hero-eyebrow">INDEPENDENT ALAN WATTS RESEARCH + DISCOVERY</p>
        <h1 id="home-title">
          FIND THE SOURCE.
          <span>OPEN THE CONTEXT.</span>
        </h1>
        <p className="home-hero__lead">
          Explore Alan Watts through lectures, books, contextualized quotations,
          transcripts, ideas, research tools, and modern questions—without
          reducing his work to slogans or synthetic imitation.
        </p>
        <div className="hero-actions">
          <Link className="button button--acid" href="/start-here">START HERE</Link>
          <Link className="button button--paper" href="/lectures">EXPLORE THE LIBRARY</Link>
        </div>
        <div className="hero-utility-links">
          <Link href="/gpts">OPEN GPT DIRECTORY →</Link>
          <Link href="/about/authenticity">VIEW AUTHENTICITY STANDARDS →</Link>
        </div>
        <p className="hero-tagline">{site.tagline}</p>
      </div>

      <div className="context-map" aria-label="Source relationship map">
        <div className="context-map__status">
          <span>SOURCE 001</span>
          <strong>STATUS: CONTEXT REQUIRED</strong>
        </div>
        <ol className="context-map__chain">
          <li>
            <span>01</span>
            <strong>RECORDING</strong>
            <small>PROVENANCE + AUDIO SOURCE</small>
          </li>
          <li>
            <span>02</span>
            <strong>TRANSCRIPT</strong>
            <small>WORDING + REVIEW STATE</small>
          </li>
          <li>
            <span>03</span>
            <strong>QUOTATION</strong>
            <small>EXCERPT + LOCATION</small>
          </li>
          <li>
            <span>04</span>
            <strong>INTERPRETATION</strong>
            <small>EDITORIAL, NOT HISTORICAL SPEECH</small>
          </li>
        </ol>
        <div className="context-map__legend" aria-hidden="true">
          <span>LECTURE</span>
          <span>TRANSCRIPT</span>
          <span>QUOTE</span>
          <span>CONTEXT</span>
        </div>
      </div>
    </section>
  );
}
