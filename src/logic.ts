// Rung 2 — logic (Prolog, via self-contained tau-prolog). Reasons become facts; a few
// rules infer structure and catch the *live* ethical tension present in the corpus.
import pl from "tau-prolog";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { CitedReason } from "./surface.ts";

// the static rules live in a real Prolog file (src/ethics.pl); the dynamic
// cites/2 facts are prepended to them at runtime before consulting.
const RULES = readFileSync(fileURLToPath(new URL("./ethics.pl", import.meta.url)), "utf-8");

function runProlog(program: string, goal: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const s = pl.create(2000);
    const ans: string[] = [];
    s.consult(program, {
      success: () =>
        s.query(goal, {
          success: () => {
            const step = () =>
              s.answer({
                success: (a: any) => { ans.push(s.format_answer(a)); step(); },
                fail: () => resolve(ans),
                error: (e: any) => reject(e),
                limit: () => resolve(ans),
              });
            step();
          },
          error: (e: any) => reject(e),
        }),
      error: (e: any) => reject(e),
    });
  });
}

export async function reason(facts: { id: string; reasons: CitedReason[] }[]) {
  const lines: string[] = [];
  for (const f of facts) for (const r of f.reasons) lines.push(`cites(${f.id}, ${r.reason}).`);
  // dynamic facts (one per cited reason) prepended to the static rules in ethics.pl
  const program = lines.join("\n") + "\n" + RULES;
  const tensions = [...new Set(await runProlog(program, "tension(A, B)."))];
  const appeals = await runProlog(program, "appeals(J, R).");
  return { tensions, appeals };
}
