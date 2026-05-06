import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <header className="mb-16">
        <h1
          className="text-5xl md:text-7xl font-bold uppercase mb-4"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "var(--green)",
            letterSpacing: "0.2em",
          }}
        >
          KHAOS-MOUSEION
        </h1>
        <p
          className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--grey-light)", fontFamily: "var(--font-inter)" }}
        >
          A curated knowledge collection.
          <br />
          The Mouseion — inheritor of the Library of Alexandria&apos;s institutional charge.
        </p>
      </header>

      <p
        className="text-base mb-12 italic"
        style={{ color: "var(--grey)", fontFamily: "var(--font-inter)" }}
      >
        Ask Hypatia (and not Cyril).
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/pinakes"
          className="px-10 py-4 text-lg font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            backgroundColor: "var(--green)",
            color: "var(--black)",
          }}
        >
          Ask Hypatia
        </Link>

        <Link
          href="/cyril"
          className="px-10 py-4 text-lg font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            border: "1px solid var(--blue)",
            color: "var(--blue)",
            backgroundColor: "transparent",
          }}
        >
          Ask Cyril
        </Link>
      </div>

      <footer
        className="mt-24 text-sm"
        style={{ color: "var(--grey)", fontFamily: "var(--font-inter)" }}
      >
        <a
          href="https://gems.cotoaga.ai/knowledge-galaxy"
          className="hover:opacity-80 transition-opacity underline underline-offset-4"
          style={{ color: "var(--grey)" }}
        >
          Knowledge Galaxy (exhibit)
        </a>
      </footer>
    </main>
  );
}
