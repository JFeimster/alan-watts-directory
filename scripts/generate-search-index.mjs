import { writeFile } from "node:fs/promises";
import {
  books,
  collections,
  directoryPages,
  essays,
  lectures,
  quotes,
  resourceCategories,
  topics,
  videos,
} from "../app/content.ts";

const records = [
  ...topics.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/topics/${item.slug}/`,
    type: "Topic",
    topics: [item.slug],
  })),
  ...lectures.map((item) => ({
    title: item.title,
    description: item.summary,
    href: `/lectures/${item.slug}/`,
    type: "Lecture",
    topics: item.topics,
    series: item.series,
    transcript: item.transcript,
    audio: Boolean(item.audio),
  })),
  ...collections.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/collections/${item.slug}/`,
    type: "Collection",
    topics: [],
  })),
  ...books.map((item) => ({
    title: item.title,
    description: item.overview,
    href: `/books/${item.slug}/`,
    type: "Book",
    topics: item.topics,
    book: item.title,
  })),
  ...quotes.map((item) => ({
    title: item.title,
    description: item.quotation ?? "Quotation withheld pending exact source verification.",
    href: `/quotes/${item.slug}/`,
    type: "Quote",
    topics: item.topics,
    verification: item.verification,
  })),
  ...essays.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/essays/${item.slug}/`,
    type: "Essay",
    topics: item.topics,
  })),
  ...videos.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/videos/${item.slug}/`,
    type: "Video",
    topics: item.topics,
    video: true,
  })),
  ...resourceCategories.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/resources/${item.slug}/`,
    type: "Resource",
    topics: [],
    verification: item.verification,
  })),
  ...directoryPages.map((item) => ({
    title: item.title,
    description: item.description,
    href: item.path,
    type: "Section",
    topics: [],
  })),
];

await writeFile(
  new URL("../public/search-index.json", import.meta.url),
  `${JSON.stringify(records, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${records.length} search records.`);
