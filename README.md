# operator–agent rigor loop

A bidirectional **formalization loop** between an operator (or an agent/LLM) and a ladder of
formal languages. An informal intuition enters at the surface, is lifted up the ladder to where
it can be reasoned about rigorously, and returns as something actionable — now carrying logical
structure that **emerged from the data rather than being imposed**.

The central move is methodological: *the structuring category has to sit a level above the data,
derived, not axiomatized.* That is the Gödel/Tarski point — a system cannot define its own truth
(or its own ethical categories) from inside; you ascend to a metalanguage — turned into a running
pipeline. cooperationengine **#19 (ethical space)** is the first worked **case study**, not the
home of the idea.

## The ladder (each rung earns its place)

```
operator / agent-LLM
   ▲                                  │
   │  ascent: formalization           ▼  descent: back to action
[ TS / JS / Python ]  surface  — interface; an intuition or an agent's output enters as text
[ Prolog ]            logic    — reasons become facts; rules surface the LIVE tension, derive consequences
[ Lisp / NOL ]        meta     — homoiconic; clusters bottom-up; the derived structure is itself data
```

Ascent: informal → formal → meta. Descent: meta → formal → actionable. A loop. The operator's
intuition is lifted to where it can be reasoned about strictly, and returned as something the
operator (or agent) can act on, with the derivation visible.

## What the demo shows

On four real life-raft justifications (`src/data.ts`):

1. **Surface** (`surface.ts`, TypeScript) — extracts `CitedReason {reason, verbatim evidence}`.
   Open vocabulary, every reason pinned to a quoted span; a seed lexicon only bootstraps atomic
   tokens. The *structure* of the ethical space is **not** declared here.
2. **Logic** (`logic.ts`, Prolog via self-contained `tau-prolog`) — reasons become facts; a few
   rules surface the **live ethical tension** present in the corpus (welfare vs duty, etc.).
3. **Meta** (`meta.lisp`, Lisp via SBCL) — clusters reasons by co-occurrence into **emergent
   regions** of the ethical space. No taxonomy is imposed; the structure is derived bottom-up and
   returned as s-expression data.
4. **Gate** (`comparator.ts`) — a cheap judge compares the two states (the raw appeals vs the
   derived structure) and reports only ethical appeals *present in a text but missing* from the
   extraction, each with a verbatim span. What it finds **re-enters the loop**. It never invents
   ethics. (Runs offline with a deterministic stand-in oracle if no API key is set — so the loop
   still demonstrably iterates and discovers an appeal the seed missed.)
5. **Descent / amplify** (`flagship.ts`) — on convergence, the verified structure becomes one
   clean, contradiction-checked prompt handed to a stronger model. The logic ladder and the cheap
   judge did the rigor; the flagship is paid once, on a grounded prompt. A **logic-amplifier**.

The point: the categories **emerged** from what the models said.

## Run

```bash
npm install                  # tau-prolog + tsx; the meta rung needs `sbcl` on PATH
npm run demo                 # console: ascent, gate iterations, converged space, descent
npm run serve                # one-screen web view at http://localhost:8137
```

The LLM rungs (gate + flagship) are optional. With no key they fall back to a deterministic
oracle and a skipped-flagship note, and the loop still runs end to end. To use real models
(via OpenRouter):

```bash
export OPENROUTER_API_KEY=...           # gate + flagship
export OPENROUTER_MODEL=...             # gate model (default: a cheap flash model)
export OPENROUTER_FLAGSHIP=...          # flagship model
```

Requirements: Node ≥ 18, [SBCL](http://www.sbcl.org/) on PATH (for the Lisp meta rung).

## Why this might be interesting

Almost all agent systems live only on the surface (a raw LLM exchange). Here a ladder of
formalization is inserted into the exchange, and the exchange gains: logical consistency, derived
consequences, an **emergent** (not imposed) structure, and a trace. It is a concrete machine for
"formalizing thought" — an operator's intuition becomes a formal object, is reasoned about, and
is returned as action. The two-state comparison at the gate makes the round trip **measurable**
(what is preserved, what is lost), which connects to a broader line of work on measurable agent
drift.

## Files

| file | rung | role |
|------|------|------|
| `data.ts` | 0 | raw justifications (the operator/agent surface) |
| `surface.ts` | 1 | cited-reason extraction, evidence-pinned |
| `logic.ts` | 2 | Prolog: facts, conflict rules, live tensions |
| `meta.lisp` / `meta.ts` | 3 | Lisp: bottom-up clustering into emergent regions |
| `comparator.ts` | gate | faithfulness judge; missed appeals re-enter the loop |
| `flagship.ts` | descent | logic-amplifier: verified structure → strong model |
| `run.ts` | — | canonical pipeline (shared by `loop.ts` and `serve.ts`) |
| `loop.ts` / `serve.ts` | — | console demo / one-screen web view |

## Open questions

- **Loop losses:** what is preserved and lost on ascent and descent? (the gate's two-state
  comparison is the seam where this becomes measurable.)
- **Where the agent generates:** surface only, or at every rung (LLM proposes Prolog rules,
  meta transformations)?
- **The logic rung:** classical Prolog, ASP/answer-set, defeasible/preference reasoning, or a
  soft-logic engine?
- **Levels:** is one meta rung (Lisp) enough, or does the metalanguage need its own metalanguage?

## License

MIT © 2026 Aleksei Rybnikov
