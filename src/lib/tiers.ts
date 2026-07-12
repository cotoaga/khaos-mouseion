/**
 * Tier seam — the warren's hospitality layer (COT-86).
 *
 * khaos-id answers "who is this?" — this module answers "how welcome are they?"
 * That separation is the ratified architecture (Option B): identity is
 * federated, authorization is per-warren. khaos-pluto copies this file.
 *
 * Core rule: AUTHENTICATED ≠ INVITED. A valid khaos-id session whose email
 * is on no list is still a visitor. Identity is not hospitality.
 *
 * v1 is deliberately stupid-simple: env allowlists, one pure function.
 * Migration to federation-level roles (Option A) or a guests table is a
 * one-file swap behind this seam — callers only ever see getTier().
 */
import type { JWTPayload } from "jose";

export type Tier = "visitor" | "guest" | "owner";

/** Parse a comma-separated env allowlist: trimmed, lowercased, empties dropped. */
export function parseAllowlist(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve the tier for a set of verified claims.
 * Pass the result of getVerifiedClaims() — never unverified cookie data.
 */
export function getTier(claims: JWTPayload | null): Tier {
  if (!claims) return "visitor";
  const email =
    typeof claims.email === "string" ? claims.email.trim().toLowerCase() : null;
  if (!email) return "visitor";

  if (parseAllowlist(process.env.KHAOS_OWNER_EMAILS).includes(email)) {
    return "owner";
  }
  if (parseAllowlist(process.env.KHAOS_GUEST_EMAILS).includes(email)) {
    return "guest";
  }
  return "visitor";
}
