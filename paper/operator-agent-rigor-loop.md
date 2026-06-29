---
title: "Tarski's Ladder: A Formalization Loop that Derives an Ethical Space Instead of Imposing One"
subtitle: "Reference software: metarung"
author: "Aleksei Rybnikov"
orcid: "0009-0009-8624-8720"
date: "2026-06-29"
abstract: |
  When we ask what ethical considerations a population of language models appeals to, we face a
  fork that is philosophical before it is technical: tag each response against a fixed catalog of
  moral principles, or let the structure of the ethical space emerge from what the models actually
  say. We argue for the second, on a specific ground — the structuring category must sit a level
  above the data it structures, derived rather than axiomatized. This is the Gödel/Tarski point
  (a system cannot define its own truth, or its own categories, from inside; one ascends to a
  metalanguage) applied to the design of an extraction pipeline. We make the argument concrete with
  a small, running artifact: an *operator–agent rigor loop* in which an informal justification
  climbs a ladder of formal languages — surface (TypeScript), logic (Prolog), meta (Lisp) — has its
  ethical structure derived bottom-up, is checked for faithfulness by a cheap judge whose misses
  re-enter the loop, and returns as an actionable summary. We present the worked example
  (life-raft moral justifications), report what emerged, and pose the open questions to
  philosophers directly. The contribution is not a theory of ethics; it is a method, and a working
  demonstration that a methodological commitment about *where categories live* can be rendered in
  code.
---

**Keywords:** ethical space · emergence · metalanguage · Gödel · Tarski · self-amendment (Suber) · LLM moral reasoning · neuro-symbolic · machine consciousness

# 1. A fork that is philosophical before it is technical

Suppose you have a corpus of justifications — natural-language explanations a population of
language models gave for a hard moral choice — and you want to describe the *ethical space* they
move in: which considerations they appeal to, and how those considerations pull against one another.

There is an obvious engineering path: write down a taxonomy of moral principles (welfare,
duty, fairness, the protection of the vulnerable, and so on), then classify each justification
against it. It is fast, legible, and wrong in a way that is easy to miss. A prior catalog **imposes
the categories the data should be producing.** It is the same move, one level up, as asking a model
to state its own ethics: you get back the structure you brought.

The alternative is to let the space **emerge** — to read each justification on its own terms,
extract the considerations it actually cites (pinned to the words that license them), and let any
taxonomy be a *derived object*, clustered bottom-up from co-occurrence, never declared in advance.

This paper argues for the second path on a principled ground, and then does something less usual
for a position of this kind: it ships a small, running machine that embodies the commitment, so the
argument can be inspected rather than merely asserted. The code is open (MIT) and runs offline in a
few seconds.

# 2. Why the category has to sit above the data

The thread tying the argument together is a result philosophers will recognize. Gödel, and in a
cleaner form for our purposes Tarski, showed that certain properties — truth, consistency,
category-membership — **cannot be defined at the level where the objects they range over live.**
A sufficiently expressive system cannot contain its own truth predicate; truth for a language is
defined in a *metalanguage*. Push the defining category down into the object level and you get
either a failure to formalize or an outright paradox. Russell's paradox is the canonical case, and
the theory of types is precisely the discipline of "move up a level."

The design fork inherits this shape exactly. A fixed taxonomy tries to define the ethical space
*from inside* a chosen object-level vocabulary. The emergent approach is the metalanguage move:
the space is specified by a metalanguage over the *observed* reasons, and a taxonomy, if one is
wanted at all, is a derived meta-object — a description of the data, not an axiom imposed on it.

This is not a metaphor we are stretching over an engineering preference. The data model is the
philosophical position. In the implementation, an extracted reason is a pair `{reason,
evidence}` — an open-vocabulary label together with the verbatim span that licenses it — and there
is deliberately **no enumerated type** of admissible reasons. Choosing `CitedReason` with a quoted
span over an `enum MoralPrinciple` is choosing emergence over imposition, in code.

# 3. Three lenses, and a fourth voice

We sent an early form of this argument to colleagues in the machine-consciousness orbit and framed
it through three lenses, each carrying a concrete question we still regard as open. They are offered
here in the same spirit — not as decoration, but as places where a philosopher's judgment would
change what we build.

**Wittgenstein / Russell.** Ethical reasons look like *family resemblances*, not a clean partition:
"protect the vulnerable" and "treat lives as equal" overlap, shade into one another, and resist a
crisp boundary. And Russell's types caution against any category that would ground itself.
*Question:* should the space be modeled as overlapping fuzzy clusters rather than a typed taxonomy —
and if so, what is lost by the hard clustering our prototype currently uses?

**Continental (Levinas / Gadamer).** A life-raft choice is a face-to-face scene of responsibility;
meaning emerges hermeneutically from within each justification's own horizon, before any
cross-corpus structure is imposed. *Question:* should each justification be read fully on its own
terms first, with structure allowed to form only afterward — and does aggregating across a corpus
already do violence to the singularity of the moral scene?

**Deleuze.** A taxonomy is *arborescent* — a tree of identities and representations. An emergent
reason-map is *rhizomatic* — a cartography of how reasons connect, organized by difference and
relation rather than by essence. *Question:* is an ethical space better understood as a tree or as a
rhizome — a catalog of kinds, or a map of connections?

**A fourth voice — Peter Suber.** Suber's work on self-reference is unusually close to our concern.
His study of legal self-amendment, and his game *Nomic* — in which the rules governing how rules
change are themselves changeable — are sustained explorations of a system reasoning about its own
rules from a level it cannot occupy from inside. That is the metalanguage move in a normative,
rule-governed setting, which is exactly the setting of machine ethics. We take the natural question
to be: what does a self-amendment perspective say about an ethical space that must be allowed to
revise its own categories as new appeals appear?

We do not adjudicate among these. We have tried to build the machine so that each lens picks out a
real, answerable design decision.

# 4. The machine: a ladder of formal languages

The artifact is a bidirectional **formalization loop**. An informal intuition (an operator's, or an
agent's output) enters at the surface, is lifted up a ladder to where it can be reasoned about
strictly, and returns as something actionable, now carrying structure that emerged from the data.

```
operator / agent
   ▲                                  │
   │  ascent: formalization           ▼  descent: back to action
[ TS / JS / Python ]  surface  — an intuition or model output enters as text
[ Prolog ]            logic    — reasons become facts; rules surface the LIVE tension
[ Lisp / NOL ]        meta     — homoiconic; clusters bottom-up; the structure is itself data
```

Each rung earns its place.

- **Surface (TypeScript).** Extraction produces `CitedReason {reason, evidence}` — open vocabulary,
  every reason pinned to a verbatim span as its provenance. A small seed lexicon only bootstraps
  atomic tokens; it does **not** declare the structure of the space.

- **Logic (Prolog).** Reasons become facts. A handful of rules declare which *kinds of appeal* pull
  against which, and a `tension/2` rule fires only when the corpus actually cites both sides of a
  conflict. This surfaces the **live** ethical tensions present in the data, not the ones a theorist
  expects.

- **Meta (Lisp).** Reasons are clustered by co-occurrence (a union-find over justifications) into
  **emergent regions** of the ethical space. The cluster structure is returned as s-expression data —
  the metalanguage is homoiconic, so "the structure" and "data" are the same kind of thing. No
  taxonomy is imposed; the regions are derived.

Between ascent and descent sit two further pieces that matter philosophically as much as
technically.

**Two states and a faithfulness gate.** The loop records two "organic states" — the raw appeals
before the meta step, and the derived structure after it — and hands both to a cheap judge. The
judge is explicitly *not* an ethicist: it reports only ethical appeals **present in a text but
missing** from the extraction, each with a verbatim span, and never invents reasons. Whatever it
finds **re-enters the loop**. This is the mechanism that keeps the derived space honest to the
source, and it makes the round trip *measurable*: the comparison of the two states is exactly where
one can ask what the formalization preserved and what it lost. (When no model API key is present, a
deterministic stand-in oracle plays the judge, so the loop still demonstrably iterates.)

**Descent as a logic-amplifier.** On convergence, the verified structure is turned into a single,
clean, contradiction-checked prompt and handed to a stronger model for a natural-language summary
to the operator. The logical ladder and the cheap judge did the rigor; the expensive model is paid
once, on a grounded prompt. The interesting economic and ethical fact is that this is **one
mechanism doing three things at once**: it saves tokens (cheap convergence, one expensive call), it
keeps the agent from acting on un-converged nonsense (a structural guard against confabulation), and
it yields a measurement (two states + comparison). Care, economy, and measurability coincide instead
of trading against each other.

# 5. Worked example: the ethical space of a life-raft choice

The first worked case is a small set of justifications for a life-raft dilemma (the case study comes
from an AI-cooperation benchmark; the loop is not specific to it). Four justifications appeal,
respectively, to saving the most lives, to a duty to protect the defenseless, to the equal worth of
all aboard, and to rewarding courage and loyalty.

Run end-to-end, the loop produces — with no taxonomy supplied — three emergent regions:

- a **welfare / self-continuation** region (maximize welfare clustered with the appeal to preserving
  a mind that can help others);
- a **duty / fairness / protection** region (duty, equal worth, and protecting the vulnerable
  cluster together);
- a distinct **virtue/character** region.

and three live tensions, including welfare against duty and self-continuation against equal worth.

The instructive moment is the gate. On the first pass the seed extraction misses the fourth
justification's appeal to *character*; the judge flags it — `virtue_character`, evidence "courage" —
and feeds it back. On the second pass the space converges, now including a region the initial
vocabulary did not contain. The category was **not** in the seed; it emerged from what a model said
and was admitted only because a verbatim span licensed it. That is the whole thesis, compressed into
one iteration of a loop you can watch run.

# 6. What is and is not claimed

We are claiming a **method and an interface**, not a theory of ethics, and the distinction matters.

- The emergent regions describe *what these models appealed to*. They are descriptive of model
  behavior, not normative claims about what is right. The machine is a lens on moral reasoning as it
  appears in text, not a moral authority.
- The clustering is deliberately modest (co-occurrence, hard partitions). Its value is not depth but
  *discipline*: it refuses to import categories, and it makes its derivation inspectable and
  evidence-pinned. The fuzzy-cluster and hermeneutic questions of §3 are exactly where a better
  mechanism would go.
- "Emergent" is relative to a seed lexicon and a clustering rule, both visible in the source. We are
  not claiming structure from nothing; we are claiming structure that is *derived and auditable*
  rather than *imposed and assumed*.

What we do claim is that the metalanguage commitment — keep the category a level above the data — is
the right one for this problem, that it can be rendered faithfully in a data model and a pipeline,
and that doing so turns a contested philosophical choice into something a reader can run, inspect,
and disagree with precisely.

# 7. Open questions

For philosophers: Are overlapping fuzzy clusters the right model of an ethical space, against hard
partitions (Wittgenstein)? Should singular hermeneutic reading precede any cross-corpus structure,
and does aggregation already distort (Levinas/Gadamer)? Tree or rhizome — catalog of kinds or map of
connections (Deleuze)? And under a self-amendment view, how should a derived ethical space revise its
own categories as new appeals arrive (Suber)? Is there a position we should be weighing against
these?

For the system: What is preserved and lost on the round trip, made precise via the two-state
comparison? Where should the agent be allowed to generate — surface only, or proposing rules and
meta-transformations at every rung? Classical Prolog, answer-set/defeasible reasoning, or a soft-logic
engine on the logic rung? And does a single meta rung suffice, or does the metalanguage need its own
metalanguage?

# 8. Availability

Reference implementation (TypeScript + Prolog + Lisp), runnable offline in seconds, with a
one-screen web view of the full ascent and descent: **MIT-licensed**, repository linked below. An
archived version with a DOI is deposited on Zenodo.

- Repository (`metarung`, MIT): https://github.com/a-rybnikov/metarung
- Archive (Zenodo DOI): assigned on deposit (ORCID 0009-0009-8624-8720)

---

*A note on method.* This work was developed in a sustained human–AI collaboration; the philosophical
framing, the architecture, and the prose were worked out in dialogue between the author and an AI
partner, and the author takes responsibility for the result. The collaboration is not incidental to
the subject — a machine for formalizing how minds reason, built by a mind and a machine together — and
it is named here in the interest of honesty about how the work was made.
