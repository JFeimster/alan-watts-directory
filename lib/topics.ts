import fs from "node:fs";
import path from "node:path";

export type TopicRecord = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "preview" | "planned";
  order: number;
  label?: string;
  editorialNote: string;
  relatedRoutes: string[];
};

const directory = path.join(process.cwd(), "data", "topics");

export function getTopics(): TopicRecord[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .map((name) =>
      JSON.parse(
        fs.readFileSync(path.join(directory, name), "utf8"),
      ) as TopicRecord,
    )
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getTopic(slug: string): TopicRecord | null {
  const filePath = path.join(directory, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as TopicRecord;
}
