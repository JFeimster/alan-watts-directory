import path from "node:path";
import {
  automationRoot,
  ensureDirectories,
  listRecordPaths,
  now,
  pickChatGptUrl,
  readJson,
  wait,
  writeJson,
} from "./gpt-automation-lib";

type RecordShape = {
  slug: string;
  name: string;
  creator?: {
    displayName?: string;
  };
  url?: {
    candidate?: string | null;
    canonical?: string | null;
    status?: string;
  };
};

type SearchResult = {
  url?: string;
  link?: string;
};

async function searchSerper(query: string): Promise<string[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 10 }),
  });

  if (!response.ok) {
    throw new Error(`Serper returned ${response.status}.`);
  }

  const payload = (await response.json()) as {
    organic?: SearchResult[];
  };

  return (payload.organic ?? [])
    .map((result) => result.link ?? result.url ?? "")
    .filter(Boolean);
}

async function searchBing(query: string): Promise<string[]> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  if (!apiKey) return [];

  const endpoint =
    process.env.BING_SEARCH_ENDPOINT ??
    "https://api.bing.microsoft.com/v7.0/search";

  const url = new URL(endpoint);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "10");

  const response = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Bing returned ${response.status}.`);
  }

  const payload = (await response.json()) as {
    webPages?: {
      value?: SearchResult[];
    };
  };

  return (payload.webPages?.value ?? [])
    .map((result) => result.url ?? result.link ?? "")
    .filter(Boolean);
}

export async function main(): Promise<void> {
  await ensureDirectories();

  if (!process.env.SERPER_API_KEY && !process.env.BING_SEARCH_API_KEY) {
    console.log(
      "URL discovery skipped: set SERPER_API_KEY or BING_SEARCH_API_KEY.",
    );
    return;
  }

  const paths = await listRecordPaths();
  const summary = {
    generatedAt: now(),
    processed: 0,
    changed: 0,
    errors: 0,
    results: [] as Array<Record<string, unknown>>,
  };

  for (const filePath of paths) {
    const record = await readJson<RecordShape>(filePath);

    if (record.url?.canonical || record.url?.candidate) continue;

    summary.processed += 1;
    const creator = record.creator?.displayName ?? "";
    const query = `site:chatgpt.com/g/ "${record.name}" "${creator}"`;

    try {
      const urls = process.env.SERPER_API_KEY
        ? await searchSerper(query)
        : await searchBing(query);

      const candidate = pickChatGptUrl(urls);
      record.url ??= {};

      if (candidate) {
        record.url.candidate = candidate;
        record.url.status = "discovered-needs-validation";
        summary.changed += 1;
      } else {
        record.url.status = "not-found";
      }

      await writeJson(filePath, record);
      summary.results.push({
        slug: record.slug,
        query,
        candidate,
      });
    } catch (error) {
      summary.errors += 1;
      summary.results.push({
        slug: record.slug,
        query,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    await wait(1_300);
  }

  await writeJson(
    path.join(automationRoot, "last-url-discovery.json"),
    summary,
  );

  console.log(
    `URL discovery processed ${summary.processed} records: ` +
      `${summary.changed} candidates found, ${summary.errors} errors.`,
  );
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
