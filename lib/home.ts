import fs from "node:fs";
import path from "node:path";
import {
  getAllGpts,
  type GptIndexRecord,
} from "@/lib/gpts";
import { getRouteRecord, type RouteStatus } from "@/lib/site";
import { getStartHereRecords } from "@/lib/start-here";
import { getTopics } from "@/lib/topics";

export type Metric = {
  label: string;
  value: number;
  emptyLabel?: string;
};

export type DirectoryModule = {
  label: string;
  href: string;
  count: number;
  status: RouteStatus;
  purpose: string;
};

const root = process.cwd();
const recordExtensions = new Set([".json", ".yaml", ".yml", ".mdx"]);

function listRecordFiles(relativeDirectory: string): string[] {
  const directory = path.join(root, relativeDirectory);
  if (!fs.existsSync(directory)) return [];

  const files: string[] = [];
  const visit = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (recordExtensions.has(path.extname(entry.name))) files.push(fullPath);
    }
  };

  visit(directory);
  return files;
}

function countRecords(relativeDirectory: string): number {
  return listRecordFiles(relativeDirectory).length;
}

function readRecord(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  } catch {
    return null;
  }
}

function isVerifiedRecord(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const direct = record.verificationStatus ?? record.sourceStatus ?? record.status;
  if (direct === "verified" || direct === "source-verified") return true;

  const verification = record.verification;
  if (verification && typeof verification === "object") {
    const status = (verification as Record<string, unknown>).status;
    return status === "verified" || status === "source-verified";
  }

  return false;
}

export function getVerifiedSourceRecordCount(): number {
  const directories = [
    "data/sources",
    "data/lectures",
    "data/books",
    "data/quotes",
  ];

  return directories
    .flatMap(listRecordFiles)
    .map(readRecord)
    .filter(isVerifiedRecord).length;
}

export function getGptHomepageMetrics(records = getAllGpts()) {
  const classified = records.filter(
    (record) => (record.categories?.length ?? 0) > 0,
  ).length;
  const pending = records.length - classified;
  const sourceGrounded = records.filter(
    (record) =>
      record.categories?.includes("source-grounded") ||
      (!["not-evaluated", "unknown", undefined].includes(
        record.sourceGroundingStatus,
      )),
  ).length;
  const simulations = records.filter(
    (record) =>
      record.firstPersonSimulation ||
      record.categories?.includes("first-person-simulations"),
  ).length;
  const creatorVerified = records.filter(
    (record) => record.creatorVerified,
  ).length;
  const unavailable = records.filter((record) =>
    ["unavailable", "removed"].includes(record.availability ?? ""),
  ).length;

  return {
    total: records.length,
    classified,
    pending,
    sourceGrounded,
    simulations,
    creatorVerified,
    unavailable,
  };
}

export function getDirectoryStatusMetrics(): Metric[] {
  const gpts = getAllGpts();
  const gptMetrics = getGptHomepageMetrics(gpts);

  return [
    { label: "Lecture records", value: countRecords("data/lectures") },
    { label: "Book records", value: countRecords("data/books") },
    { label: "Quote records", value: countRecords("data/quotes") },
    { label: "Topic records", value: countRecords("data/topics") },
    { label: "GPT records", value: gptMetrics.total },
    { label: "Classified GPTs", value: gptMetrics.classified },
    { label: "Pending classifications", value: gptMetrics.pending },
    {
      label: "Verified-source records",
      value: getVerifiedSourceRecordCount(),
    },
  ];
}

export function getLibraryModules(): DirectoryModule[] {
  const modules = [
    ["Lectures", "/lectures", "data/lectures", "Locate talks, series, dates, provenance, and transcript coverage."],
    ["Collections", "/collections", "data/collections", "Group connected lectures without collapsing source distinctions."],
    ["Books", "/books", "data/books", "Index editions, publication context, and related records."],
    ["Quotes", "/quotes", "data/quotes", "Separate documented wording, variants, context, and misattribution."],
    ["Transcripts", "/transcripts", "transcripts", "Expose transcript coverage, review state, and source relationships."],
    ["Audio", "/audio", "data/audio", "Track approved listening sources without bundling large media files."],
    ["Images", "/images", "data/images", "Index rights-aware visual material and provenance."],
    ["People", "/people", "data/people", "Connect collaborators, editors, interviewers, and referenced thinkers."],
    ["Glossary", "/glossary", "data/glossary", "Define recurring terms without flattening their context."],
  ] as const;

  return modules.map(([label, href, directory, purpose]) => ({
    label,
    href,
    count: countRecords(directory),
    status: getRouteRecord(href).status,
    purpose,
  }));
}

export function getFeaturedGpts(limit = 4): GptIndexRecord[] {
  return getAllGpts()
    .filter(
      (record) =>
        !["unavailable", "removed"].includes(record.availability ?? ""),
    )
    .sort((a, b) => {
      const aGrounded =
        a.categories?.includes("source-grounded") ||
        a.sourceGroundingStatus === "claimed-in-listing"
          ? 1
          : 0;
      const bGrounded =
        b.categories?.includes("source-grounded") ||
        b.sourceGroundingStatus === "claimed-in-listing"
          ? 1
          : 0;
      return (
        bGrounded - aGrounded ||
        (b.usersLowerBound ?? 0) - (a.usersLowerBound ?? 0) ||
        a.name.localeCompare(b.name)
      );
    })
    .slice(0, limit);
}

export function getHomepageData() {
  const gpts = getAllGpts();
  return {
    metrics: getDirectoryStatusMetrics(),
    gptMetrics: getGptHomepageMetrics(gpts),
    featuredGpts: getFeaturedGpts(),
    startHere: getStartHereRecords(),
    topics: getTopics(),
    libraryModules: getLibraryModules(),
    listeningRecordCount: countRecords("data/lectures"),
    quoteRecordCount: countRecords("data/quotes"),
    mediaCounts: {
      essays: countRecords("content/essays"),
      videos: countRecords("data/videos"),
      shorts: countRecords("data/shorts"),
      playlists: countRecords("data/playlists"),
      newsletters: countRecords("data/newsletter"),
      podcasts: countRecords("data/podcasts"),
    },
  };
}
