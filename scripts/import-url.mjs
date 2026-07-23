#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSION = "0.1.0";
const DEFAULT_OUT_DIR = "data/imports";

const args = process.argv.slice(2);
const urlArg = args.find((arg) => !arg.startsWith("--"));

if (!urlArg || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(urlArg ? 0 : 1);
}

const options = parseOptions(args);
const targetUrl = normalizeUrl(urlArg);
const importedAt = new Date().toISOString();

const response = await fetch(targetUrl, {
  headers: {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "user-agent": "AlanWattsWisdomImporter/0.1 (+source-grounded archive utility)",
  },
  redirect: "follow",
});

const contentType = response.headers.get("content-type") ?? "unknown";
const finalUrl = response.url || targetUrl;
const bytes = await response.arrayBuffer();
const text = decodeResponse(bytes, contentType);
const source = {
  url: targetUrl,
  finalUrl,
  canonicalUrl: null,
  host: new URL(finalUrl).host,
  status: response.status,
  ok: response.ok,
  contentType,
  fetchedAt: importedAt,
};

const record = contentType.includes("html")
  ? buildHtmlRecord({ html: text, source, importedAt, overrideType: options.type })
  : buildBinaryRecord({ source, importedAt, overrideType: options.type });

if (options.stdout) {
  process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
} else {
  const outDir = path.resolve(process.cwd(), options.outDir);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${record.asset.slug}.json`);
  await writeFile(outPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log(`Imported ${record.asset.type}: ${record.asset.title}`);
  console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
}

function printHelp() {
  console.log(`Usage:
  npm run import:url -- <url> [--out data/imports] [--type lecture|transcript|video|book|article|resource] [--stdout]

Examples:
  npm run import:url -- https://www.organism.earth/library/document/out-of-your-mind-1
  npm run import:url -- https://www.organism.earth/library/document/out-of-your-mind-1 --type transcript --out data/imports/organism-earth

The importer fetches a public URL, extracts conservative metadata, transcript-like text,
media links, headings, and JSON-LD, then writes a review-ready JSON record. It labels
the source as "Source not yet confirmed" until a human verifies provenance.`);
}

function parseOptions(argv) {
  const options = { outDir: DEFAULT_OUT_DIR, stdout: false, type: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--stdout") options.stdout = true;
    if (arg === "--out") options.outDir = argv[index + 1] ?? DEFAULT_OUT_DIR;
    if (arg === "--type") options.type = argv[index + 1] ?? null;
  }
  return options;
}

function normalizeUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs can be imported.");
  }
  return url.toString();
}

function decodeResponse(bytes, contentType) {
  const charset = contentType.match(/charset=([^;\s]+)/i)?.[1] ?? "utf-8";
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function buildHtmlRecord({ html, source, importedAt, overrideType }) {
  const cleaned = stripUnsafeBlocks(html);
  const canonicalUrl = attrFromFirst(cleaned, "link", "href", /rel=["'][^"']*canonical/i);
  const title = firstText(cleaned, "h1") || meta(cleaned, "og:title") || tagText(cleaned, "title") || readableName(source.finalUrl);
  const description =
    meta(cleaned, "description") ||
    meta(cleaned, "og:description") ||
    firstParagraph(cleaned) ||
    "Imported source record awaiting editorial review.";
  const author = meta(cleaned, "author") || jsonLdValue(cleaned, "author") || null;
  const publishedDate =
    meta(cleaned, "article:published_time") ||
    attrFromFirst(cleaned, "time", "datetime") ||
    jsonLdValue(cleaned, "datePublished") ||
    null;
  const language = attrFromFirst(cleaned, "html", "lang") || null;
  const jsonLd = jsonLdBlocks(cleaned);
  const media = extractMedia(cleaned, source.finalUrl);
  const headings = [...cleaned.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => normalizeWhitespace(stripTags(match[2])))
    .filter(Boolean)
    .slice(0, 40);
  const bodyText = bestBodyText(cleaned);
  const inferredType = overrideType || inferAssetType({ title, description, bodyText, media, jsonLd, source });
  const transcriptText = inferTranscriptText({ type: inferredType, bodyText });
  const slug = slugify(`${title}-${new URL(source.finalUrl).host}`);

  return {
    importer: {
      name: "Alan Watts Wisdom URL Importer",
      version: VERSION,
      importedAt,
    },
    source: {
      ...source,
      canonicalUrl: canonicalUrl ? absolutize(canonicalUrl, source.finalUrl) : null,
    },
    asset: {
      type: inferredType,
      title,
      slug,
      description,
      author,
      publishedDate,
      language,
    },
    verification: {
      status: "Source not yet confirmed",
      notes: [
        "Imported automatically from a public URL.",
        "Review source ownership, provenance, transcript accuracy, and publication rights before promoting this record.",
      ],
    },
    media,
    transcript: {
      status: transcriptText ? "Imported draft" : "Not detected",
      wordCount: transcriptText ? transcriptText.split(/\s+/).filter(Boolean).length : 0,
      excerpt: transcriptText ? truncate(transcriptText, 700) : null,
      text: transcriptText,
    },
    editorial: {
      recommendedCollection: recommendCollection(inferredType),
      topics: [],
      nextActions: [
        "Verify the original source and publication context.",
        "Check whether the page contains copyrighted transcript text before publishing excerpts.",
        "Map the record to existing topics, lectures, books, or collections.",
      ],
    },
    raw: {
      headings,
      jsonLdTypes: jsonLd.map((entry) => entry["@type"]).filter(Boolean),
      jsonLd,
    },
  };
}

function buildBinaryRecord({ source, importedAt, overrideType }) {
  const title = readableName(source.finalUrl);
  const inferredType = overrideType || inferBinaryType(source.contentType, source.finalUrl);
  return {
    importer: {
      name: "Alan Watts Wisdom URL Importer",
      version: VERSION,
      importedAt,
    },
    source,
    asset: {
      type: inferredType,
      title,
      slug: slugify(`${title}-${new URL(source.finalUrl).host}`),
      description: "Imported non-HTML asset awaiting editorial review.",
      author: null,
      publishedDate: null,
      language: null,
    },
    verification: {
      status: "Source not yet confirmed",
      notes: ["Imported automatically from a public URL. Review provenance and rights before publishing."],
    },
    media: { audio: [], video: [], images: [] },
    transcript: { status: "Not detected", wordCount: 0, excerpt: null, text: null },
    editorial: {
      recommendedCollection: recommendCollection(inferredType),
      topics: [],
      nextActions: ["Download and inspect the file manually.", "Record owner, edition, source URL, and rights notes."],
    },
    raw: { headings: [], jsonLdTypes: [], jsonLd: [] },
  };
}

function stripUnsafeBlocks(html) {
  return html
    .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ");
}

function tagText(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? normalizeWhitespace(decodeEntities(stripTags(match[1]))) : null;
}

function firstText(html, tag) {
  return tagText(html, tag);
}

function firstParagraph(html) {
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalizeWhitespace(decodeEntities(stripTags(match[1]))))
    .filter((item) => item.length > 60);
  return paragraphs[0] ?? null;
}

function meta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${escaped}["'])([^>]*)>`, "i");
  const match = html.match(pattern);
  return match ? normalizeWhitespace(decodeEntities(attr(match[1], "content") ?? "")) || null : null;
}

function attrFromFirst(html, tag, name, requiredPattern = null) {
  const pattern = new RegExp(`<${tag}\\b([^>]*)>`, "gi");
  for (const match of html.matchAll(pattern)) {
    if (requiredPattern && !requiredPattern.test(match[0])) continue;
    const value = attr(match[1], name);
    if (value) return decodeEntities(value);
  }
  return null;
}

function attr(source, name) {
  const match = source.match(new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function extractMedia(html, baseUrl) {
  const urls = [...html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi)]
    .map((match) => absolutize(decodeEntities(match[2]), baseUrl))
    .filter(Boolean);
  const unique = [...new Set(urls)];
  return {
    audio: unique.filter((url) => /\.(mp3|m4a|wav|ogg)(?:[?#].*)?$/i.test(url)),
    video: unique.filter((url) => /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url) || /youtube\.com|youtu\.be|vimeo\.com/i.test(url)),
    images: unique.filter((url) => /\.(jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$/i.test(url)).slice(0, 20),
  };
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      try {
        const parsed = JSON.parse(decodeEntities(match[1]).trim());
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    });
}

function jsonLdValue(html, key) {
  const blocks = jsonLdBlocks(html);
  for (const block of blocks) {
    const value = block?.[key];
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && typeof value.name === "string") return value.name;
    if (Array.isArray(value) && value[0]?.name) return value[0].name;
  }
  return null;
}

function bestBodyText(html) {
  const candidates = ["article", "main", "body"].map((tag) => tagText(html, tag)).filter(Boolean);
  const text = candidates.sort((a, b) => b.length - a.length)[0] ?? normalizeWhitespace(decodeEntities(stripTags(html)));
  return text.replace(/\s+/g, " ").trim();
}

function inferTranscriptText({ type, bodyText }) {
  if (!bodyText || bodyText.length < 1000) return null;
  if (["lecture", "transcript", "video", "article"].includes(type)) return bodyText;
  return null;
}

function inferAssetType({ title, description, bodyText, media, jsonLd, source }) {
  const haystack = `${title} ${description} ${source.finalUrl}`.toLowerCase();
  const jsonTypes = jsonLd.map((entry) => String(entry["@type"] ?? "").toLowerCase()).join(" ");
  if (haystack.includes("transcript") || haystack.includes("/document/")) return "transcript";
  if (media.audio.length || haystack.includes("lecture")) return "lecture";
  if (media.video.length || jsonTypes.includes("videoobject")) return "video";
  if (jsonTypes.includes("book") || haystack.includes("book")) return "book";
  if (bodyText.length > 2500 || jsonTypes.includes("article") || jsonTypes.includes("newsarticle")) return "article";
  return "resource";
}

function inferBinaryType(contentType, url) {
  if (contentType.includes("audio") || /\.(mp3|m4a|wav|ogg)$/i.test(url)) return "lecture";
  if (contentType.includes("video") || /\.(mp4|webm|mov|m4v)$/i.test(url)) return "video";
  if (contentType.includes("pdf") || /\.pdf$/i.test(url)) return "resource";
  return "resource";
}

function recommendCollection(type) {
  const map = {
    lecture: "/lectures/",
    transcript: "/transcripts/",
    video: "/videos/",
    book: "/books/",
    article: "/essays/",
    resource: "/resources/",
  };
  return map[type] ?? "/resources/";
}

function readableName(url) {
  const parsed = new URL(url);
  const last = parsed.pathname.split("/").filter(Boolean).at(-1) || parsed.host;
  return decodeURIComponent(last).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}

function absolutize(value, baseUrl) {
  if (!value || value.startsWith("data:") || value.startsWith("mailto:") || value.startsWith("tel:")) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}
