# Aesthetic Audit — KHAOS-Mouseion vs Style Seed v2.1

**Date:** 2026-05-14
**Seeds pinned:** `../khaos-seeds/seed-style.md` v2.1 (Style), `../khaos-seeds/seed-multiverse.md` v1.0 (Multiverse, doctrine only — not audited).
**Scope:** Mouseion's current visual state at HEAD vs (a) the shared Layer 1 foundation in the Style Seed, and (b) the KHAOS Layer 2 brand chapter (the "far shore" if Mouseion were to wear KHAOS).
**Out of scope:** Layer 2 cotoaga.ai chapter, cotoaga.net, Be-Part-Of, APEX, AI Workshops. The audit only contrasts Mouseion-as-KHAOS against Mouseion's current state — because Kurt's brand-axis decision is the question this audit feeds into.
**No recommendations.** This is a conformance map, not a redesign proposal. The decision (Q1, parked at the end) belongs to Kurt after he reads it.

---

## Current Mouseion aesthetic — observed state

Pulled from `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, the landing-page tesseract hero, and the existing CLAUDE.md (pre-COT-52) declaration *"This is Cotoaga.AI — not the rounded Cotoaga.NET legacy."*

**Palette tokens (`src/app/globals.css`)**

| Token | Value | Source-of-truth identity |
|---|---|---|
| `--green` | `#00A86B` | cotoaga.ai Layer 2 — primary action |
| `--blue` | `#0088FF` | cotoaga.ai Layer 2 — interactive / hero (light theme) |
| `--cyan` | `#00D4FF` | cotoaga.ai Layer 2 — accent / code |
| `--black` | `#0A0A0A` | ≈ KHAOS Layer 2 `--khaos-black: #0B0B0B` (1 unit off — Mouseion-local) |
| `--charcoal` | `#1A1A1A` | Mouseion-local. Not in cotoaga.ai or KHAOS palettes |
| `--grey-dark` | `#2D2D2D` | cotoaga.ai `--cotoaga-ai-grey-dark` |
| `--grey` | `#4A4A4A` | cotoaga.ai `--cotoaga-ai-grey` / KHAOS `--khaos-grey` |
| `--grey-light` | `#8A8A8A` | cotoaga.ai `--cotoaga-ai-grey-light` / KHAOS `--khaos-grey-light` |
| `--white` | `#FAFAFA` | ≈ cotoaga.ai `--cotoaga-ai-white: #FAFBFB` / KHAOS `--khaos-white: #FAFBFB` (1 channel off — Mouseion-local) |
| `--brand-primary` etc. | green/blue/grey-dark light theme | cotoaga.ai light-theme tokens, used by `/pinakes`, `/cyril`, `/collection` |

**Body register**

- Dark background (`--black` near-monochrome, not cotoaga.ai's `#191A2E` deep-sky).
- Cotoaga.ai accent palette (green/blue/cyan) layered over the near-black ground.
- Sharp edges throughout — no `border-radius` on the Mouseion landing, the tesseract is geometric.

**Typography**

- `Inter` (variable `--font-inter`) — body
- `Space Grotesk` (variable `--font-space-grotesk`) — display, used for "KHAOS-MOUSEION" hero + CTAs
- `JetBrains Mono` (variable `--font-mono`) — mono surfaces (the catalog tables in `/pinakes` and `/cyril`)
- Aviano: **not loaded.** The wordmark "KHAOS-MOUSEION" on `/` is Space Grotesk, not Aviano Black.

**Components**

- Hero: 4D tesseract (`AnimatedTesseract.tsx`) animated in green stroke.
- Buttons: solid green primary + outlined blue secondary. Uppercase, wide tracking (`tracking-widest`), Space Grotesk.
- Tables (`/pinakes`): light-theme cards on grey-dark text, JetBrains Mono for data cells.
- Sharp edges (no `rounded-*` utility classes spotted on the landing or whose-it routes).
- One light theme route family (`/pinakes`, `/cyril`, `/collection`) inside the same dark-theme repo — declared via the secondary `:root` block in globals.css.

---

## Layer 1 — Shared Foundation Conformance

The Layer 1 foundation in Style Seed v2.1 (`../khaos-seeds/seed-style.md` lines 74–561) applies to every brand. This is the audit that has to pass regardless of which Layer 2 chapter Mouseion ends up wearing.

| Foundation primitive | Seed expectation | Mouseion current | Gap |
|---|---|---|---|
| **Spacing system** | 8px grid: 4 / 8 / 16 / 24 / 32 / 48 / 64. CSS vars `--space-xs … --space-3xl`. | No `--space-*` vars declared. Tailwind defaults used inline (`px-6 py-16`, `gap-6`, `mb-12`). | **Gap.** Foundation spacing vars not declared. Tailwind values *happen to* be 8px multiples in most current uses but the discipline isn't anchored. |
| **Typography scale** | Hero 3rem / Section 2rem / Card 1.5rem / Subtitle 1.25rem / Lead 1.125rem / Body 1rem / UI 0.875rem / Caption 0.75rem. | Landing hero `text-5xl md:text-7xl` (3rem/4.5rem) — close but not exact. No declared scale tokens. | **Gap.** Type scale tokens not declared as CSS vars. Hero size is in seed's neighborhood; smaller scale steps not aligned. |
| **Line heights** | `--leading-tight: 1.2`, `--leading-normal: 1.6`, `--leading-relaxed: 1.8`. | No `--leading-*` vars. `leading-relaxed` Tailwind utility used on landing copy. | **Gap.** Line-height vocabulary not anchored. |
| **Letter spacing** | Hero `-0.02em`; buttons/badges `0.05em`; rest 0. | Hero `tracking-[0.2em]` — *wider* than seed's `-0.02em` (which would tighten, not widen). Buttons `tracking-widest` (≈ `0.1em`) — also wider than seed's `0.05em`. | **Gap.** Hero tracking explicitly wide (`0.2em`) rather than tight (`-0.02em`). |
| **Font roles** | Components reference `--font-display` / `--font-primary` / `--font-mono`, not families. | Components reference `--font-space-grotesk` / `--font-inter` / `--font-mono` (family-named vars, not role-named). | **Gap.** Role names not used; family names hard-coded into component style attributes. |
| **Edge treatment** | `border-radius: 0` for sharp-edged brands (every brand except Be-Part-Of). | Sharp edges observed; no `rounded-*` on landing. Pinakes/Cyril tables visually sharp too. | **OK.** Effective conformance; not explicitly declared via `--brand-radius`. |
| **Transitions** | `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` as the only easing. | Landing CTAs use `transition-opacity` (Tailwind default ease + duration). Tesseract uses linear 25s. | **Gap.** Standard easing not declared; Tailwind's default `ease-in-out` not the seed's `cubic-bezier(0.4, 0, 0.2, 1)`. |
| **Hover patterns** | Cards/buttons: `translateY(-2px)` + shadow increase + border color shift. | Buttons: `hover:opacity-80` (opacity-only, no lift). No card-pattern hover. | **Gap.** Hover vocabulary differs — opacity vs translate. |
| **Containers** | `.container { max-width: 1400px; padding: 48px 24px }`. | No explicit container component; pages use `max-w-2xl`, `max-w-xl`, `max-w-md` inline. | **Gap.** Container primitive not declared. |
| **Component primitives** | `.section-card`, `.card`, `.btn-primary`, `.callout`, `.data-table`, `.badge` defined in Layer 1. | No declared component classes. Each page/component inlines via Tailwind utilities. | **Per directive (no abstraction yet).** The seed's classes are reference — not required to be declared. But three uses of a card pattern already exist (`/pinakes` summary card, `/cyril` table, etc.). Threshold approached but not crossed for this audit. |
| **Foundation Don'ts** | Don't use thick borders (2px+), don't skip hover effects, don't use hex outside CSS vars, don't mix brand tokens in a view. | `src/app/page.tsx` uses hex via CSS-var references (good); `--charcoal` is a Mouseion-local token not in any seed palette (gap); single-brand-token use per view (OK). | **Gap.** `--charcoal: #1A1A1A` is local Mouseion vocabulary; not in cotoaga.ai or KHAOS scales. |

**Foundation conformance summary:** *Partial.* The visual register *looks* foundation-compliant (sharp edges, three font roles, 8px-ish spacing) but the *vocabulary* of CSS variables, role names, and standard easing is not anchored. This is the cheap layer to fix — declare the foundation tokens in `globals.css`, no visual change required, alignment becomes auditable.

---

## KHAOS Layer 2 — Far-Shore Conformance

If the answer to Q1 is *"Mouseion wears KHAOS,"* what is the gap? Audited against `../khaos-seeds/seed-style.md` lines 988–1086.

| KHAOS Layer 2 primitive | Seed expectation | Mouseion current | Gap (Mouseion-as-KHAOS) |
|---|---|---|---|
| **Register** | Vision — boundary intelligence, complexity navigation. Cold-martial. | Mouseion's content register is *the Library of Alexandria* — knowledge stewardship, named after Hypatia, anti-Cyril. Adjacent to KHAOS-cold but with a warmer humanist seam. | **Tension.** Mouseion's narrative is warmer than KHAOS-cold-martial. The decoration may not need to track the register on this axis. |
| **Palette** | Monochrome by default: black / white / grey only. Accent reserved (electric violet candidate, TBD). | Green + blue + cyan accents prominent. Background near-black ≈ KHAOS. | **Major gap.** Mouseion runs the cotoaga.ai accent palette on a near-KHAOS background. KHAOS Layer 2 explicitly: *"KHAOS monochrome is for the ecosystem's own documentation and thinking tools."* |
| **Cross-brand flow rule** | *"When KHAOS produces artifacts that flow into cotoaga.ai or cotoaga.net, they adopt the receiving brand's color system. KHAOS monochrome is for the ecosystem's own documentation and thinking tools."* (Layer 3 Artifact Flow Rules, seed line 1491–1505 + KHAOS chapter line 1068.) | Mouseion's current palette declares cotoaga.ai shore wearing-KHAOS-ground — the reverse of the rule's direction. | **Major gap if Mouseion is a "thinking tool."** If Mouseion is a "destination surface" that consumes content from KHAOS, the rule says it adopts the destination's tokens — but then which destination? Internal to the KHAOS ecosystem, the rule is ambiguous. (Surfaces in Q1.) |
| **Wordmark** | Aviano Black for the primary mark; Aviano Sans for the subtitle (tracked small-caps). | `KHAOS-MOUSEION` set in Space Grotesk on the landing. No Aviano. | **Major gap.** Font for the primary mark is wrong if Mouseion is KHAOS. Aviano is a licensed insigne Design face — pipeline isn't web-distributable. |
| **Display font (`--font-display`)** | Aviano Sans / Aviano Black for headers; Space Grotesk for body/thinking voice. | Space Grotesk used for display (CTAs, hero) — which is KHAOS's *body* font, not display. | **Major gap.** Space Grotesk's role inverts vs KHAOS: it's display in cotoaga.ai but body in KHAOS. Mouseion uses it as display, matching cotoaga.ai's pattern. |
| **Body font (`--font-primary`)** | Space Grotesk. | Inter. | **Gap.** Body is Inter (cotoaga.ai) rather than Space Grotesk (KHAOS). |
| **Mono font (`--font-mono`)** | JetBrains Mono. | JetBrains Mono. | **OK.** Infrastructure consistency holds. |
| **Edge treatment** | `border-radius: 0`, weapons-grade, no softness. | Sharp edges observed. | **OK.** |
| **Color philosophy** | "Trusts contrast and typography to do the work, not color." | Mouseion uses bright green + blue + cyan accents as load-bearing visual signals. | **Major gap.** The Mouseion landing's whole CTA hierarchy is color-coded (green primary, blue secondary). KHAOS philosophy is contrast-and-typography first, color last and only with meaning. |
| **Component overrides** | Document headers: Aviano Sans, all-caps, tracked `0.08em`, 1px black rule line, 48px space below. | Mouseion landing headline: Space Grotesk, uppercase, `tracking-[0.2em]`. No rule line, large bottom margin. | **Partial gap.** Tracking and uppercase match the *gesture* of the KHAOS document-header pattern; font and rule-line do not. |
| **Body sections** | Space Grotesk, line height 1.8 (relaxed) — KHAOS docs are dense, extra air essential. | Inter body, `leading-relaxed` Tailwind utility (1.625). | **Partial gap.** Line height close (1.625 vs 1.8); font is wrong family for KHAOS. |
| **Callouts** | Black left border (4px), light grey background (`rgba(0,0,0,0.03)`), Space Grotesk italic. No color — border weight carries emphasis. | No callout component declared. The "Ask Hypatia (and not Cyril)" line is italic Inter, no border, grey color. | **Gap if needed.** Callout primitive not declared; the one italic line on the landing is the only candidate place that pattern would apply. |
| **Operational specs / code surfaces** | JetBrains Mono in dark code block, KHAOS-black bg, white text. | JetBrains Mono used in `/pinakes` and `/cyril` table cells (light-theme there). No dark code-block surface on the landing or `/whoami` is the first one. | **OK on `/whoami`** (uses JetBrains Mono on the dark ground). The light-theme routes are *not* a KHAOS surface either way. |

**KHAOS-shore conformance summary:** *Significant gap.* Mouseion currently presents as cotoaga.ai-palette over KHAOS-ground. Migrating to true KHAOS Layer 2 would require:

1. Drop the green/blue/cyan accents (or rebind them as semantic signals only, not decorative).
2. Acquire the Aviano license (insigne Design) and self-host Aviano Black + Aviano Sans for the wordmark and primary display.
3. Promote Space Grotesk to body, demote Inter (or remove it).
4. Add the document-header rule-line pattern; add a callout primitive with black-border / light-grey-bg / italic Space Grotesk.

The pipeline impact is non-trivial — Aviano is licensed and web-rendering requires careful self-hosting per the seed's font-pipeline note. This is a Cost line item that belongs in the Q1 decision.

---

## Gaps — consolidated

### Cheap (≤ 1 small PR)
- Declare Layer 1 foundation tokens in `src/app/globals.css`: `--space-*`, `--leading-*`, `--brand-radius: 0`, `--font-display` / `--font-primary` / `--font-mono` role-named alongside the existing family-named vars. No visual change.
- Anchor the standard easing as a CSS var: `--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`.
- Remove or repurpose the Mouseion-local `--charcoal: #1A1A1A` — it's not in any seed palette.

### Medium (≤ a moderate PR, brand-axis-dependent)
- Decide Mouseion's hover vocabulary: keep `hover:opacity-80` or switch to `translateY(-2px)` + shadow.
- Either declare `.section-card` / `.card` / `.btn-primary` component classes (when the third use lands) or commit to inline-Tailwind discipline with documented exceptions.
- Light theme inside `/pinakes`, `/cyril`, `/collection`: currently scoped via duplicate `:root` declarations in `globals.css`. The Style Seed's pattern is `[data-theme="dark"]` overlays on a single base. Restructure when light-theme touch-up next happens — not blocking.

### Expensive (Q1-dependent, do not act without decision)
- Migrate from cotoaga.ai palette to KHAOS monochrome.
- Acquire and self-host the Aviano family for the wordmark + display surface.
- Promote Space Grotesk to body / replace Inter.
- Build the KHAOS document-header rule-line + callout primitives.

### Doctrine-side gaps (out of audit scope, noted for completeness)
- `seed-multiverse.md` v1.0 was pinned in `CLAUDE.md` but its content (Layer 0 Kydroon, Layer 4 Cognitive Sovereignty) does not surface visually in Mouseion. It is doctrine reference. No gap is open against doctrine in this audit.

---

## Open Question — parked for Kurt

**Q1 — Brand axis.** Should Mouseion wear KHAOS monochrome (per *"dress code is set by the far shore"* — Style Seed v2.1, Artifact Flow Rules), keep its current Klein-Green / Deep-Space-Blue palette as a sanctioned KHAOS variant (explicitly outside the cross-brand flow rule, which would need ADR justification), or run a hybrid (foundation conformance via KHAOS, accents from cotoaga.ai because Mouseion's user-facing register reads warmer than KHAOS-cold)?

Awaiting decision before any restyle work. No PR may pre-emptively migrate Mouseion's palette, fonts, or wordmark while this question is open.

The cheap Layer 1 token-declaration work above is **decision-independent** and can land before Q1 resolves. The expensive KHAOS-shore migration is **strictly Q1-blocked**.
