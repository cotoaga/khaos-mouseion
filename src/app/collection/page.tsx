import Link from "next/link";

export default function Collection() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1
        className="text-3xl md:text-5xl font-bold uppercase mb-6"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--green)",
          letterSpacing: "0.15em",
        }}
      >
        The Collection
      </h1>

      <p
        className="text-lg max-w-lg mx-auto mb-4 leading-relaxed"
        style={{ color: "var(--grey-light)", fontFamily: "var(--font-inter)" }}
      >
        1,465 books warehoused. Browsing interface in v2.
      </p>

      <p
        className="text-sm italic"
        style={{ color: "var(--grey)", fontFamily: "var(--font-inter)" }}
      >
        The door is open. The shelves are being arranged.
      </p>

      <Link
        href="/"
        className="mt-12 text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--grey-light)",
        }}
      >
        ← Back
      </Link>
    </main>
  );
}
