import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  ensureDirectories,
  listRecordPaths,
  readJson,
  writeJson,
} from "./gpt-automation-lib";

type RecordShape = {
  slug: string;
  name: string;
  image?: {
    localPath?: string | null;
    status?: string;
    [key: string]: unknown;
  };
};

const palette = [
  ["#253c35", "#f4efe4"],
  ["#49342b", "#f4efe4"],
  ["#2d3448", "#f4efe4"],
  ["#594b2f", "#f4efe4"],
  ["#303a2c", "#f4efe4"],
];

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "AW"
  );
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function main(): Promise<void> {
  await ensureDirectories();

  const outputRoot = path.join(
    process.cwd(),
    "public",
    "gpts",
    "avatars",
  );
  await fs.mkdir(outputRoot, { recursive: true });

  const paths = await listRecordPaths();

  for (const filePath of paths) {
    const record = await readJson<RecordShape>(filePath);
    const digest = createHash("sha256").update(record.slug).digest();
    const [background, foreground] = palette[digest[0] % palette.length];
    const letters = initials(record.name);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="${escapeXml(record.name)}">
  <rect width="320" height="320" rx="56" fill="${background}"/>
  <circle cx="250" cy="70" r="80" fill="rgba(255,255,255,0.07)"/>
  <text x="160" y="188" text-anchor="middle" font-family="Georgia,serif" font-size="112" font-weight="700" letter-spacing="-8" fill="${foreground}">${escapeXml(letters)}</text>
</svg>
`;

    const filename = `${record.slug}.svg`;
    await fs.writeFile(path.join(outputRoot, filename), svg, "utf8");

    record.image ??= {};
    record.image.localPath = `/gpts/avatars/${filename}`;
    if (!record.image.status || record.image.status === "temporary-signed-url") {
      record.image.status = "directory-placeholder";
    }

    await writeJson(filePath, record);
  }

  console.log(`Generated ${paths.length} local GPT avatar placeholders.`);
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
