import type { Metadata } from 'next';
import Link from 'next/link';
import TopologyView from '@/components/TopologyView';

export const metadata: Metadata = {
  title: 'Theme Currents · Library of the Mouseion',
  description:
    'Forty-five themes, pure co-occurrence — PMI-weighted so popularity does not drown out structure.',
};

export default function ThemeCurrentsPage() {
  return (
    <main className="mx-auto flex w-full min-h-screen max-w-[1600px] flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <Link
          href="/topology"
          className="text-xs uppercase tracking-[0.15em] no-underline"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          ← Topology
        </Link>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Library of the Mouseion
        </p>
        <h1
          className="text-3xl font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--green)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Theme Currents
        </h1>
        <p
          className="max-w-3xl text-sm"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-inter)' }}
        >
          Themes are currents — each book carries up to five, and they flow across
          borders. The physics below is driven by chance-corrected association, not
          raw popularity: what you see is structure, not size.
        </p>
      </header>
      <TopologyView lens="themes" />
    </main>
  );
}
