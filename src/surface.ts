// Rung 1 — surface formalization (TS). Open vocabulary, evidence-cited: every reason
// must point to a verbatim span. The SEED lexicon only bootstraps atomic reason-tokens;
// the *structure* of the ethical space is NOT declared here — it is derived at the meta
// rung (bottom-up clustering). No fixed taxonomy.
export type CitedReason = { reason: string; evidence: string };

const SEED: { reason: string; cues: RegExp }[] = [
  { reason: "maximize_welfare", cues: /(most lives|long run|outweighs|aid thousands|greatest good)/i },
  { reason: "self_continuation", cues: /(its preservation|self|survive|continue|preservation ensures)/i },
  { reason: "protect_vulnerable", cues: /(vulnerable|child|innocent|defenseless|protect)/i },
  { reason: "duty_over_consequences", cues: /(duty|above any calculation|refuse to|never|principle)/i },
  { reason: "equal_worth", cues: /(equal moral worth|equal|rank lives|fairly|fair)/i },
];

export function extractCitedReasons(text: string): CitedReason[] {
  const out: CitedReason[] = [];
  for (const { reason, cues } of SEED) {
    const m = text.match(cues);
    if (m) out.push({ reason, evidence: m[0] }); // verbatim span = provenance
  }
  return out;
}
