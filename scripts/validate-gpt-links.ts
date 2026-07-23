import path from "node:path";
import {
  automationRoot,
  ensureDirectories,
  fetchWithTimeout,
  listRecordPaths,
  now,
  readJson,
  wait,
  writeJson,
} from "./gpt-automation-lib";

type RecordShape = {
  slug: string;
  url?: {
    candidate?: string | null;
    canonical?: string | null;
    status?: string;
    lastCheckedAt?: string | null;
    httpStatus?: number | null;
    redirectTarget?: string | null;
  };
  review?: {
    availability?: string;
    [key: string]: unknown;
  };
};

export async function main(): Promise<void> {
  await ensureDirectories();

  const paths = await listRecordPaths();
  const summary = {
    generatedAt: now(),
    processed: 0,
    available: 0,
    unavailable: 0,
    blocked: 0,
    changed: 0,
    errors: 0,
    results: [] as Array<Record<string, unknown>>,
  };

  for (const filePath of paths) {
    const record = await readJson<RecordShape>(filePath);
    const target = record.url?.canonical ?? record.url?.candidate;

    if (!target) continue;

    summary.processed += 1;
    const previousStatus = record.url?.status ?? "unknown";

    try {
      const response = await fetchWithTimeout(target, 18_000);
      const status = response.status;
      const finalUrl = response.url || target;

      record.url ??= {};
      record.review ??= {};
      record.url.lastCheckedAt = now();
      record.url.httpStatus = status;
      record.url.redirectTarget = finalUrl !== target ? finalUrl : null;

      if (status >= 200 && status < 400) {
        record.url.canonical = finalUrl;
        record.url.status = "validated";
        record.review.availability = "available";
        summary.available += 1;
      } else if (status === 404 || status === 410) {
        record.url.status = "unavailable";
        record.review.availability = "unavailable";
        summary.unavailable += 1;
      } else if ([401, 403, 429].includes(status)) {
        record.url.status = "blocked-or-rate-limited";
        record.review.availability = "unknown";
        summary.blocked += 1;
      } else {
        record.url.status = "needs-review";
        record.review.availability = "unknown";
      }

      if (previousStatus !== record.url.status) summary.changed += 1;

      await writeJson(filePath, record);
      summary.results.push({
        slug: record.slug,
        target,
        finalUrl,
        httpStatus: status,
        status: record.url.status,
      });
    } catch (error) {
      summary.errors += 1;
      record.url ??= {};
      record.url.lastCheckedAt = now();
      record.url.status = "check-error";
      await writeJson(filePath, record);

      summary.results.push({
        slug: record.slug,
        target,
        status: "check-error",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    await wait(1_100);
  }

  await writeJson(
    path.join(automationRoot, "last-link-check.json"),
    summary,
  );

  console.log(
    `Validated ${summary.processed} GPT links: ${summary.available} available, ` +
      `${summary.unavailable} unavailable, ${summary.blocked} blocked/rate-limited, ` +
      `${summary.errors} errors.`,
  );
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
