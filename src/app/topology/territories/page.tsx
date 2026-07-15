import type { Metadata } from 'next';
import Link from 'next/link';
import TopologyView from '@/components/TopologyView';

export const metadata: Metadata = {
  title: 'Territories × Currents · Library of the Mouseion',
  description:
    'Forty-four categories, forty-five themes — where exclusive territory meets ranked current, filtered to ties stronger than chance.',
};

export default function TerritoriesCurrentsPage() {
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
          style={{ color: 'var(--blue)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Territories × Currents
        </h1>
        <p
          className="max-w-3xl text-sm"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-inter)' }}
        >
          Categories are territories — every book lives in exactly one. Themes are
          currents that flow across those borders. The physics below is driven by
          chance-corrected association, not raw popularity: what you see is
          structure, not size.
        </p>
      </header>
      <TopologyView lens="bipartite" />
    </main>
  );
}
