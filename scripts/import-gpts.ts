import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import YAML from "yaml";

type CsvRow = {
  "Profile Image URL"?: string;
  Name?: string;
  Description?: string;
  Creator?: string;
  Users?: string;
};

type JsonObject = Record<string, unknown>;

type CategoryDefinition = {
  id: string;
  label?: string;
  route?: string;
  description?: string;
};

type CategoryDocument = {
  categories?: CategoryDefinition[];
};

type CategoryMode = "auto" | "augment" | "manual";

type CategoryInference = {
  categories: string[];
  evidence: Record<string, string[]>;
};

type CanonicalRecord = {
  schemaVersion: string;
  id: string;
  gptId: string | null;
  slug: string;
  name: string;
  description: string | null;
  imported: {
    name: string;
    description: string | null;
    creatorDisplayName: string;
    creatorRaw: string;
    profileImageUrl: string | null;
    usersDisplay: string;
    usersLowerBound: number | null;
    capturedAt: string;
  };
  editorial: Record<string, unknown>;
  creator: {
    displayName: string;
    raw: string;
    profileUrl: string | null;
    website: string | null;
    contactEmail: string | null;
    verifiedByDirectory: boolean;
  };
  url: {
    candidate: string | null;
    canonical: string | null;
    status: string;
    lastCheckedAt: string | null;
    httpStatus: number | null;
    redirectTarget: string | null;
  };
  image: {
    importedSourceUrl: string | null;
    localPath: string | null;
    status: string;
  };
  usage: {
    display: string;
    lowerBound: number | null;
    capturedAt: string;
    history: Array<{
      display: string;
      lowerBound: number | null;
      capturedAt: string;
    }>;
  };
  categories: string[];
  categoryAssignment: {
    mode: CategoryMode;
    inferred: string[];
    manual: string[];
    effective: string[];
    evidence: Record<string, string[]>;
    updatedAt: string;
  };
  listingLanguage: string;
  supportedLanguages: string[];
  conversationStarters: string[];
  promptExamples: string[];
  capabilities: Record<string, string>;
  actions: {
    present: string;
    domains: string[];
    privacyPolicyUrl: string | null;
  };
  knowledge: {
    disclosure: string;
    claimedSources: string[];
    sourceGroundingStatus: string;
  };
  disclosures: {
    firstPersonSimulation: boolean;
    syntheticVoice: string;
    editorialCompanion: string;
  };
  review: {
    status: string;
    availability: string;
    creatorVerified: boolean;
    lastReviewedAt: string | null;
    reviewer: string | null;
    score: number | null;
    notes: string[];
  };
  source: {
    type: string;
    file: string;
    row: number | null;
    importedAt: string;
    importFingerprint: string;
    presentInLatestImport: boolean;
  };
  notes: string[];
  relatedGptIds: string[];
};

const projectRoot = process.cwd();
const inputPath =
  process.argv[2] ??
  path.join(projectRoot, "imports", "alan-watts-chatgpt.csv");

const outputDirectory = path.join(projectRoot, "data", "gpts");
const recordsDirectory = path.join(outputDirectory, "records");
const overridesDirectory = path.join(outputDirectory, "overrides");
const resourcesPath = path.join(projectRoot, "data", "resources", "gpts.json");
const categoriesPath = path.join(outputDirectory, "categories.yaml");

const DEFAULT_CATEGORY_RULES: Record<string, RegExp[]> = {
  research: [
    /\barchive\b/i,
    /\bresearch\b/i,
    /\btranscripts?\b/i,
    /\bsources?\b/i,
    /\bcitations?\b/i,
    /\bpassages?\b/i,
    /\bscholar(?:ly|ship)?\b/i,
    /\blibrary\b/i,
    /\bhistorical\b/i,
    /\bknowledge base\b/i,
  ],
  coaching: [
    /\bcoach(?:ing)?\b/i,
    /\bmentor(?:ing)?\b/i,
    /\bguidance\b/i,
    /\badvisor\b/i,
    /\badvice\b/i,
    /\bdecision(?:s| making)?\b/i,
    /\bpersonal growth\b/i,
    /\bself[- ]help\b/i,
    /\bcounsel(?:or|ing)?\b/i,
  ],
  meditation: [
    /\bmeditat(?:e|es|ion|ive)\b/i,
    /\bmindful(?:ness)?\b/i,
    /\bcalm\b/i,
    /\brelax(?:ation|ing)?\b/i,
    /\binner peace\b/i,
    /\bcontemplative\b/i,
  ],
  writing: [
    /\bwriting\b/i,
    /\bwriter\b/i,
    /\bcreative writing\b/i,
    /\bstor(?:y|ies|ytelling)\b/i,
    /\bpoem(?:s|try)?\b/i,
    /\bscript(?:s|ing)?\b/i,
    /\bcopywriting\b/i,
    /\bcontent creation\b/i,
  ],
  "comparative-philosophy": [
    /\bjung\b/i,
    /\bjesus\b/i,
    /\blao tzu\b/i,
    /\bkrishnamurti\b/i,
    /\bram dass\b/i,
    /\bbuddh(?:a|ism|ist)?\b/i,
    /\btao(?:ism|ist)?\b/i,
    /\bzen\b/i,
    /\bstoic(?:ism)?\b/i,
    /\bphilosophers?\b/i,
    /\bcomparative\b/i,
    /\bmentor collective\b/i,
  ],
  "source-grounded": [
    /\bsource[- ]grounded\b/i,
    /\bcitations?\b/i,
    /\btranscripts?\b/i,
    /\barchive\b/i,
    /\blocate (?:relevant )?passages?\b/i,
    /\bdistinguish(?:es|ing)? between .* views\b/i,
    /\bsource material\b/i,
    /\bhistorical recordings?\b/i,
    /\bbooks? and lectures?\b/i,
    /\boriginal lectures?\b/i,
  ],
  "first-person-simulations": [
    /\bspeak with\b/i,
    /\bchat with\b/i,
    /\breincarnat(?:e|ed|ion)\b/i,
    /\bembod(?:y|ies|ied|iment)\b/i,
    /\bvoice of\b/i,
    /\bas alan watts\b/i,
    /\bi am alan watts\b/i,
    /\bdigital alan\b/i,
    /\bvirtual .*alan\b/i,
    /\bessence of alan watts\b/i,
    /\balan watts[- ]style chat\b/i,
    /\bchannel(?:ing)? alan watts\b/i,
  ],
  multilingual: [
    /\bespañol\b/i,
    /\bspanish\b/i,
    /\bfrançais\b/i,
    /\bfrench\b/i,
    /\bdeutsch\b/i,
    /\bgerman\b/i,
    /\bportugu[eê]s\b/i,
    /\bitalian\b/i,
    /\bjapanese\b/i,
    /\bchinese\b/i,
    /\bkorean\b/i,
    /\barabic\b/i,
    /\bhindi\b/i,
    /\bmultilingual\b/i,
  ],
};

function clean(value?: string | null): string {
  return (value ?? "").trim();
}

function slugify(value: string): string {
  return (
    clean(value)
      .toLowerCase()
      .replace(/[’'"`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled"
  );
}

function normalizeCreator(value?: string): string {
  return clean(value).replace(/^by\s+/i, "").trim();
}

function extractGptId(url?: string | null): string | null {
  const match = clean(url).match(/(?:gizmo_id=|\/g\/)(g-[A-Za-z0-9]+)/);
  return match?.[1] ?? null;
}

function parseUsers(value?: string): number | null {
  let normalized = clean(value)
    .toUpperCase()
    .replace(/,/g, "")
    .replace(/\+$/, "");

  if (!normalized) return null;

  let multiplier = 1;
  if (normalized.endsWith("K")) {
    multiplier = 1_000;
    normalized = normalized.slice(0, -1);
  } else if (normalized.endsWith("M")) {
    multiplier = 1_000_000;
    normalized = normalized.slice(0, -1);
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.floor(parsed * multiplier) : null;
}

function hash(value: string, length = 16): string {
  return createHash("sha256").update(value).digest("hex").slice(0, length);
}

function fallbackId(name: string, creator: string, description: string): string {
  return `csv-${hash(`${name}|${creator}|${description}`)}`;
}

function importFingerprint(
  gptId: string | null,
  name: string,
  creator: string,
): string {
  return gptId ?? `name-creator-${hash(`${name.toLowerCase()}|${creator.toLowerCase()}`)}`;
}

function uniqueStrings(values: unknown[]): string[] {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function isPlainObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T;
  }

  const result: JsonObject = { ...base };
  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key];
    result[key] =
      isPlainObject(baseValue) && isPlainObject(overrideValue)
        ? deepMerge(baseValue, overrideValue)
        : overrideValue;
  }
  return result as T;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(filePath: string): Promise<T | null> {
  if (!(await pathExists(filePath))) return null;
  const text = await fs.readFile(filePath, "utf8");
  return JSON.parse(text) as T;
}

async function writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

async function loadCategoryDefinitions(): Promise<CategoryDefinition[]> {
  if (!(await pathExists(categoriesPath))) {
    return Object.keys(DEFAULT_CATEGORY_RULES).map((id) => ({ id }));
  }

  const document = YAML.parse(
    await fs.readFile(categoriesPath, "utf8"),
  ) as CategoryDocument;

  return document.categories ?? [];
}

function inferCategories(
  name: string,
  description: string,
  creator: string,
  allowedCategoryIds: Set<string>,
): CategoryInference {
  const searchableText = [name, description, creator].filter(Boolean).join(" \n ");
  const categories: string[] = [];
  const evidence: Record<string, string[]> = {};

  for (const [categoryId, patterns] of Object.entries(DEFAULT_CATEGORY_RULES)) {
    if (!allowedCategoryIds.has(categoryId)) continue;

    const matches = patterns
      .filter((pattern) => pattern.test(searchableText))
      .map((pattern) => pattern.source);

    if (matches.length > 0) {
      categories.push(categoryId);
      evidence[categoryId] = matches;
    }
  }

  return {
    categories: uniqueStrings(categories),
    evidence,
  };
}

function normalizeCategoryMode(value: unknown): CategoryMode {
  return value === "manual" || value === "augment" || value === "auto"
    ? value
    : "auto";
}

function resolveEffectiveCategories(
  inferred: string[],
  manual: string[],
  mode: CategoryMode,
  creatorVerified: boolean,
  allowedCategoryIds: Set<string>,
): string[] {
  let effective: string[];

  if (mode === "manual") {
    effective = manual;
  } else if (mode === "augment") {
    effective = [...inferred, ...manual];
  } else {
    effective = inferred;
  }

  if (creatorVerified && allowedCategoryIds.has("creator-verified")) {
    effective.push("creator-verified");
  }

  return uniqueStrings(effective).filter((category) =>
    allowedCategoryIds.has(category),
  );
}

function appendUsageHistory(
  existingHistory: CanonicalRecord["usage"]["history"] | undefined,
  display: string,
  lowerBound: number | null,
  capturedAt: string,
): CanonicalRecord["usage"]["history"] {
  const history = Array.isArray(existingHistory) ? [...existingHistory] : [];
  const mostRecent = history.at(-1);

  if (
    !mostRecent ||
    mostRecent.display !== display ||
    mostRecent.lowerBound !== lowerBound
  ) {
    history.push({ display, lowerBound, capturedAt });
  }

  return history;
}

function buildEnrichmentTasks(record: CanonicalRecord): string[] {
  const tasks: string[] = [];

  if (!record.url.candidate && !record.url.canonical) {
    tasks.push("discover-url");
  }
  if (record.url.candidate && !record.url.canonical) {
    tasks.push("validate-url", "resolve-canonical-url");
  }
  if (!record.creator.profileUrl) {
    tasks.push("capture-creator-profile");
  }
  if (record.conversationStarters.length === 0) {
    tasks.push("capture-conversation-starters");
  }
  if (record.promptExamples.length === 0) {
    tasks.push("capture-prompt-examples");
  }
  if (record.review.availability === "unknown") {
    tasks.push("check-availability");
  }
  if (Object.values(record.capabilities).every((value) => value === "unknown")) {
    tasks.push("inspect-capabilities");
  }
  if (record.actions.present === "unknown") {
    tasks.push("inspect-actions-and-privacy");
  }
  if (record.supportedLanguages.length === 0) {
    tasks.push("confirm-supported-languages");
  }
  if (!record.description) {
    tasks.push("refresh-public-listing");
  }
  if (!record.image.localPath && record.image.importedSourceUrl) {
    tasks.push("replace-temporary-profile-image");
  }

  return uniqueStrings(tasks);
}

async function loadExistingRecords(): Promise<CanonicalRecord[]> {
  if (!(await pathExists(recordsDirectory))) return [];

  const directoryEntries = await fs.readdir(recordsDirectory, {
    withFileTypes: true,
  });

  const records: CanonicalRecord[] = [];
  for (const entry of directoryEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const record = await readJson<CanonicalRecord>(
      path.join(recordsDirectory, entry.name),
    );
    if (record) records.push(record);
  }
  return records;
}

async function loadOverride(slug: string): Promise<JsonObject | null> {
  return readJson<JsonObject>(path.join(overridesDirectory, `${slug}.json`));
}

function preserveFromExisting(
  fresh: CanonicalRecord,
  existing: CanonicalRecord | undefined,
): CanonicalRecord {
  if (!existing) return fresh;

  const editorial = isPlainObject(existing.editorial) ? existing.editorial : {};
  const editorialName =
    typeof editorial.name === "string" ? editorial.name.trim() : "";
  const editorialDescription =
    typeof editorial.description === "string"
      ? editorial.description.trim()
      : null;
  const editorialCreator =
    typeof editorial.creatorDisplayName === "string"
      ? editorial.creatorDisplayName.trim()
      : "";

  return {
    ...fresh,
    slug: existing.slug || fresh.slug,
    name: editorialName || fresh.name,
    description: editorialDescription || fresh.description,
    editorial,
    creator: {
      ...fresh.creator,
      displayName: editorialCreator || fresh.creator.displayName,
      profileUrl: existing.creator?.profileUrl ?? null,
      website: existing.creator?.website ?? null,
      contactEmail: existing.creator?.contactEmail ?? null,
      verifiedByDirectory:
        existing.creator?.verifiedByDirectory ?? false,
    },
    url: {
      ...fresh.url,
      canonical: existing.url?.canonical ?? null,
      status: existing.url?.status ?? fresh.url.status,
      lastCheckedAt: existing.url?.lastCheckedAt ?? null,
      httpStatus: existing.url?.httpStatus ?? null,
      redirectTarget: existing.url?.redirectTarget ?? null,
    },
    image: {
      ...fresh.image,
      localPath: existing.image?.localPath ?? null,
      status:
        existing.image?.localPath && existing.image.status
          ? existing.image.status
          : fresh.image.status,
    },
    usage: {
      ...fresh.usage,
      history: appendUsageHistory(
        existing.usage?.history,
        fresh.usage.display,
        fresh.usage.lowerBound,
        fresh.usage.capturedAt,
      ),
    },
    categoryAssignment: {
      ...fresh.categoryAssignment,
      mode: normalizeCategoryMode(existing.categoryAssignment?.mode),
      manual: uniqueStrings(existing.categoryAssignment?.manual ?? []),
    },
    supportedLanguages: uniqueStrings(existing.supportedLanguages ?? []),
    conversationStarters: uniqueStrings(existing.conversationStarters ?? []),
    promptExamples: uniqueStrings(existing.promptExamples ?? []),
    capabilities: {
      ...fresh.capabilities,
      ...(existing.capabilities ?? {}),
    },
    actions: {
      ...fresh.actions,
      ...(existing.actions ?? {}),
      domains: uniqueStrings(existing.actions?.domains ?? []),
    },
    knowledge: {
      ...fresh.knowledge,
      ...(existing.knowledge ?? {}),
      claimedSources: uniqueStrings(existing.knowledge?.claimedSources ?? []),
    },
    disclosures: {
      ...fresh.disclosures,
      ...(existing.disclosures ?? {}),
    },
    review: {
      ...fresh.review,
      ...(existing.review ?? {}),
      notes: uniqueStrings(existing.review?.notes ?? []),
    },
    notes: uniqueStrings(existing.notes ?? []),
    relatedGptIds: uniqueStrings(existing.relatedGptIds ?? []),
  };
}

function finalizeRecord(
  record: CanonicalRecord,
  allowedCategoryIds: Set<string>,
  importedAt: string,
): CanonicalRecord {
  const manualCategories = uniqueStrings(record.categoryAssignment.manual ?? []);
  const mode = normalizeCategoryMode(record.categoryAssignment.mode);
  const effectiveCategories = resolveEffectiveCategories(
    record.categoryAssignment.inferred,
    manualCategories,
    mode,
    Boolean(
      record.review.creatorVerified || record.creator.verifiedByDirectory,
    ),
    allowedCategoryIds,
  );

  return {
    ...record,
    categories: effectiveCategories,
    creator: {
      ...record.creator,
      verifiedByDirectory: Boolean(
        record.creator.verifiedByDirectory || record.review.creatorVerified,
      ),
    },
    review: {
      ...record.review,
      creatorVerified: Boolean(
        record.review.creatorVerified || record.creator.verifiedByDirectory,
      ),
    },
    categoryAssignment: {
      ...record.categoryAssignment,
      mode,
      manual: manualCategories,
      effective: effectiveCategories,
      updatedAt: importedAt,
    },
  };
}

async function main(): Promise<void> {
  const importedAt = new Date().toISOString();
  const csvText = await fs.readFile(inputPath, "utf8");
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  }) as CsvRow[];

  const categoryDefinitions = await loadCategoryDefinitions();
  const allowedCategoryIds = new Set(
    categoryDefinitions.map((category) => category.id),
  );

  const existingRecords = await loadExistingRecords();
  const existingById = new Map(
    existingRecords.map((record) => [record.id, record]),
  );
  const existingByFingerprint = new Map(
    existingRecords
      .filter((record) => Boolean(record.source?.importFingerprint))
      .map((record) => [record.source.importFingerprint, record]),
  );

  const exactSeen = new Set<string>();
  const duplicateRows: number[] = [];
  const deduplicatedRows = rows
    .map((row, index) => ({ row, sourceRow: index + 2 }))
    .filter(({ row, sourceRow }) => {
      const key = JSON.stringify({
        image: clean(row["Profile Image URL"]),
        name: clean(row.Name),
        description: clean(row.Description),
        creator: clean(row.Creator),
        users: clean(row.Users),
      });

      if (exactSeen.has(key)) {
        duplicateRows.push(sourceRow);
        return false;
      }

      exactSeen.add(key);
      return true;
    });

  const nameCounts = new Map<string, number>();
  for (const { row } of deduplicatedRows) {
    const base = slugify(clean(row.Name));
    nameCounts.set(base, (nameCounts.get(base) ?? 0) + 1);
  }

  const usedSlugs = new Set(existingRecords.map((record) => record.slug));
  const matchedExistingIds = new Set<string>();
  const canonicalRecords: CanonicalRecord[] = [];
  const importSnapshotRecords: JsonObject[] = [];

  for (const { row, sourceRow } of deduplicatedRows) {
    const importedName = clean(row.Name);
    const importedDescription = clean(row.Description);
    const importedCreatorRaw = clean(row.Creator);
    const importedCreator = normalizeCreator(importedCreatorRaw);
    const imageUrl = clean(row["Profile Image URL"]) || null;
    const usersDisplay = clean(row.Users);
    const usersLowerBound = parseUsers(row.Users);
    const gptId = extractGptId(imageUrl);
    const id = gptId ?? fallbackId(importedName, importedCreator, importedDescription);
    const fingerprint = importFingerprint(gptId, importedName, importedCreator);

    const existing =
      existingById.get(id) ?? existingByFingerprint.get(fingerprint);

    if (existing) matchedExistingIds.add(existing.id);

    let slug = existing?.slug;
    if (!slug) {
      const nameSlug = slugify(importedName);
      let baseSlug = nameSlug;
      if ((nameCounts.get(nameSlug) ?? 0) > 1) {
        baseSlug = `${nameSlug}-${slugify(importedCreator)}`;
      }

      slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);
    }

    const inference = inferCategories(
      importedName,
      importedDescription,
      importedCreator,
      allowedCategoryIds,
    );

    const fresh: CanonicalRecord = {
      schemaVersion: "2.0",
      id,
      gptId,
      slug,
      name: importedName,
      description: importedDescription || null,
      imported: {
        name: importedName,
        description: importedDescription || null,
        creatorDisplayName: importedCreator,
        creatorRaw: importedCreatorRaw,
        profileImageUrl: imageUrl,
        usersDisplay,
        usersLowerBound,
        capturedAt: importedAt,
      },
      editorial: {},
      creator: {
        displayName: importedCreator,
        raw: importedCreatorRaw,
        profileUrl: null,
        website: null,
        contactEmail: null,
        verifiedByDirectory: false,
      },
      url: {
        candidate: gptId ? `https://chatgpt.com/g/${gptId}` : null,
        canonical: null,
        status: gptId ? "needs-validation" : "missing",
        lastCheckedAt: null,
        httpStatus: null,
        redirectTarget: null,
      },
      image: {
        importedSourceUrl: imageUrl,
        localPath: null,
        status: imageUrl ? "temporary-signed-url" : "missing",
      },
      usage: {
        display: usersDisplay,
        lowerBound: usersLowerBound,
        capturedAt: importedAt,
        history: [
          {
            display: usersDisplay,
            lowerBound: usersLowerBound,
            capturedAt: importedAt,
          },
        ],
      },
      categories: inference.categories,
      categoryAssignment: {
        mode: "auto",
        inferred: inference.categories,
        manual: [],
        effective: inference.categories,
        evidence: inference.evidence,
        updatedAt: importedAt,
      },
      listingLanguage: "en",
      supportedLanguages: [],
      conversationStarters: [],
      promptExamples: [],
      capabilities: {
        webSearch: "unknown",
        imageGeneration: "unknown",
        dataAnalysis: "unknown",
        canvas: "unknown",
        apps: "unknown",
        actions: "unknown",
      },
      actions: {
        present: "unknown",
        domains: [],
        privacyPolicyUrl: null,
      },
      knowledge: {
        disclosure: "unknown",
        claimedSources: [],
        sourceGroundingStatus: inference.categories.includes("source-grounded")
          ? "claimed-in-listing"
          : "not-evaluated",
      },
      disclosures: {
        firstPersonSimulation: inference.categories.includes(
          "first-person-simulations",
        ),
        syntheticVoice: "unknown",
        editorialCompanion: "unknown",
      },
      review: {
        status: "unreviewed",
        availability: "unknown",
        creatorVerified: false,
        lastReviewedAt: null,
        reviewer: null,
        score: null,
        notes: [],
      },
      source: {
        type: "csv-import",
        file: path.basename(inputPath),
        row: sourceRow,
        importedAt,
        importFingerprint: fingerprint,
        presentInLatestImport: true,
      },
      notes: [],
      relatedGptIds: [],
    };

    let canonical = preserveFromExisting(fresh, existing);
    const override = await loadOverride(canonical.slug);
    if (override) canonical = deepMerge(canonical, override);
    canonical = finalizeRecord(canonical, allowedCategoryIds, importedAt);

    canonicalRecords.push(canonical);
    importSnapshotRecords.push({
      id,
      gptId,
      slug: canonical.slug,
      name: importedName,
      description: importedDescription || null,
      creator: importedCreator,
      profileImageUrl: imageUrl,
      usersDisplay,
      usersLowerBound,
      sourceRow,
      inferredCategories: inference.categories,
      categoryEvidence: inference.evidence,
    });
  }

  // Keep canonical records that were manually added or absent from the latest CSV.
  for (const existing of existingRecords) {
    if (matchedExistingIds.has(existing.id)) continue;

    let retained: CanonicalRecord = {
      ...existing,
      source: {
        ...existing.source,
        presentInLatestImport: false,
      },
    };

    const override = await loadOverride(retained.slug);
    if (override) retained = deepMerge(retained, override);
    retained = finalizeRecord(retained, allowedCategoryIds, importedAt);
    canonicalRecords.push(retained);
  }

  canonicalRecords.sort(
    (a, b) =>
      (b.usage.lowerBound ?? 0) - (a.usage.lowerBound ?? 0) ||
      a.name.localeCompare(b.name) ||
      a.creator.displayName.localeCompare(b.creator.displayName),
  );

  const categoryCounts: Record<string, number> = Object.fromEntries(
    categoryDefinitions.map((category) => [category.id, 0]),
  );
  let unclassifiedCount = 0;

  for (const record of canonicalRecords) {
    if (record.categories.length === 0) unclassifiedCount += 1;
    for (const category of record.categories) {
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    }
  }

  const categoryCountDocument = {
    schemaVersion: "1.0",
    generatedAt: importedAt,
    totalRecords: canonicalRecords.length,
    unclassified: unclassifiedCount,
    categories: categoryDefinitions.map((category) => ({
      id: category.id,
      label: category.label ?? category.id,
      route: category.route ?? `/gpts/${category.id}/`,
      count: categoryCounts[category.id] ?? 0,
    })),
  };

  const indexDocument = {
    schemaVersion: "2.0",
    generatedAt: importedAt,
    recordCount: canonicalRecords.length,
    importedRecordCount: importSnapshotRecords.length,
    categoryCounts,
    unclassifiedCount,
    records: canonicalRecords.map((record) => ({
      id: record.id,
      gptId: record.gptId,
      slug: record.slug,
      recordPath: `data/gpts/records/${record.slug}.json`,
      directoryPath: `/gpts/${record.slug}/`,
      name: record.name,
      description: record.description,
      creator: record.creator.displayName,
      candidateUrl: record.url.candidate,
      canonicalUrl: record.url.canonical,
      urlStatus: record.url.status,
      usersDisplay: record.usage.display,
      usersLowerBound: record.usage.lowerBound,
      categories: record.categories,
      reviewStatus: record.review.status,
      availability: record.review.availability,
      creatorVerified: record.review.creatorVerified,
      presentInLatestImport: record.source.presentInLatestImport,
    })),
  };

  const resourcesDocument = {
    schemaVersion: "2.0",
    generatedAt: importedAt,
    resourceType: "gpt",
    recordCount: canonicalRecords.length,
    records: canonicalRecords.map((record) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description,
      creator: record.creator.displayName,
      url: record.url.canonical ?? record.url.candidate,
      categories: record.categories,
      availability: record.review.availability,
      reviewStatus: record.review.status,
      directoryPath: `/gpts/${record.slug}/`,
    })),
  };

  const queueRecords = canonicalRecords
    .map((record) => {
      const tasks = buildEnrichmentTasks(record);
      const usage = record.usage.lowerBound ?? 0;
      const priority =
        usage >= 500 || record.categories.includes("source-grounded")
          ? "high"
          : usage >= 100
            ? "medium"
            : "normal";

      return {
        id: record.id,
        gptId: record.gptId,
        slug: record.slug,
        name: record.name,
        priority,
        candidateUrl: record.url.candidate,
        canonicalUrl: record.url.canonical,
        tasks,
      };
    })
    .filter((record) => record.tasks.length > 0);

  const taskCounts: Record<string, number> = {};
  for (const record of queueRecords) {
    for (const task of record.tasks) {
      taskCounts[task] = (taskCounts[task] ?? 0) + 1;
    }
  }

  const enrichmentQueueDocument = {
    schemaVersion: "2.0",
    generatedAt: importedAt,
    recordCount: queueRecords.length,
    taskCounts,
    records: queueRecords,
  };

  const importedDocument = {
    schemaVersion: "2.0",
    generatedAt: importedAt,
    sourceFile: path.basename(inputPath),
    sourceRowCount: rows.length,
    deduplicatedRowCount: importSnapshotRecords.length,
    removedExactDuplicateRows: duplicateRows,
    records: importSnapshotRecords,
  };

  await fs.mkdir(recordsDirectory, { recursive: true });
  await fs.mkdir(overridesDirectory, { recursive: true });
  await fs.mkdir(path.dirname(resourcesPath), { recursive: true });

  await Promise.all(
    canonicalRecords.map((record) =>
      writeJsonAtomic(
        path.join(recordsDirectory, `${record.slug}.json`),
        record,
      ),
    ),
  );

  await Promise.all([
    writeJsonAtomic(
      path.join(outputDirectory, "imported-alan-watts-chatgpt.json"),
      importedDocument,
    ),
    writeJsonAtomic(path.join(outputDirectory, "index.json"), indexDocument),
    writeJsonAtomic(
      path.join(outputDirectory, "category-counts.json"),
      categoryCountDocument,
    ),
    writeJsonAtomic(
      path.join(outputDirectory, "enrichment-queue.json"),
      enrichmentQueueDocument,
    ),
    writeJsonAtomic(resourcesPath, resourcesDocument),
  ]);

  console.log(
    `Imported ${rows.length} rows into ${importSnapshotRecords.length} deduplicated records.`,
  );
  console.log(
    `Wrote ${canonicalRecords.length} canonical GPT files to ${path.relative(projectRoot, recordsDirectory)}.`,
  );
  console.log(
    `Assigned ${canonicalRecords.reduce((sum, record) => sum + record.categories.length, 0)} category memberships; ${unclassifiedCount} records remain unclassified.`,
  );
  console.log(
    `Queued ${queueRecords.length} records for enrichment across ${Object.keys(taskCounts).length} task types.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});


