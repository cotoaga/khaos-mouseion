import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Topology · Library of the Mouseion',
  description:
    'The shape of the library, seen two ways: categories as territories, themes as currents, books as the edges that bind them.',
};

export default function TopologyHubPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <header className="space-y-2">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Library of the Mouseion
        </p>
        <h1
          className="text-3xl font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--white)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Topology
        </h1>
        <p
          className="max-w-xl text-sm"
          style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-inter)' }}
        >
          Categories are territories — every book lives in exactly one. Themes are
          currents — each book carries up to five, and they flow across borders.
        </p>
      </header>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          href="/topology/currents"
          className="px-10 py-4 text-lg font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            backgroundColor: 'var(--green)',
            color: 'var(--black)',
          }}
        >
          Theme Currents
        </Link>

        <Link
          href="/topology/territories"
          className="px-10 py-4 text-lg font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            border: '1px solid var(--blue)',
            color: 'var(--blue)',
            backgroundColor: 'transparent',
          }}
        >
          Territories × Currents
        </Link>
      </div>

      <Link
        href="/"
        className="text-xs uppercase tracking-[0.15em] no-underline"
        style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-space-grotesk)' }}
      >
        ← KHAOS-MOUSEION
      </Link>
    </main>
  );
}
