import type { Metadata } from "next";
import { IndexBuildingPage } from "@/components/content/IndexBuildingPage";
import { getHomepageData } from "@/lib/home";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Browse Alan Watts book records, editions, publication context, and related source material when supported.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  const module = getHomepageData().libraryModules.find((item) => item.label === "Books");
  return (
    <IndexBuildingPage
      eyebrow="PUBLICATION INDEX"
      title="BOOKS"
      description="Book records will distinguish titles, editions, publication information, and supported relationships rather than filling the directory with prototype data."
      count={module?.count ?? 0}
      recordLabel="BOOK RECORDS"
      related={[
        { label: "START HERE", href: "/start-here" },
        { label: "LECTURES", href: "/lectures" },
        { label: "QUOTES", href: "/quotes" },
        { label: "SOURCES", href: "/about/sources-and-attribution" },
      ]}
    />
  );
}
