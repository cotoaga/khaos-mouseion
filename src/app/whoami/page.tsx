import { redirect } from "next/navigation";
import { getVerifiedClaims } from "@/lib/khaos-id";

export const dynamic = "force-dynamic";

const KHAOS_ID_LOGIN = "https://khaos-id.vercel.app/login";

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number") return String(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default async function WhoamiPage() {
  const claims = await getVerifiedClaims();
  if (!claims) redirect(KHAOS_ID_LOGIN);

  const expIso =
    typeof claims.exp === "number"
      ? new Date(claims.exp * 1000).toISOString()
      : "—";

  const rows: Array<[string, string]> = [
    ["sub", formatValue(claims.sub)],
    ["email", formatValue(claims.email)],
    ["iss", formatValue(claims.iss)],
    ["exp", `${formatValue(claims.exp)} (${expIso})`],
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2">
        <h1
          className="text-3xl font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk)" }}
        >
          /whoami
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--grey-light)", fontFamily: "var(--font-inter)" }}
        >
          Federated identity from khaos-id. Verified locally against the JWKS
          endpoint — no round-trip to khaos-id required.
        </p>
      </header>

      <p
        className="text-sm"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <span style={{ color: "var(--green)", fontWeight: 600 }}>
          Signature verified
        </span>{" "}
        <span style={{ color: "var(--grey-light)" }}>
          against <code style={{ fontFamily: "var(--font-mono)" }}>
            {process.env.SUPABASE_JWKS_URL}
          </code>
          .
        </span>
      </p>

      <dl
        className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 text-sm"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt style={{ color: "var(--grey-light)" }}>{label}</dt>
            <dd className="break-all" style={{ color: "var(--white)" }}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
