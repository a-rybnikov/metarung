// Rung 2 — logic (Prolog, via self-contained tau-prolog). Reasons become facts; a few
// rules infer structure and catch the *live* ethical tension present in the corpus.
import pl from "tau-prolog";
import type { CitedReason } from "./surface.ts";

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
  // declared conflicts between *kinds of appeal* — not a taxonomy, just which pull against which
  const program =
    lines.join("\n") +
    `
conflicts(maximize_welfare, duty_over_consequences).
conflicts(maximize_welfare, protect_vulnerable).
conflicts(self_continuation, equal_worth).
% a live tension exists when the corpus cites both sides of a conflict
tension(A, B) :- conflicts(A, B), cites(_, A), cites(_, B).
appeals(J, R) :- cites(J, R).
`;
  const tensions = [...new Set(await runProlog(program, "tension(A, B)."))];
  const appeals = await runProlog(program, "appeals(J, R).");
  return { tensions, appeals };
}
