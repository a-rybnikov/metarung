// Console demo. Runs the canonical pipeline (run.ts) and prints the ascent, the gate
// iterations, the converged ethical space, and the descent to the flagship.
import { runLoop } from "./run.ts";
import type { CitedReason } from "./surface.ts";

const bar = (s: string) => console.log(`\n\x1b[1m\x1b[36m${s}\x1b[0m`);
const dim = (s: string) => "\x1b[2m" + s + "\x1b[0m";

const t = await runLoop();

for (const p of t.passes) {
  for (const m of p.gate.missing)
    console.log(`   [pass ${p.iter}] gate found uncaptured appeal: ${m.id} -> ${m.reason}  <- "${m.evidence}"`);
  console.log(
    `\x1b[33m[pass ${p.iter}] gate (${p.gate.note}): ${p.gate.converged ? "CONVERGED" : "not yet"}\x1b[0m`,
  );
}

bar(`CONVERGED ethical space (after ${t.passes.length} pass(es))`);
for (const s of t.surfaced)
  console.log(`  ${s.id}: { ${s.reasons.map((r: CitedReason) => r.reason).join(", ")} }`);
t.regions.forEach((c, i) => console.log(`  region ${i + 1}: { ${c.join(", ")} }`));
for (const tn of t.tensions) console.log("  tension: " + tn);

bar("AMPLIFIED PROMPT -> flagship (the logic-amplifier)");
console.log(dim(t.amplifiedPrompt));
bar("FLAGSHIP -> operator (natural language out)");
console.log(t.flagship);
