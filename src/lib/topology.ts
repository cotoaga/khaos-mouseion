/**
 * Pinakes Topology — pure graph math over the library's two facets.
 *
 * Category = territory (exactly one per book).
 * Themes  = currents (up to five, ranked, per book).
 *
 * Two lenses:
 *  - themeLens:     45 theme nodes, edges = co-occurrence, PMI-weighted.
 *  - bipartiteLens: categories + themes, edges = shared books, lift-filtered.
 *
 * PMI over raw counts because raw counts collapse the layout into a star
 * around the giants (human-behavior|identity co-occurs in 178 books).
 * PMI asks "more than chance?" — the actual question.
 *
 * Physics is hand-rolled velocity-Verlet (~90 nodes, O(n²) is trivial):
 * zero dependencies, fully unit-testable, gems-ethos.
 */

export interface PinakesBook {
  title: string;
  author: string;
  released?: string;
  read?: string;
  medium?: string;
  category: string;
  themes: string[];
}

export type NodeKind = 'theme' | 'category';

export interface TopoNode {
  id: string;
  kind: NodeKind;
  books: number;
  /** display radius, derived from book count */
  r: number;
}

export interface TopoLink {
  source: string;
  target: string;
  /** number of books constituting this edge */
  books: number;
  /** normalized 0..1 display weight (from PMI or lift) */
  weight: number;
}

export interface Lens {
  nodes: TopoNode[];
  links: TopoLink[];
}

export interface Topology {
  themeLens: Lens;
  bipartiteLens: Lens;
  /** book lookup: node id or 'a | b' edge key -> book indices */
  members: Map<string, number[]>;
}

const THEME_MIN_COOC = 3;
const BIPARTITE_MIN_COUNT = 2;
const BIPARTITE_MIN_LIFT = 1.5;

function radius(books: number): number {
  return 5 + Math.sqrt(books) * 1.6;
}

export function edgeKey(a: string, b: string): string {
  return a < b ? `${a} | ${b}` : `${b} | ${a}`;
}

export function pmi(coocCount: number, freqA: number, freqB: number, total: number): number {
  if (coocCount === 0 || freqA === 0 || freqB === 0) return -Infinity;
  return Math.log2((coocCount / total) / ((freqA / total) * (freqB / total)));
}

export function lift(observed: number, freqA: number, freqB: number, total: number): number {
  const expected = (freqA * freqB) / total;
  return expected === 0 ? 0 : observed / expected;
}

export function buildTopology(books: PinakesBook[]): Topology {
  const N = books.length;
  const themeFreq = new Map<string, number>();
  const catFreq = new Map<string, number>();
  const cooc = new Map<string, number>();
  const catTheme = new Map<string, number>();
  const members = new Map<string, number[]>();

  const addMember = (key: string, idx: number) => {
    const arr = members.get(key);
    if (arr) arr.push(idx);
    else members.set(key, [idx]);
  };

  books.forEach((b, idx) => {
    if (b.category) {
      catFreq.set(b.category, (catFreq.get(b.category) ?? 0) + 1);
      addMember(b.category, idx);
    }
    for (const t of b.themes) {
      themeFreq.set(t, (themeFreq.get(t) ?? 0) + 1);
      addMember(t, idx);
      if (b.category) {
        const k = edgeKey(b.category, t);
        catTheme.set(k, (catTheme.get(k) ?? 0) + 1);
        addMember(k, idx);
      }
    }
    const ts = [...b.themes].sort();
    for (let i = 0; i < ts.length; i++) {
      for (let j = i + 1; j < ts.length; j++) {
        const k = edgeKey(ts[i], ts[j]);
        cooc.set(k, (cooc.get(k) ?? 0) + 1);
        addMember(k, idx);
      }
    }
  });

  // --- theme lens: PMI-weighted co-occurrence ---
  const themeNodes: TopoNode[] = [...themeFreq.entries()].map(([id, n]) => ({
    id, kind: 'theme', books: n, r: radius(n),
  }));

  const rawThemeLinks = [...cooc.entries()]
    .filter(([, c]) => c >= THEME_MIN_COOC)
    .map(([k, c]) => {
      const [a, b] = k.split(' | ');
      return { a, b, c, pmi: pmi(c, themeFreq.get(a)!, themeFreq.get(b)!, N) };
    })
    .filter(l => l.pmi > 0);

  const maxPmi = rawThemeLinks.reduce((m, l) => Math.max(m, l.pmi), 1);
  const themeLinks: TopoLink[] = rawThemeLinks.map(l => ({
    source: l.a, target: l.b, books: l.c, weight: l.pmi / maxPmi,
  }));

  // --- bipartite lens: lift-filtered category–theme edges ---
  const catNodes: TopoNode[] = [...catFreq.entries()].map(([id, n]) => ({
    id, kind: 'category', books: n, r: radius(n),
  }));

  const rawBiLinks = [...catTheme.entries()]
    .filter(([, c]) => c >= BIPARTITE_MIN_COUNT)
    .map(([k, c]) => {
      const [a, b] = k.split(' | ');
      // one side is a category, the other a theme — edgeKey sorted them
      const cat = catFreq.has(a) ? a : b;
      const theme = cat === a ? b : a;
      return { cat, theme, c, lift: lift(c, catFreq.get(cat)!, themeFreq.get(theme)!, N) };
    })
    .filter(l => l.lift >= BIPARTITE_MIN_LIFT);

  const maxLift = rawBiLinks.reduce((m, l) => Math.max(m, l.lift), 1);
  const biLinks: TopoLink[] = rawBiLinks.map(l => ({
    source: l.cat, target: l.theme, books: l.c, weight: l.lift / maxLift,
  }));

  // bipartite lens keeps only nodes with at least one surviving edge
  const connected = new Set<string>();
  biLinks.forEach(l => { connected.add(l.source); connected.add(l.target); });

  return {
    themeLens: { nodes: themeNodes, links: themeLinks },
    bipartiteLens: {
      nodes: [...catNodes, ...themeNodes].filter(n => connected.has(n.id)),
      links: biLinks,
    },
    members,
  };
}

// ------------------------------------------------------------------
// Force simulation — velocity Verlet, deterministic seeding.
// ------------------------------------------------------------------

export interface SimNode extends TopoNode {
  x: number; y: number; vx: number; vy: number;
}

export interface SimState {
  nodes: SimNode[];
  links: TopoLink[];
  /** cooling factor, decays each tick */
  alpha: number;
  width: number;
  height: number;
  index: Map<string, SimNode>;
}

/** deterministic pseudo-random from string — stable initial layout */
export function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function initSimulation(lens: Lens, width: number, height: number): SimState {
  const nodes: SimNode[] = lens.nodes.map(n => ({
    ...n,
    x: width * (0.15 + 0.7 * hash01(n.id)),
    y: height * (0.15 + 0.7 * hash01(n.id + '#y')),
    vx: 0, vy: 0,
  }));
  return {
    nodes,
    links: lens.links,
    alpha: 1,
    width,
    height,
    index: new Map(nodes.map(n => [n.id, n])),
  };
}

const REPULSION = 2600;
const SPRING = 0.06;
const CENTER_PULL = 0.012;
const DAMPING = 0.82;
const ALPHA_DECAY = 0.985;
const MAX_V = 14;

/** One physics tick. Mutates state; returns it for chaining. */
export function tick(state: SimState): SimState {
  const { nodes, links, index, width, height } = state;
  const a = state.alpha;

  // pairwise repulsion (n ~ 90 → 4k pairs, trivial)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const p = nodes[i], q = nodes[j];
      let dx = p.x - q.x, dy = p.y - q.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) { dx = hash01(p.id + q.id) - 0.5; dy = 0.5 - hash01(q.id + p.id); d2 = 1; }
      const d = Math.sqrt(d2);
      const f = (REPULSION * a) / d2;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      p.vx += fx; p.vy += fy;
      q.vx -= fx; q.vy -= fy;
    }
  }

  // springs: stronger weight → shorter rest length, stiffer pull
  for (const l of links) {
    const s = index.get(l.source)!, t = index.get(l.target)!;
    const dx = t.x - s.x, dy = t.y - s.y;
    const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const rest = 60 + (1 - l.weight) * 160;
    const f = SPRING * a * (d - rest) * (0.4 + 0.6 * l.weight);
    const fx = (dx / d) * f, fy = (dy / d) * f;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  }

  // centering + integrate
  const cx = width / 2, cy = height / 2;
  for (const n of nodes) {
    n.vx += (cx - n.x) * CENTER_PULL * a;
    n.vy += (cy - n.y) * CENTER_PULL * a;
    n.vx = Math.max(-MAX_V, Math.min(MAX_V, n.vx * DAMPING));
    n.vy = Math.max(-MAX_V, Math.min(MAX_V, n.vy * DAMPING));
    n.x += n.vx;
    n.y += n.vy;
    // soft bounds
    n.x = Math.max(n.r, Math.min(width - n.r, n.x));
    n.y = Math.max(n.r, Math.min(height - n.r, n.y));
  }

  state.alpha *= ALPHA_DECAY;
  return state;
}
