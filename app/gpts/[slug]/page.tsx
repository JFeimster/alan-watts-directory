import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllGptSlugs,
  getAvailability,
  getCreatorName,
  getGptBySlug,
  getImagePath,
  getSafeLaunchUrl,
  getSimilarGpts,
  getUsageDisplay,
} from "@/lib/gpts";
import { GptAvatar } from "@/components/gpts/GptAvatar";
import { GptPromptList } from "@/components/gpts/GptPromptList";
import { VerificationBadge } from "@/components/gpts/VerificationBadge";
import styles from "@/components/gpts/gpts.module.css";

export function generateStaticParams() {
  return getAllGptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getGptBySlug(slug);

  if (!record) return { title: "GPT not found" };

  return {
    title: `${record.name} — GPT Directory`,
    description:
      record.description ??
      `Directory profile for ${record.name}, created by ${getCreatorName(record)}.`,
  };
}

function displayValue(value: string | null | undefined): string {
  if (!value || value === "unknown") return "Pending review";
  return value.replaceAll("-", " ");
}

export default async function GptProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getGptBySlug(slug);
  if (!record) notFound();

  const creator = getCreatorName(record);
  const launchUrl = getSafeLaunchUrl(record);
  const availability = getAvailability(record);
  const usage = getUsageDisplay(record);
  const reviewStatus = record.review?.status ?? "unreviewed";
  const categories = record.categories ?? [];
  const similar = getSimilarGpts(record);
  const imagePath = getImagePath(record);
  const sourceGrounding =
    record.knowledge?.sourceGroundingStatus ?? "not-evaluated";
  const languages =
    (record.supportedLanguages ?? []).join(", ") ||
    record.listingLanguage ||
    "Unknown";

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/gpts/">GPT Directory</Link>
        <span aria-hidden="true">/</span>
        <span>{record.name}</span>
      </nav>

      <header className={styles.profileHero}>
        <GptAvatar name={record.name} imagePath={imagePath} />
        <div>
          <p className={styles.eyebrow}>GPT profile · imported and reviewed separately</p>
          <h1>{record.name}</h1>
          <p className={styles.profileLead}>
            {record.description ?? "Description pending editorial review."}
          </p>

          <div className={styles.actions}>
            {launchUrl ? (
              <a
                className={styles.primaryAction}
                href={launchUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open validated GPT ↗
              </a>
            ) : (
              <span className={styles.disabledAction}>
                Public link validation pending
              </span>
            )}
            <Link className={styles.secondaryAction} href="/gpts/compare/">
              Compare GPTs
            </Link>
            <Link className={styles.secondaryAction} href="/gpts/report/">
              Report listing
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.statStrip} aria-label="Listing status">
        <div className={styles.stat}>
          <span>Creator</span>
          <strong>{creator}</strong>
        </div>
        <div className={styles.stat}>
          <span>Usage snapshot</span>
          <strong>{usage ?? "Not available"}</strong>
        </div>
        <div className={styles.stat}>
          <span>Availability</span>
          <strong>{displayValue(availability)}</strong>
        </div>
        <div className={styles.stat}>
          <span>Directory review</span>
          <strong>
            <VerificationBadge status={reviewStatus} />
          </strong>
        </div>
      </section>

      <div className={styles.detailGrid}>
        <section>
          <div className={styles.panel}>
            <h2>Conversation starters</h2>
            <GptPromptList
              items={record.conversationStarters ?? []}
              emptyText="Conversation starters have not yet been captured from the public listing or supplied by the creator."
            />
          </div>

          <div className={styles.panel}>
            <h2>Prompt examples</h2>
            <GptPromptList
              items={record.promptExamples ?? []}
              emptyText="Directory-tested prompt examples have not yet been added."
            />
          </div>

          <div className={styles.panel}>
            <h2>Observed capabilities</h2>
            <dl className={styles.definitionGrid}>
              {Object.entries(record.capabilities ?? {}).map(([key, value]) => (
                <div key={key}>
                  <dt>{key.replaceAll(/([A-Z])/g, " $1")}</dt>
                  <dd>{displayValue(value)}</dd>
                </div>
              ))}
            </dl>
            {Object.keys(record.capabilities ?? {}).length === 0 ? (
              <p className={styles.emptyInline}>
                Capabilities have not been inspected.
              </p>
            ) : null}
          </div>

          <div className={styles.panel}>
            <h2>Editorial notes</h2>
            {(record.review?.notes ?? []).length ? (
              <ul>
                {record.review?.notes?.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyInline}>
                This listing has not received a full editorial review.
              </p>
            )}
          </div>
        </section>

        <aside>
          <div className={styles.panel}>
            <h2>Classification</h2>
            {categories.length ? (
              <ul className={styles.tags}>
                {categories.map((category) => (
                  <li key={category}>
                    <Link href={`/gpts/${category}/`}>
                      {category.replaceAll("-", " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyInline}>Classification pending.</p>
            )}
          </div>

          <div className={styles.panel}>
            <h2>Source transparency</h2>
            <dl className={styles.definitionGrid}>
              <dt>Grounding</dt>
              <dd>{displayValue(sourceGrounding)}</dd>
              <dt>Disclosure</dt>
              <dd>{displayValue(record.knowledge?.disclosure)}</dd>
              <dt>Languages</dt>
              <dd>{languages}</dd>
            </dl>
          </div>

          <div className={styles.panel}>
            <h2>Simulation disclosure</h2>
            <p>
              {record.disclosures?.firstPersonSimulation
                ? "The public description indicates first-person simulation, embodiment, or roleplay."
                : "No first-person simulation flag is currently recorded."}
            </p>
          </div>

          <div className={styles.notice}>
            This directory does not present any GPT as Alan Watts himself.
            Historical recordings, editorial interpretation, and simulated
            dialogue should remain clearly distinguished.
          </div>
        </aside>
      </div>

      {similar.length ? (
        <section style={{ marginTop: "2rem" }}>
          <p className={styles.eyebrow}>Related directory entries</p>
          <h2>Similar GPTs</h2>
          <div className={styles.similarGrid}>
            {similar.map((candidate) => (
              <article className={styles.similarCard} key={candidate.id}>
                <GptAvatar
                  name={candidate.name}
                  imagePath={candidate.imageLocalPath}
                  size="small"
                />
                <h3>
                  <Link href={`/gpts/${candidate.slug}/`}>
                    {candidate.name}
                  </Link>
                </h3>
                <p>{candidate.creator || "Unknown creator"}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
