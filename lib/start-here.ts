import fs from "node:fs";
import path from "node:path";

export type StartHereRecord = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "preview" | "planned";
  order: number;
  cta: string;
  intro: string;
  sections: Array<{ label: string; text: string }>;
};

const directory = path.join(process.cwd(), "data", "start-here");

export function getStartHereRecords(): StartHereRecord[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .map((name) =>
      JSON.parse(
        fs.readFileSync(path.join(directory, name), "utf8"),
      ) as StartHereRecord,
    )
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getStartHereRecord(slug: string): StartHereRecord | null {
  const filePath = path.join(directory, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as StartHereRecord;
}
