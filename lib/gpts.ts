import fs from "node:fs";
import path from "node:path";

export type CreatorInfo = {
  displayName?: string;
  raw?: string;
  profileUrl?: string | null;
  website?: string | null;
  verifiedByDirectory?: boolean;
};

export type GptIndexRecord = {
  id: string;
  gptId?: string | null;
  slug: string;
  name: string;
  description?: string | null;
  creator?: string;
  candidateUrl?: string | null;
  canonicalUrl?: string | null;
  urlStatus?: string;
  imageStatus?: string;
  imageLocalPath?: string | null;
  usersDisplay?: string;
  usersLowerBound?: number | null;
  categories?: string[];
  reviewStatus?: string;
  availability?: string;
  creatorVerified?: boolean;
  sourceGroundingStatus?: string;
  firstPersonSimulation?: boolean;
  listingLanguage?: string;
  supportedLanguages?: string[];
  lastReviewedAt?: string | null;
};

export type GptRecord = {
  schemaVersion?: string;
  id: string;
  gptId?: string | null;
  slug: string;
  name: string;
  description?: string | null;
  creator?: CreatorInfo;
  url?: {
    candidate?: string | null;
    canonical?: string | null;
    status?: string;
    lastCheckedAt?: string | null;
    httpStatus?: number | null;
    redirectTarget?: string | null;
  };
  image?: {
    importedSourceUrl?: string | null;
    publicSourceUrl?: string | null;
    localPath?: string | null;
    status?: string;
  };
  usage?: {
    display?: string;
    lowerBound?: number | null;
    capturedAt?: string;
    history?: Array<{
      display?: string;
      lowerBound?: number | null;
      capturedAt?: string;
    }>;
  };
  categories?: string[];
  listingLanguage?: string;
  supportedLanguages?: string[];
  conversationStarters?: string[];
  promptExamples?: string[];
  capabilities?: Record<string, string>;
  actions?: {
    present?: string;
    domains?: string[];
    privacyPolicyUrl?: string | null;
  };
  knowledge?: {
    disclosure?: string;
    claimedSources?: string[];
    sourceGroundingStatus?: string;
  };
  disclosures?: {
    firstPersonSimulation?: boolean;
    syntheticVoice?: string;
    editorialCompanion?: string;
  };
  review?: {
    status?: string;
    availability?: string;
    creatorVerified?: boolean;
    lastReviewedAt?: string | null;
    reviewer?: string | null;
    score?: number | null;
    notes?: string[];
  };
  listing?: {
    title?: string | null;
    description?: string | null;
    canonicalUrl?: string | null;
    imageUrl?: string | null;
    capturedAt?: string | null;
  };
  source?: Record<string, unknown>;
};

export type CategoryCount = {
  id: string;
  label: string;
  count: number;
};

export type AutomationSummary = {
  generatedAt?: string;
  processed?: number;
  available?: number;
  unavailable?: number;
  blocked?: number;
  changed?: number;
  errors?: number;
};

type GptIndexDocument = {
  generatedAt?: string;
  recordCount?: number;
  records: GptIndexRecord[];
};

type CategoryCountDocument = {
  generatedAt?: string;
  categories?: CategoryCount[];
  unclassified?: number;
};

const projectRoot = process.cwd();
const dataRoot = path.join(projectRoot, "data", "gpts");
const recordsRoot = path.join(dataRoot, "records");
const automationRoot = path.join(dataRoot, "automation");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

export function getAllGpts(): GptIndexRecord[] {
  const document = readJson<GptIndexDocument>(path.join(dataRoot, "index.json"));
  return document.records ?? [];
}

export function getAllCanonicalGpts(): GptRecord[] {
  if (!fs.existsSync(recordsRoot)) return [];

  return fs
    .readdirSync(recordsRoot)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson<GptRecord>(path.join(recordsRoot, name)))
    .sort(
      (a, b) =>
        (b.usage?.lowerBound ?? 0) - (a.usage?.lowerBound ?? 0) ||
        a.name.localeCompare(b.name),
    );
}

export function getGptBySlug(slug: string): GptRecord | null {
  return readJsonIfExists<GptRecord>(path.join(recordsRoot, `${slug}.json`));
}

export function getGptsByCategory(category: string): GptIndexRecord[] {
  return getAllGpts().filter(
    (record) =>
      Array.isArray(record.categories) &&
      record.categories.includes(category),
  );
}

export function getUnclassifiedGpts(): GptIndexRecord[] {
  return getAllGpts().filter(
    (record) => !record.categories || record.categories.length === 0,
  );
}

export function getUnavailableGpts(): GptIndexRecord[] {
  return getAllGpts().filter((record) =>
    ["unavailable", "removed"].includes(record.availability ?? ""),
  );
}

export function getRecentlyReviewedGpts(limit = 24): GptIndexRecord[] {
  return getAllGpts()
    .filter((record) => Boolean(record.lastReviewedAt))
    .sort((a, b) =>
      (b.lastReviewedAt ?? "").localeCompare(a.lastReviewedAt ?? ""),
    )
    .slice(0, limit);
}

export function getAllGptSlugs(): string[] {
  if (!fs.existsSync(recordsRoot)) return [];

  return fs
    .readdirSync(recordsRoot)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));
}

export function getCreatorName(record: GptRecord | GptIndexRecord): string {
  if (typeof record.creator === "string") {
    return record.creator || "Unknown creator";
  }

  return record.creator?.displayName || "Unknown creator";
}

export function getUsageDisplay(
  record: GptRecord | GptIndexRecord,
): string | null {
  const canonical = record as GptRecord;
  const indexed = record as GptIndexRecord;

  return canonical.usage?.display ?? indexed.usersDisplay ?? null;
}

export function getAvailability(
  record: GptRecord | GptIndexRecord,
): string {
  const canonical = record as GptRecord;
  const indexed = record as GptIndexRecord;

  return (
    canonical.review?.availability ??
    canonical.url?.status ??
    indexed.availability ??
    indexed.urlStatus ??
    "unknown"
  );
}

export function getSafeLaunchUrl(record: GptRecord): string | null {
  if (record.url?.canonical) return record.url.canonical;

  if (
    record.url?.candidate &&
    ["validated", "available"].includes(record.url.status ?? "")
  ) {
    return record.url.candidate;
  }

  return null;
}

export function getImagePath(
  record: GptRecord | GptIndexRecord,
): string | null {
  const canonical = record as GptRecord;
  const indexed = record as GptIndexRecord;

  return canonical.image?.localPath ?? indexed.imageLocalPath ?? null;
}
export function getCategoryCounts(): CategoryCountDocument {
  return (
    readJsonIfExists<CategoryCountDocument>(
      path.join(dataRoot, "category-counts.json"),
    ) ?? { categories: [], unclassified: 0 }
  );
}

export function getSimilarGpts(
  current: GptRecord,
  limit = 4,
): GptIndexRecord[] {
  const currentCategories = new Set(current.categories ?? []);
  const currentTokens = new Set(
    `${current.name} ${current.description ?? ""}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 4),
  );

  return getAllGpts()
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const categoryOverlap = (candidate.categories ?? []).filter((category) =>
        currentCategories.has(category),
      ).length;

      const text = `${candidate.name} ${candidate.description ?? ""}`.toLowerCase();
      const tokenOverlap = [...currentTokens].filter((token) =>
        text.includes(token),
      ).length;

      return {
        candidate,
        score:
          categoryOverlap * 5 +
          tokenOverlap +
          Math.min((candidate.usersLowerBound ?? 0) / 1000, 2),
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getAutomationSummaries(): {
  links: AutomationSummary | null;
  metadata: AutomationSummary | null;
  discovery: AutomationSummary | null;
} {
  return {
    links: readJsonIfExists<AutomationSummary>(
      path.join(automationRoot, "last-link-check.json"),
    ),
    metadata: readJsonIfExists<AutomationSummary>(
      path.join(automationRoot, "last-metadata-refresh.json"),
    ),
    discovery: readJsonIfExists<AutomationSummary>(
      path.join(automationRoot, "last-url-discovery.json"),
    ),
  };
}

