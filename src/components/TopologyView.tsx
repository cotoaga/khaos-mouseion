'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildTopology,
  edgeKey,
  initSimulation,
  tick,
  type PinakesBook,
  type SimState,
  type Topology,
} from '@/lib/topology';

type LensName = 'themes' | 'bipartite';

interface Selection {
  label: string;
  sublabel: string;
  bookIdx: number[];
}

const WIDTH = 1100;
const HEIGHT = 720;

const KIND_COLOR: Record<string, string> = {
  theme: 'var(--green)',
  category: 'var(--blue)',
};

export default function TopologyView() {
  const [books, setBooks] = useState<PinakesBook[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lens, setLens] = useState<LensName>('themes');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [, setFrame] = useState(0); // render pump for the sim
  const rafRef = useRef<number>(0);

  useEffect(() => {
    fetch('/pinakes.json')
      .then(r => {
        if (!r.ok) throw new Error(`pinakes.json: ${r.status}`);
        return r.json();
      })
      .then(data => setBooks(data.books as PinakesBook[]))
      .catch(e => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const topology: Topology | null = useMemo(
    () => (books ? buildTopology(books) : null),
    [books]
  );

  // sim derives from data + lens; initSimulation is deterministic (hash-seeded)
  const sim: SimState | null = useMemo(() => {
    if (!topology) return null;
    const activeLens = lens === 'themes' ? topology.themeLens : topology.bipartiteLens;
    return initSimulation(activeLens, WIDTH, HEIGHT);
  }, [topology, lens]);

  // physics loop: tick the current sim, pump renders while it is hot
  useEffect(() => {
    if (!sim) return;
    const loop = () => {
      if (sim.alpha > 0.005) {
        tick(sim);
        setFrame(f => f + 1);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sim]);

  const selectNode = useCallback((id: string) => {
    if (!topology) return;
    const idx = topology.members.get(id) ?? [];
    const node = sim?.index.get(id);
    setSelection({
      label: id,
      sublabel: `${node?.kind === 'category' ? 'category' : 'theme'} · ${idx.length} books`,
      bookIdx: idx,
    });
  }, [topology, sim]);

  const selectEdge = useCallback((a: string, b: string) => {
    if (!topology) return;
    const idx = topology.members.get(edgeKey(a, b)) ?? [];
    setSelection({
      label: `${a} × ${b}`,
      sublabel: `${idx.length} books constitute this edge`,
      bookIdx: idx,
    });
  }, [topology]);

  if (error) {
    return (
      <p className="p-8 text-sm" style={{ color: 'var(--grey-light)' }}>
        Topology unavailable — {error}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LensButton active={lens === 'themes'} onClick={() => { setLens('themes'); setSelection(null); }}>
          Theme currents
        </LensButton>
        <LensButton active={lens === 'bipartite'} onClick={() => { setLens('bipartite'); setSelection(null); }}>
          Territories × currents
        </LensButton>
        <span className="text-xs" style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-mono, monospace)' }}>
          {lens === 'themes'
            ? 'PMI-weighted co-occurrence — edges are chance-corrected'
            : 'lift-filtered category–theme edges (≥1.5× expected)'}
        </span>
      </div>

      <div className="flex gap-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="min-w-0 flex-1 rounded-lg"
          style={{ background: 'var(--charcoal)', border: '1px solid var(--grey-dark)' }}
          role="img"
          aria-label="Force-directed graph of library categories and themes"
        >
          {sim && sim.links.map(l => {
            const s = sim.index.get(l.source)!;
            const t = sim.index.get(l.target)!;
            return (
              <line
                key={`${l.source}|${l.target}`}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="var(--cyan)"
                strokeOpacity={0.12 + l.weight * 0.45}
                strokeWidth={0.6 + l.weight * 3}
                style={{ cursor: 'pointer' }}
                onClick={() => selectEdge(l.source, l.target)}
              />
            );
          })}
          {sim && sim.nodes.map(n => (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => selectNode(n.id)}
            >
              <circle
                r={n.r}
                fill={KIND_COLOR[n.kind]}
                fillOpacity={selection?.label === n.id ? 0.95 : 0.75}
                stroke={selection?.label === n.id ? 'var(--white)' : 'transparent'}
                strokeWidth={1.5}
              />
              <text
                dy={-n.r - 4}
                textAnchor="middle"
                fontSize={10}
                fill="var(--grey-light)"
                fontFamily="var(--font-mono, monospace)"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {n.id}
              </text>
            </g>
          ))}
        </svg>

        <aside
          className="w-80 shrink-0 overflow-y-auto rounded-lg p-4"
          style={{ background: 'var(--charcoal)', border: '1px solid var(--grey-dark)', maxHeight: HEIGHT }}
        >
          {selection && books ? (
            <>
              <h2
                className="text-lg font-semibold"
                style={{ color: 'var(--green)', fontFamily: 'var(--font-space-grotesk, inherit)' }}
              >
                {selection.label}
              </h2>
              <p className="mb-3 text-xs" style={{ color: 'var(--grey-light)' }}>
                {selection.sublabel}
              </p>
              <ul className="space-y-2">
                {selection.bookIdx.map(i => (
                  <li key={i} className="text-sm leading-snug">
                    <span style={{ color: 'var(--white)' }}>{books[i].title}</span>
                    <span style={{ color: 'var(--grey-light)' }}> — {books[i].author}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--grey-light)' }}>
              {books
                ? 'Click a node or an edge. Nodes are territories (blue) and currents (green); edges are the books that bind them.'
                : 'Loading catalog…'}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function LensButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded px-3 py-1.5 text-sm transition-colors"
      style={{
        background: active ? 'var(--green)' : 'var(--grey-dark)',
        color: active ? 'var(--black)' : 'var(--grey-light)',
        fontFamily: 'var(--font-space-grotesk, inherit)',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}
