import { promises as fs } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {
  gptDataRoot,
  listRecordPaths,
  now,
  readJson,
  writeJson,
} from "./gpt-automation-lib";

type RecordShape = {
  id: string;
  gptId?: string | null;
  slug: string;
  name: string;
  description?: string | null;
  creator?: {
    displayName?: string;
    verifiedByDirectory?: boolean;
  };
  url?: {
    candidate?: string | null;
    canonical?: string | null;
    status?: string;
  };
  image?: {
    localPath?: string | null;
    status?: string;
  };
  usage?: {
    display?: string;
    lowerBound?: number | null;
  };
  categories?: string[];
  review?: {
    status?: string;
    availability?: string;
    creatorVerified?: boolean;
    lastReviewedAt?: string | null;
  };
  knowledge?: {
    sourceGroundingStatus?: string;
  };
  disclosures?: {
    firstPersonSimulation?: boolean;
  };
  listingLanguage?: string;
  supportedLanguages?: string[];
};

type CategoryDocument = {
  categories?: Array<{
    id: string;
    label: string;
  }>;
};

export async function main(): Promise<void> {
  const paths = await listRecordPaths();
  const records = await Promise.all(
    paths.map((filePath) => readJson<RecordShape>(filePath)),
  );

  records.sort(
    (a, b) =>
      (b.usage?.lowerBound ?? 0) - (a.usage?.lowerBound ?? 0) ||
      a.name.localeCompare(b.name),
  );

  const indexRecords = records.map((record) => ({
    id: record.id,
    gptId: record.gptId ?? null,
    slug: record.slug,
    name: record.name,
    description: record.description ?? null,
    creator: record.creator?.displayName ?? "Unknown creator",
    candidateUrl: record.url?.candidate ?? null,
    canonicalUrl: record.url?.canonical ?? null,
    urlStatus: record.url?.status ?? "unknown",
    imageStatus: record.image?.status ?? "missing",
    imageLocalPath: record.image?.localPath ?? null,
    usersDisplay: record.usage?.display ?? null,
    usersLowerBound: record.usage?.lowerBound ?? null,
    categories: record.categories ?? [],
    reviewStatus: record.review?.status ?? "unreviewed",
    availability: record.review?.availability ?? "unknown",
    creatorVerified:
      record.review?.creatorVerified ??
      record.creator?.verifiedByDirectory ??
      false,
    sourceGroundingStatus:
      record.knowledge?.sourceGroundingStatus ?? "not-evaluated",
    firstPersonSimulation:
      record.disclosures?.firstPersonSimulation ?? false,
    listingLanguage: record.listingLanguage ?? "unknown",
    supportedLanguages: record.supportedLanguages ?? [],
    lastReviewedAt: record.review?.lastReviewedAt ?? null,
  }));

  const categoriesPath = path.join(gptDataRoot, "categories.yaml");
  let categoryLabels = new Map<string, string>();

  try {
    const document = YAML.parse(
      await fs.readFile(categoriesPath, "utf8"),
    ) as CategoryDocument;

    categoryLabels = new Map(
      (document.categories ?? []).map((category) => [
        category.id,
        category.label,
      ]),
    );
  } catch {
    categoryLabels = new Map();
  }

  const categoryIds = new Set<string>();
  for (const record of records) {
    for (const category of record.categories ?? []) {
      categoryIds.add(category);
    }
  }
  for (const category of categoryLabels.keys()) {
    categoryIds.add(category);
  }

  const categories = [...categoryIds]
    .map((id) => ({
      id,
      label:
        categoryLabels.get(id) ??
        id
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      count: records.filter((record) =>
        (record.categories ?? []).includes(id),
      ).length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const generatedAt = now();
  const index = {
    schemaVersion: "2.0",
    generatedAt,
    recordCount: indexRecords.length,
    records: indexRecords,
  };

  const categoryCounts = {
    schemaVersion: "2.0",
    generatedAt,
    categories,
    unclassified: records.filter(
      (record) => !(record.categories ?? []).length,
    ).length,
  };

  const resources = {
    schemaVersion: "2.0",
    generatedAt,
    resourceType: "gpt",
    recordCount: indexRecords.length,
    records: indexRecords.map((record) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description,
      creator: record.creator,
      canonicalUrl: record.canonicalUrl,
      candidateUrl: record.candidateUrl,
      categories: record.categories,
      availability: record.availability,
      reviewStatus: record.reviewStatus,
      imageLocalPath: record.imageLocalPath,
      directoryPath: `/gpts/${record.slug}/`,
    })),
  };

  const publicSearch = indexRecords.map((record) => ({
    id: record.id,
    title: record.name,
    description: record.description,
    path: `/gpts/${record.slug}/`,
    contentType: "gpt",
    creator: record.creator,
    categories: record.categories,
    availability: record.availability,
    reviewStatus: record.reviewStatus,
  }));

  await Promise.all([
    writeJson(path.join(gptDataRoot, "index.json"), index),
    writeJson(path.join(gptDataRoot, "category-counts.json"), categoryCounts),
    writeJson(
      path.join(process.cwd(), "data", "resources", "gpts.json"),
      resources,
    ),
    writeJson(
      path.join(process.cwd(), "public", "data", "gpts.json"),
      resources,
    ),
    writeJson(
      path.join(process.cwd(), "public", "gpt-search-index.json"),
      publicSearch,
    ),
  ]);

  console.log(
    `Built GPT indexes for ${indexRecords.length} records and ${categories.length} categories.`,
  );
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
