import path from "node:path";
import {
  automationRoot,
  ensureDirectories,
  extractCanonical,
  extractConversationStarters,
  extractMeta,
  extractTitle,
  fetchWithTimeout,
  listRecordPaths,
  now,
  readJson,
  snapshotsRoot,
  wait,
  writeJson,
} from "./gpt-automation-lib";

type RecordShape = {
  slug: string;
  name: string;
  description?: string | null;
  conversationStarters?: string[];
  url?: {
    candidate?: string | null;
    canonical?: string | null;
    status?: string;
  };
  image?: {
    publicSourceUrl?: string | null;
    [key: string]: unknown;
  };
  listing?: {
    title?: string | null;
    description?: string | null;
    canonicalUrl?: string | null;
    imageUrl?: string | null;
    capturedAt?: string | null;
  };
};

export async function main(): Promise<void> {
  await ensureDirectories();

  const paths = await listRecordPaths();
  const summary = {
    generatedAt: now(),
    processed: 0,
    changed: 0,
    errors: 0,
    blocked: 0,
    results: [] as Array<Record<string, unknown>>,
  };

  for (const filePath of paths) {
    const record = await readJson<RecordShape>(filePath);
    const target = record.url?.canonical ?? record.url?.candidate;

    if (!target) continue;

    summary.processed += 1;

    try {
      const response = await fetchWithTimeout(target, 18_000);

      if ([401, 403, 429].includes(response.status)) {
        summary.blocked += 1;
        summary.results.push({
          slug: record.slug,
          status: "blocked-or-rate-limited",
          httpStatus: response.status,
        });
        await wait(1_100);
        continue;
      }

      if (!response.ok) {
        summary.results.push({
          slug: record.slug,
          status: "not-refreshed",
          httpStatus: response.status,
        });
        await wait(1_100);
        continue;
      }

      const html = await response.text();
      const capturedAt = now();
      const listing = {
        title: extractTitle(html),
        description:
          extractMeta(html, "og:description") ??
          extractMeta(html, "description"),
        canonicalUrl: extractCanonical(html) ?? response.url ?? target,
        imageUrl: extractMeta(html, "og:image"),
        capturedAt,
      };

      const starters = extractConversationStarters(html);
      const before = JSON.stringify(record.listing ?? {});

      record.listing = listing;
      record.url ??= {};
      record.url.canonical = listing.canonicalUrl;
      record.image ??= {};
      record.image.publicSourceUrl = listing.imageUrl;

      if (!(record.conversationStarters ?? []).length && starters.length) {
        record.conversationStarters = starters;
      }

      if (!record.description && listing.description) {
        record.description = listing.description;
      }

      if (before !== JSON.stringify(listing)) summary.changed += 1;

      await writeJson(filePath, record);
      await writeJson(
        path.join(
          snapshotsRoot,
          record.slug,
          `${capturedAt.replaceAll(":", "-")}.json`,
        ),
        {
          slug: record.slug,
          sourceUrl: target,
          httpStatus: response.status,
          listing,
          conversationStarters: starters,
        },
      );

      summary.results.push({
        slug: record.slug,
        status: "refreshed",
        startersFound: starters.length,
      });
    } catch (error) {
      summary.errors += 1;
      summary.results.push({
        slug: record.slug,
        status: "refresh-error",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    await wait(1_100);
  }

  await writeJson(
    path.join(automationRoot, "last-metadata-refresh.json"),
    summary,
  );

  console.log(
    `Refreshed ${summary.processed} GPT listings: ${summary.changed} changed, ` +
      `${summary.blocked} blocked/rate-limited, ${summary.errors} errors.`,
  );
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
