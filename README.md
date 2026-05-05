# KHAOS-Mouseion

A curated knowledge collection — the cosmological foyer of the KHAOS ecosystem.

**Ask Hypatia (and not Cyril).**

## What it is

KHAOS-Mouseion warehouses and surfaces a personal library of 1,465+ books, organized by category, theme, and medium. It is the institutional heir to the Knowledge Galaxy gem at `gems.cotoaga.ai/knowledge-galaxy`, promoted to sovereign manifold with its own subdomain and presentation logic.

## Stack

- Next.js (App Router, TypeScript, Tailwind)
- Supabase (SSR pattern, `src/lib/supabase/`)
- Vercel

## Local dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy target

`khaos-mouseion.cotoaga.ai`

## Data

`data/library_enriched_v1_1.csv` — 1,465 books, source of truth (v1.1)
`data/library_taxonomy_v1_1.md` — taxonomy schema (v1.1)

UI for browsing is v2. Data is warehoused and version-controlled in v1.
