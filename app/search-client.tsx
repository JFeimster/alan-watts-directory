"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SearchRecord = {
  title: string;
  description: string;
  href: string;
  type: string;
  topics: string[];
  book?: string;
  series?: string;
  transcript?: string;
  verification?: string;
  audio?: boolean;
  video?: boolean;
};

const filters = ["All", "Topic", "Lecture", "Collection", "Book", "Quote", "Essay", "Video"];

export function SearchInput() {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [audioOnly, setAudioOnly] = useState(false);
  const [videoOnly, setVideoOnly] = useState(false);
  const [topic, setTopic] = useState("All");
  const [book, setBook] = useState("All");
  const [series, setSeries] = useState("All");
  const [transcript, setTranscript] = useState("All");
  const [verification, setVerification] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    fetch("/search-index.json")
      .then((response) => response.json())
      .then((data) => {
        setRecords(data);
        if (params.get("audio") === "1" || params.get("media") === "audio") setAudioOnly(true);
        if (params.get("video") === "1") setVideoOnly(true);
      })
      .catch(() => setRecords([]));
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesType = type === "All" || record.type === type;
      const matchesAudio = !audioOnly || record.audio;
      const matchesVideo = !videoOnly || record.video;
      const matchesTopic = topic === "All" || record.topics.includes(topic);
      const matchesBook = book === "All" || record.book === book;
      const matchesSeries = series === "All" || record.series === series;
      const matchesTranscript = transcript === "All" || record.transcript === transcript;
      const matchesVerification = verification === "All" || record.verification === verification;
      const haystack = `${record.title} ${record.description} ${record.topics.join(" ")}`.toLowerCase();
      return matchesType && matchesAudio && matchesVideo && matchesTopic && matchesBook && matchesSeries && matchesTranscript && matchesVerification && (!needle || haystack.includes(needle));
    });
  }, [records, query, type, audioOnly, videoOnly, topic, book, series, transcript, verification]);

  const options = (field: "topics" | "book" | "series" | "transcript" | "verification") => {
    const values = records.flatMap((record) => {
      const value = record[field];
      return Array.isArray(value) ? value : value ? [value] : [];
    });
    return [...new Set(values)].sort();
  };

  return (
    <div className="search-interface">
      <label className="search-box">
        <span>Search the archive</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “ego”, “Zen”, or “authority”" />
        <kbd>⌕</kbd>
      </label>
      <FilterBar
        active={type}
        onChange={setType}
        audioOnly={audioOnly}
        setAudioOnly={setAudioOnly}
        videoOnly={videoOnly}
        setVideoOnly={setVideoOnly}
        selections={{ topic, book, series, transcript, verification }}
        setters={{ topic: setTopic, book: setBook, series: setSeries, transcript: setTranscript, verification: setVerification }}
        optionSets={{ topic: options("topics"), book: options("book"), series: options("series"), transcript: options("transcript"), verification: options("verification") }}
      />
      <p className="result-count" aria-live="polite">{results.length} {results.length === 1 ? "record" : "records"}</p>
      {results.length ? (
        <div className="search-results">
          {results.map((record) => (
            <Link href={record.href} key={record.href}>
              <span className="result-type">{record.type}</span>
              <div><h2>{record.title}</h2><p>{record.description}</p></div>
              <b>→</b>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state"><span>○</span><h3>No matching records.</h3><p>Try a broader term or remove a filter. A quiet archive is allowed to say “not found.”</p></div>
      )}
    </div>
  );
}

type SelectionKey = "topic" | "book" | "series" | "transcript" | "verification";

export function FilterBar({
  active,
  onChange,
  audioOnly,
  setAudioOnly,
  videoOnly,
  setVideoOnly,
  selections,
  setters,
  optionSets,
}: {
  active: string;
  onChange: (value: string) => void;
  audioOnly: boolean;
  setAudioOnly: (value: boolean) => void;
  videoOnly: boolean;
  setVideoOnly: (value: boolean) => void;
  selections: Record<SelectionKey, string>;
  setters: Record<SelectionKey, (value: string) => void>;
  optionSets: Record<SelectionKey, string[]>;
}) {
  return (
    <div className="filter-bar" aria-label="Search filters">
      <div>{filters.map((filter) => <button className={active === filter ? "active" : ""} onClick={() => onChange(filter)} key={filter}>{filter}</button>)}</div>
      <div className="filter-selects">
        {(["topic", "book", "series", "verification"] as SelectionKey[]).map((key) => (
          <label key={key}>
            {key === "series" ? "Lecture series" : key[0].toUpperCase() + key.slice(1)}
            <select value={selections[key]} onChange={(event) => setters[key](event.target.value)}>
              <option>All</option>
              {optionSets[key].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="filter-selects">
        <label>
          Transcript availability
          <select value={selections.transcript} onChange={(event) => setters.transcript(event.target.value)}>
            <option>All</option>
            {optionSets.transcript.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>
      <div className="availability-filters">
        <label><input type="checkbox" checked={audioOnly} onChange={(event) => setAudioOnly(event.target.checked)} /> Audio available</label>
        <label><input type="checkbox" checked={videoOnly} onChange={(event) => setVideoOnly(event.target.checked)} /> Video available</label>
      </div>
    </div>
  );
}
