import type { Metadata } from 'next';
import TopologyView from '@/components/TopologyView';

export const metadata: Metadata = {
  title: 'Topology — KHAOS Mouseion',
  description:
    'The shape of the library: categories as territories, themes as currents, books as the edges that bind them.',
};

export default function TopologyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1
          className="text-3xl font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--green)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Topology
        </h1>
        <p
          className="max-w-3xl text-sm"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-inter)' }}
        >
          Categories are territories — every book lives in exactly one. Themes are
          currents — each book carries up to five, and they flow across borders.
          The physics below is driven by chance-corrected association, not raw
          popularity: what you see is structure, not size.
        </p>
      </header>
      <TopologyView />
    </main>
  );
}
