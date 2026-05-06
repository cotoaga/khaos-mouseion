'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

interface Book {
  title: string;
  author: string;
  released: string;
  read: string;
  medium: string;
  category: string;
  themes: string[];
}

interface PinakesData {
  books: Book[];
  facets: { themes: string[]; categories: string[]; mediums: string[] };
}

type SortCol = 'title' | 'author' | 'released' | 'read';
const PAGE_SIZE = 10;

// ── Style constants ──────────────────────────────────────────────────────────

const facetBtnBase: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 12,
  padding: '4px 10px',
  borderRadius: 0,
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
  whiteSpace: 'nowrap' as const,
};
const facetOff: React.CSSProperties = { ...facetBtnBase, background: 'white', color: 'var(--brand-text-body)', border: '1px solid var(--brand-border)' };
const facetOn: React.CSSProperties = { ...facetBtnBase, background: 'var(--brand-primary)', color: 'white', border: '1px solid var(--brand-primary)' };
const actionBtn: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontSize: 11, padding: '2px 8px', border: '1px solid var(--brand-border)', background: 'transparent', color: 'var(--brand-text-secondary)', cursor: 'pointer', borderRadius: 0, textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
const thBase: React.CSSProperties = { padding: '12px 16px', color: 'white', fontFamily: 'var(--font-space-grotesk)', fontSize: 13, fontWeight: 600, textAlign: 'left', textTransform: 'uppercase' as const, letterSpacing: '0.05em', whiteSpace: 'nowrap' as const };
const thSort: React.CSSProperties = { ...thBase, cursor: 'pointer', userSelect: 'none' as const };
const td: React.CSSProperties = { padding: '10px 16px', color: 'var(--brand-text-body)', verticalAlign: 'top', maxWidth: 220 };
const tdMono: React.CSSProperties = { ...td, fontFamily: 'var(--font-mono)', fontSize: 13 };
const chip = (bg: string, color: string, border: string): React.CSSProperties => ({ fontFamily: 'var(--font-inter)', fontSize: 11, padding: '2px 6px', background: bg, color, border: `1px solid ${border}`, display: 'inline-block', whiteSpace: 'nowrap' as const, borderRadius: 0, marginBottom: 2 });
const greenChip = chip('rgba(0,168,107,0.08)', 'var(--brand-primary)', 'rgba(0,168,107,0.2)');
const blueChip = chip('rgba(0,136,255,0.07)', 'var(--brand-accent)', 'rgba(0,136,255,0.2)');
const medChip = chip('rgba(0,0,0,0.04)', 'var(--brand-text-secondary)', 'var(--brand-border)');
const pageBtn = (disabled: boolean): React.CSSProperties => ({ fontFamily: 'var(--font-space-grotesk)', fontSize: 13, padding: '6px 16px', border: '1px solid var(--brand-border)', background: 'transparent', color: disabled ? 'var(--brand-border)' : 'var(--brand-text-body)', cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 0 });

// ── Component ────────────────────────────────────────────────────────────────

export default function PinakesView() {
  const [data, setData] = useState<PinakesData | null>(null);
  const [selThemes, setSelThemes] = useState<Set<string>>(new Set());
  const [selCats, setSelCats] = useState<Set<string>>(new Set());
  const [selMeds, setSelMeds] = useState<Set<string>>(new Set());
  const [sortCol, setSortCol] = useState<SortCol>('read');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/pinakes.json')
      .then(r => r.json())
      .then((d: PinakesData) => {
        setData(d);
        setSelThemes(new Set(d.facets.themes));
        setSelCats(new Set(d.facets.categories));
        setSelMeds(new Set(d.facets.mediums));
      });
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.books.filter(b => {
      const tOk = b.themes.length === 0 || b.themes.some(t => selThemes.has(t));
      const cOk = !b.category || selCats.has(b.category);
      const mOk = !b.medium || selMeds.has(b.medium);
      return tOk && cOk && mOk;
    });
  }, [data, selThemes, selCats, selMeds]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    if (!av && !bv) return 0;
    if (!av) return 1;
    if (!bv) return -1;
    const cmp = sortCol === 'released' ? parseInt(av) - parseInt(bv) : av.localeCompare(bv);
    return sortDir === 'asc' ? cmp : -cmp;
  }), [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const authorCount = useMemo(() => new Set(filtered.map(b => b.author).filter(Boolean)).size, [filtered]);
  const releasedRange = useMemo(() => {
    const yrs = filtered.map(b => parseInt(b.released)).filter(y => !isNaN(y));
    return yrs.length ? [Math.min(...yrs), Math.max(...yrs)] : null;
  }, [filtered]);
  const readRange = useMemo(() => {
    const dates = filtered.map(b => b.read).filter(Boolean).sort();
    return dates.length ? [dates[0].slice(0, 4), dates[dates.length - 1].slice(0, 4)] : null;
  }, [filtered]);

  const toggleFacet = useCallback((val: string, sel: Set<string>, setSel: (s: Set<string>) => void) => {
    setPage(1);
    const next = new Set(sel);
    next.has(val) ? next.delete(val) : next.add(val);
    setSel(next);
  }, []);

  const handleSort = (col: SortCol) => {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  const sortIcon = (col: SortCol) => col === sortCol ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  if (!data) return (
    <div style={{ background: 'var(--brand-surface)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter)', color: 'var(--brand-text-secondary)' }}>
      Loading Pinakes…
    </div>
  );

  const facetAxes = [
    { label: 'Themes', all: data.facets.themes, sel: selThemes, setSel: setSelThemes },
    { label: 'Categories', all: data.facets.categories, sel: selCats, setSel: setSelCats },
    { label: 'Mediums', all: data.facets.mediums, sel: selMeds, setSel: setSelMeds },
  ];

  const summaryItems = [
    { label: 'Books', value: filtered.length.toLocaleString() },
    { label: 'Authors', value: authorCount.toLocaleString() },
    { label: 'Released', value: releasedRange ? `${releasedRange[0]}–${releasedRange[1]}` : '—' },
    { label: 'Read', value: readRange ? `${readRange[0]}–${readRange[1]}` : '—' },
  ];

  return (
    <div style={{ background: 'var(--brand-surface)', minHeight: '100vh', padding: '32px 24px', fontFamily: 'var(--font-inter)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ fontSize: 12, color: 'var(--brand-text-secondary)', letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'var(--font-space-grotesk)', textTransform: 'uppercase' }}>← KHAOS-MOUSEION</Link>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 36, fontWeight: 700, color: 'var(--brand-hero-color)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 0' }}>PINAKES</h1>
          <p style={{ color: 'var(--brand-text-secondary)', fontSize: 14, margin: '4px 0 0' }}>Catalog of Callimachus · Library of the Mouseion</p>
        </div>

        {/* Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, background: 'var(--brand-tint-bg)', border: '1px solid var(--brand-border)', padding: 20, marginBottom: 24 }}>
          {summaryItems.map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 28, fontWeight: 700, color: 'var(--brand-primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Facets */}
        {facetAxes.map(({ label, all, sel, setSel }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-text-secondary)', minWidth: 82 }}>{label}</span>
              <button onClick={() => { setPage(1); setSel(new Set(all)); }} style={actionBtn}>Select all</button>
              <button onClick={() => { setPage(1); setSel(new Set()); }} style={actionBtn}>Clear all</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {all.map(v => (
                <button key={v} onClick={() => toggleFacet(v, sel, setSel)} style={sel.has(v) ? facetOn : facetOff}>{v}</button>
              ))}
            </div>
          </div>
        ))}

        {/* Table */}
        <div style={{ marginTop: 24, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--brand-primary)' }}>
                {(['title', 'author', 'released', 'read'] as SortCol[]).map(col => (
                  <th key={col} onClick={() => handleSort(col)} style={thSort}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}{sortIcon(col)}
                  </th>
                ))}
                <th style={thBase}>Themes</th>
                <th style={thBase}>Category</th>
                <th style={thBase}>Medium</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((book, i) => (
                <tr key={i}
                  style={{ borderBottom: '1px solid var(--brand-border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-tint-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={td}>{book.title || '—'}</td>
                  <td style={td}>{book.author || '—'}</td>
                  <td style={tdMono}>{book.released || '—'}</td>
                  <td style={tdMono}>{book.read || '—'}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {book.themes.map(t => <span key={t} style={greenChip}>{t}</span>)}
                    </div>
                  </td>
                  <td style={td}>{book.category && <span style={blueChip}>{book.category}</span>}</td>
                  <td style={td}>{book.medium && <span style={{ ...medChip, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{book.medium}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--brand-border)', fontSize: 13, color: 'var(--brand-text-secondary)' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}>← Prev</button>
          <span style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Page {page} of {totalPages} · {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, sorted.length).toLocaleString()} of {sorted.length.toLocaleString()} books
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>Next →</button>
        </div>

      </div>
    </div>
  );
}
