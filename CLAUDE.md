# KHAOS-Mouseion — Standing Tactical Calibration

**Aesthetic:** Klein Bottle Green (`#00A86B`) + Deep Space Blue (`#0088FF`) on near-absolute-zero black (`#0A0A0A`). Sharp edges. This is Cotoaga.AI — not the rounded Cotoaga.NET legacy.

**Linear:** Team `CotoagaDotNet`. Issues are source of truth for work state. Pre-push summary as a Linear comment on the active issue before every push.

---

## Surgical Discipline

Every changed line traces to the active directive. No drive-by refactors. No comment massage. No "while I'm here" cleanup. If something unrelated needs fixing, open a Linear comment on the active issue — don't fix it in this commit.

## Orphan Rules

Remove only imports/symbols YOUR changes orphaned. Pre-existing dead code: flag in a Linear comment, never delete.

## Atomic Commits

Conventional format: `feat|fix|refactor|docs|chore(scope): description`. One concern per commit. No omnibus commits. Pre-push summary in Linear comment on the active issue.

## No Drive-By Abstractions

Do not extract until the second use case lands. No premature interfaces. No speculative generality. Three similar lines beats a premature abstraction.

## Test Discipline

Tests live with their feature. No zero-test green theater. If no test suite exists at the time of a feature commit, the feature commit creates meaningful tests for that feature.

## Avoid Unless Justified

- Microservices for small teams
- Kubernetes for everything
- Event sourcing everywhere
- Abstraction before second use case

## Stack

Next.js App Router · TypeScript · Tailwind · Supabase SSR (`lib/supabase/`) · Vercel

Deploy target: `khaos-mouseion.cotoaga.ai`
