# Alan Watts Wisdom

A static-first editorial archive built with Next.js App Router, TypeScript, Server Components, and a single client-side search island.

## Architecture

- Server-rendered routes and detail templates
- Typed content registries in `app/content.ts`
- Reusable editorial components in `app/components.tsx`
- Client search in `app/search-client.tsx`
- Static search data in `public/search-index.json`
- No database, authentication, CMS, or runtime API
- Sitemap, robots, manifest, canonical metadata, Open Graph, and JSON-LD-ready content shapes

## Route model

Index and detail routes exist for topics, lectures, collections, books, quotations, essays, and videos, plus Start Here, Search, About, Authenticity, Editorial Standards, and Sources.

The multi-segment archive is implemented through `app/[...slug]/page.tsx` with static params generated from the typed registries. This keeps the initial build compact while preserving clean portability to dedicated Next.js folders later.

## Content model

The seed registry contains:

- 12 topics
- 14 lecture records
- 4 editorial/source-led collections
- 6 book records
- 12 quotation research records
- 6 essays
- 6 videos

Historical fields permit explicit unknown or pending values. Quotation text is nullable so a research record can exist without publishing unverified wording. Contemporary essays and videos carry interpretation labels.

## URL importer

Use the local scraping utility to turn a public source page into a review-ready JSON record:

```sh
npm run import:url -- https://www.organism.earth/library/document/out-of-your-mind-1
```

Useful options:

```sh
npm run import:url -- <url> --type transcript
npm run import:url -- <url> --out data/imports/organism-earth
npm run import:url -- <url> --stdout
```

The importer extracts title, description, canonical URL, author/date signals, headings, JSON-LD, media links, and transcript-like body text. Output records are written to `data/imports/` by default and always start with `Source not yet confirmed` until a human reviews provenance, accuracy, and publication rights.

## Portability

This checkout is a Git repository and can be mirrored into a conventional GitHub repository. It builds to a Sites-compatible Vinext output and retains the same App Router, TypeScript, and static-data patterns expected for a future Vercel deployment.

Set `NEXT_PUBLIC_SITE_URL` to the final canonical production origin before a custom-domain launch.

## Current platform limitations

- The initial Sites deployment and a future Vercel deployment are separate hosting targets.
- Source registries are code-managed; no visual CMS workflow is included.
- Search loads a static JSON index and does not provide fuzzy ranking, typo tolerance, or server-side analytics.
- The route layer is compacted into one catch-all template; a larger repository may split every content type into dedicated route folders without changing public URLs.
- Full lecture audio can exceed static-hosting limits. Large supplied audio should be optimized for web playback or moved to durable media storage/CDN before publication.
