import { promises as fs } from "node:fs";
import path from "node:path";

export type JsonObject = Record<string, unknown>;

export const projectRoot = process.cwd();
export const gptDataRoot = path.join(projectRoot, "data", "gpts");
export const recordsRoot = path.join(gptDataRoot, "records");
export const automationRoot = path.join(gptDataRoot, "automation");
export const snapshotsRoot = path.join(gptDataRoot, "snapshots");

export async function ensureDirectories(): Promise<void> {
  await Promise.all([
    fs.mkdir(recordsRoot, { recursive: true }),
    fs.mkdir(automationRoot, { recursive: true }),
    fs.mkdir(snapshotsRoot, { recursive: true }),
  ]);
}

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

export async function writeJson(
  filePath: string,
  value: unknown,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function listRecordPaths(): Promise<string[]> {
  const entries = await fs.readdir(recordsRoot);
  return entries
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => path.join(recordsRoot, entry));
}

export function clean(value?: string | null): string {
  return (value ?? "").trim();
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function now(): string {
  return new Date().toISOString();
}

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "AlanWattsWisdomDirectory/1.0 (+public listing maintenance)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function decodeHtml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

export function extractMeta(
  html: string,
  key: string,
): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return null;
}

export function extractCanonical(html: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  );
  return match?.[1] ? decodeHtml(match[1]) : null;
}

export function extractTitle(html: string): string | null {
  return (
    extractMeta(html, "og:title") ??
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ??
    null
  );
}

export function extractConversationStarters(html: string): string[] {
  const candidates = new Set<string>();
  const patterns = [
    /"conversation_starters"\s*:\s*(\[[\s\S]*?\])/g,
    /"conversationStarters"\s*:\s*(\[[\s\S]*?\])/g,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      try {
        const parsed = JSON.parse(match[1]) as unknown;
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === "string" && item.trim()) {
              candidates.add(item.trim());
            }
          }
        }
      } catch {
        // The serialized page may escape JSON. Leave it for editorial review.
      }
    }
  }

  return [...candidates].slice(0, 12);
}

export function pickChatGptUrl(values: string[]): string | null {
  for (const value of values) {
    const match = value.match(
      /https:\/\/chatgpt\.com\/g\/g-[A-Za-z0-9-]+(?:-[^\s"'<>]+)?/i,
    );
    if (match?.[0]) return match[0].replace(/[),.;]+$/, "");
  }

  return null;
}
