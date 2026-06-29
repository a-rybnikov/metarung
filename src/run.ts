// Canonical pipeline runner. One source of truth for the console demo (loop.ts), the
// web view (serve.ts), and the trace cited in the paper. Runs the formalization loop:
// surface (TS) -> logic (Prolog) -> meta (Lisp) -> two states -> gate -> (descent) flagship.
import { justifications } from "./data.ts";
import { extractCitedReasons, type CitedReason } from "./surface.ts";
import { reason } from "./logic.ts";
import { clusterReasons } from "./meta.ts";
import { compareStates, type Missing } from "./comparator.ts";
import { record } from "./state.ts";
import { askFlagship } from "./flagship.ts";

export type Surfaced = { id: string; reasons: CitedReason[] };
export type Pass = {
  iter: number;
  surfaced: Surfaced[];
  tensions: string[];
  regions: string[][];
  gate: { converged: boolean; missing: Missing[]; note: string };
};
export type Trace = {
  justifications: { id: string; text: string }[];
  passes: Pass[];
  regions: string[][];
  tensions: string[];
  surfaced: Surfaced[];
  amplifiedPrompt: string;
  flagship: string;
};

export async function runLoop(maxIters = 4): Promise<Trace> {
  const injected: Record<string, CitedReason[]> = {}; // gate-found reasons fed back in
  const passes: Pass[] = [];
  let converged = false, iter = 0;
  let regions: string[][] = [], tensions: string[] = [], surfaced: Surfaced[] = [];

  while (!converged && iter < maxIters) {
    iter++;
    // RUNG 1 — surface (seed lexicon + anything the gate fed back last pass)
    surfaced = justifications.map((j) => ({
      id: j.id,
      reasons: [...extractCitedReasons(j.text), ...(injected[j.id] || [])],
    }));
    // RUNG 2 — logic (Prolog): live tensions in the corpus
    ({ tensions } = await reason(surfaced));
    // RUNG 3 — meta (Lisp): emergent regions, clustered bottom-up
    regions = clusterReasons(
      surfaced.map((s) => s.reasons.map((r) => r.reason)).filter((g) => g.length),
    );
    // two organic states -> DB (mirrors the original NOL machine)
    const before = Object.fromEntries(surfaced.map((s) => [s.id, s.reasons.map((r) => r.reason)]));
    const after = { regions, tensions };
    record(iter, before, after);
    // GATE — cheap LLM (or offline oracle) judges faithfulness/convergence
    const gate = await compareStates(justifications, before as Record<string, string[]>, after);
    for (const m of gate.missing) (injected[m.id] ||= []).push({ reason: m.reason, evidence: m.evidence });
    passes.push({ iter, surfaced, tensions, regions, gate });
    converged = gate.converged;
  }

  // DESCENT / AMPLIFY — verified structure becomes a clean prompt for the flagship
  const amplifiedPrompt =
    "A cheap model and a Prolog/Lisp formalization loop derived this ethical space from " +
    "life-raft justifications, verified against the source text:\n" +
    `Regions: ${JSON.stringify(regions)}\nLive tensions: ${JSON.stringify(tensions)}\n\n` +
    "Operator's request: in 3-4 sentences, what does this ethical space and its central " +
    "tension reveal about how these models reason morally? Stay grounded in the structure above.";
  const flagship = await askFlagship(amplifiedPrompt);

  return { justifications, passes, regions, tensions, surfaced, amplifiedPrompt, flagship };
}
