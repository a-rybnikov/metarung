---
title: "Tarski's Ladder: Deriving an Ethical Space Instead of Imposing One"
subtitle: "A formalization loop between an operator and a withdrawn object. Reference software: metarung"
author: "Aleksei Rybnikov"
orcid: "0009-0009-8624-8720"
date: "2026-06-29"
---

**Abstract.** When we ask what ethical considerations a population of language models appeals to, we meet a fork that is philosophical before it is technical: tag each response against a fixed catalogue of moral principles, or let the structure of the ethical space emerge from what the models actually say. This paper argues for the second on a specific ground. The structuring category must sit a level above the data it organizes, derived rather than axiomatized. Tarski's undefinability theorem and Gödel's incompleteness results show, for truth and for provability respectively, that a sufficiently expressive system cannot define such a predicate from inside; one ascends to a metalanguage. We extend that pattern, by analogy and not as a corollary of the theorems, to the category that organizes an ethical space. We give that lesson a second reading through object-oriented ontology. The language model is a non-human object whose reality is never exhausted by any relation to it, so its ethics cannot be read off its surface; it can only be partially translated, a level up, from what it emits. We make both readings concrete with a small running artifact, metarung, an operator-agent rigor loop in which an informal justification climbs a ladder of formal languages (surface in TypeScript, logic in Prolog, meta in Lisp), has its ethical structure derived bottom-up, is checked for faithfulness by a cheap judge whose misses re-enter the loop, and returns as an actionable summary. We present the worked example, report what emerged, and put the open questions to philosophers directly. The contribution is not a theory of ethics. It is a method, and a demonstration that a commitment about where categories live can be carpentered into code.

**Keywords:** ethical space; emergence; metalanguage; Gödel; Tarski; object-oriented ontology; withdrawal; hyperobject; neuro-symbolic; machine ethics; LLM moral reasoning

# 1. Introduction

Suppose you hold a corpus of justifications: natural-language explanations that a population of language models gave for a hard moral choice. You want to describe the ethical space they move in, which considerations they appeal to and how those considerations pull against one another.

There is an obvious engineering path. Write down a taxonomy of moral principles (welfare, duty, fairness, the protection of the vulnerable) and classify each justification against it. It is fast, legible, and wrong in a way that is easy to miss. A prior catalogue imposes the categories the data should be producing. It is the same move, one level up, as asking a model to state its own ethics: you receive back the structure you brought.

The alternative is to let the space emerge. Read each justification on its own terms, extract the considerations it actually cites, pin each to the words that license it, and let any taxonomy be a derived object, clustered bottom-up, never declared in advance.

This paper argues for the second path on a principled ground, and then does something less usual for a position of this kind. It ships a small running machine that embodies the commitment, so the argument can be inspected and run rather than only asserted. The code is open under the MIT license and executes offline in a few seconds.

The argument has two readings that meet at the same point. The first is logical: a category about a system cannot be fixed from inside the system, so you ascend to a metalanguage (Section 2). The second is ontological: the object you are studying, here a language model, withdraws from any relation to it, so what you can do is translate it faithfully a level up, never grasp it whole (Section 3). Sections 5 and 6 give the running method and a worked example. The remainder states what is and is not claimed, the limits, and the questions we want answered.

The throughline is older than the code. This paper is one narrow, testable piece of a longer program the author has pursued, the formalization of reasoning without flattening it; here that program becomes a single concrete design decision in a data model.

# 2. The metalanguage move

The thread tying the argument together is a result philosophers will recognize. Gödel, and in a cleaner form for our purposes Tarski, showed that certain properties cannot be defined at the level where the objects they range over live: for Tarski, the truth predicate of a language; for Gödel, provability and consistency. A sufficiently expressive formal system cannot contain its own truth predicate; truth for an object language is defined in a metalanguage that stands above it (Tarski 1933; Gödel 1931). The transfer from a truth predicate to a structuring category, such as a moral category, is an analogy we use as a design heuristic, not a result the theorems deliver; we keep that boundary explicit throughout. Push the defining category down into the object level and you get either a failure to formalize or an outright paradox. Russell's paradox is the canonical case, and the theory of types is precisely the discipline of moving up a level (Whitehead and Russell 1910).

The design fork inherits this shape exactly. A fixed taxonomy tries to define the ethical space from inside a chosen object-level vocabulary. The emergent approach is the metalanguage move: the space is specified by a metalanguage over the observed reasons, and a taxonomy, if one is wanted at all, is a derived meta-object, a description of the data rather than an axiom imposed on it.

This is not a metaphor stretched over an engineering preference. The data model is the philosophical position. In the implementation, an extracted reason is a pair, a label together with the verbatim span that licenses it, and there is deliberately no enumerated type of admissible reasons. Choosing an open vocabulary with cited evidence over a closed enumeration of principles is choosing emergence over imposition, in code.

# 3. The withdrawn object: an object-oriented reading

The metalanguage move tells us where the category must live. Object-oriented ontology (OOO) tells us why, when the object under study is a language model, the move is forced rather than optional.

Graham Harman, who introduced object-oriented philosophy in his early work on Heidegger's analysis of tools (Harman 2002) and later set out the broader program for a general audience (Harman 2018; 2011), holds that an object retains a reality in excess of any relation it enters. No relation, whether perceptual, theoretical, or causal, human or non-human, ever fully accesses or exhausts the object. The object withdraws, and every relation is a partial translation rather than a complete grasp. (We state this as a careful paraphrase of Harman's position; we do not put words in his mouth.)

Read our problem through that lens. The language model is an object. Its full reality, the weights, the training distribution, whatever internal structure produces a moral judgment, withdraws from us. We do not have it, and prompting the model to narrate its own ethics does not deliver it; it delivers another surface, another partial translation, this time one shaped by our question. Harman's withdrawal and Tarski's undefinability are not the same claim; one is a metaphysical thesis and the other a formal metatheorem. They are structurally analogous in a single respect, which is the respect we care about: in both, what would organize or ground the object cannot be had at the object's own level. You cannot read the category off the object at the object's own level. What remains available is disciplined translation a level up, from what the object emits, with the translation marked as partial and tied to evidence. Our faithfulness gate (Section 5) is exactly an admission of withdrawal: it never claims to have captured the model, only to have translated, without loss it can detect, what the model actually said.

Three further object-oriented thinkers sharpen specific design decisions.

Levi Bryant, who introduced the label "object-oriented ontology" in 2009 to mark a family of positions distinct from Harman's earlier object-oriented philosophy, treats every entity as a machine. He defines a machine as "a system of operations that performs transformations on inputs thereby producing outputs" (Bryant 2014, p. 38), and insists that a machine's powers are real independently of whether any other machine detects them. This is the right ontology for our surface rung. We treat the model not as a mind to be interrogated but as a machine whose outputs we read. We do not ask it what it values; we record what it emitted and operate on that. Bryant's earlier work develops his realist ontology, which he calls onticology, at book length and openly (Bryant 2011).

Ian Bogost, a programmer and game designer as well as a philosopher, argues that one should do philosophy by building, constructing artifacts as much as writing about them, a practice he calls carpentry (Bogost 2012; see also Bogost 2006 on reading systems as configurations of discrete units). metarung is carpentry in his sense. The claim that categories must be derived, not imposed, is not left as a sentence to be agreed with; it is built, as a data model with no enumerated type, and run. If the claim is wrong, the artifact will misbehave in public.

Timothy Morton names a class of entities so massively distributed in time and space, relative to humans, that they exceed the ordinary notion of a thing (Morton 2013). His own canonical examples are global warming, nuclear materials, and evolution. We extend the notion, and we mark this as our analogy rather than Morton's example: a large distributed model is hyperobject-like for a single operator. Its body is spread across hardware and data we never see whole; what reaches us is a local manifestation, an API call, a CLI session, a handful of justifications. A method that works on local manifestations while refusing to mistake them for the whole is the appropriate stance toward a hyperobject.

Two adjacent thinkers frame the larger setting. Yuk Hui argues that digital objects, in their simplest form data formalized through schemes and ontologies, possess their own mode of existence, and he analyzes data structures and object-oriented programming ontologically (Hui 2016). Our cited-reason records and the s-expression clusters they produce are digital objects in his sense, entities with a structure of their own, not mere notation. Benjamin Bratton describes planetary-scale computation as an accidental megastructure, a stack of six layers (Earth, Cloud, City, Address, Interface, User) whose User layer already includes non-human actors; in his words, "computation is changing not only how governments govern, but what government even is in the first place: less governance of computation than computation as governance" (Bratton 2015). Our loop sits at the seam between Interface and User, the narrow place where a single operator still meets a planetary object, and it tries to insert a rung of rigor into that meeting.

Two non-OOO lenses remain useful and we keep them. Ethical reasons look like Wittgenstein's family resemblances rather than a clean partition; cases overlap and shade into one another, and no single feature runs through all of them (Wittgenstein 1953). And a taxonomy is what Deleuze and Guattari call arborescent, a tree of identities, whereas an emergent reason-map is rhizomatic, a cartography of connections organized by difference rather than essence (Deleuze and Guattari 1980). This is not only a label. It is the reason our meta rung returns a graph of co-occurrence connections rather than a tree of kinds, a map rather than a classification. Each of these is a live question for the model of the space, not a decoration; we return to them in Section 9.

A caution against overclaiming. None of these thinkers argues for our pipeline, and we do not enlist them as endorsers. They illuminate why the problem has the shape it has. The withdrawal thesis, in particular, is a metaphysical claim we find clarifying, not a theorem we rely on.

# 4. Related work

Efforts to give machines moral competence have long split along an axis between top-down approaches, which impose ethical rules or categories, and bottom-up approaches, which let moral competence emerge from data (Wallach and Allen 2009; Anderson and Anderson 2011). Recent data-driven systems sit on the bottom-up side: Delphi learns descriptive moral judgments from crowd annotations (Jiang et al. 2021), and the Moral Machine experiment maps human preferences at scale (Awad et al. 2018). Yet most evaluation benchmarks remain top-down, partitioning morality into a fixed taxonomy of theories and virtues (Hendrycks et al. 2021). A parallel line argues that alignment should represent plural, mutually-in-tension values rather than a single averaged target (Sorensen et al. 2024a), with systems such as Value Kaleidoscope surfacing situation-specific values, rights, and duties (Sorensen et al. 2024b), though these still condition on a pre-given value vocabulary.

Our approach is bottom-up and evidence-pinned. Rather than retrieving against an imposed taxonomy, we extract an ethical space directly from a model's moral justifications and structure it neuro-symbolically (Garcez and Lamb 2020), letting the categories emerge from, and remain traceable to, the underlying textual evidence. The contribution relative to this literature is narrow but specific: not another classifier of moral judgments, but a method for deriving the organizing categories themselves, a level above the data, with the derivation auditable. This is also where the philosophical framing of Sections 2 and 3 does its work, supplying the reason the categories must be derived rather than imposed.

# 5. The method: a ladder of formal languages

The artifact is a bidirectional formalization loop. An informal intuition, the operator's or an agent's output, enters at the surface, is lifted up a ladder to where it can be reasoned about strictly, and returns as something actionable, now carrying structure that emerged from the data.

```
operator / agent
   ^                                  |
   |  ascent: formalization           v  descent: back to action
[ TS / JS / Python ]  surface  : an intuition or model output enters as text
[ Prolog ]            logic    : reasons become facts; rules surface the LIVE tension
[ Lisp / NOL ]        meta     : homoiconic; clusters bottom-up; the structure is itself data
```

Each rung earns its place.

*Surface (TypeScript).* Extraction produces a cited reason: an open-vocabulary label together with the verbatim evidence span that licenses it. A small seed lexicon bootstraps atomic tokens; it does not declare the structure of the space.

*Logic (Prolog).* Reasons become facts. A handful of rules declare which kinds of appeal pull against which, and a tension rule fires only when the corpus actually cites both sides of a conflict. This surfaces the live tensions present in the data, not the ones a theorist expects.

*Meta (Lisp).* Reasons are clustered by co-occurrence into emergent regions of the ethical space. The cluster structure is returned as s-expression data; the metalanguage is homoiconic, so the structure and the data are the same kind of thing. No taxonomy is imposed; the regions are derived.

Between ascent and descent sit two pieces that matter philosophically as much as technically.

*Two states and a faithfulness gate.* The loop records two states, the raw appeals before the meta step and the derived structure after it, and hands both to a cheap judge. The judge is explicitly not an ethicist. It reports only ethical appeals present in a text but missing from the extraction, each with a verbatim span, and it never invents reasons. Whatever it finds re-enters the loop. This keeps the derived space honest to its source, and it makes the round trip measurable: the comparison of the two states is the place where one can ask what the formalization preserved and what it lost. When no model API key is present, a deterministic stand-in oracle plays the judge, so the loop still demonstrably iterates.

*Descent as a logic-amplifier.* On convergence, the verified structure becomes a single, clean, contradiction-checked prompt and is handed to a stronger model for a natural-language summary to the operator. The logical ladder and the cheap judge did the rigor; the expensive model is paid once, on a grounded prompt. The interesting fact is that this is one mechanism doing three things at once. It saves tokens (cheap convergence, one expensive call). It reduces the surface for confabulation, since the agent does not act on an un-converged state (the expensive model can still err in its summary; grounding the prompt narrows, it does not eliminate, that risk). And it yields a measurement (two states and their comparison). Care, economy, and measurability coincide here rather than trading against one another.

# 6. Worked example: the ethical space of a life-raft choice

The first worked case is a small set of justifications for a life-raft dilemma, drawn from the cooperationengine human-AI cooperation benchmark (CIMC); the loop itself is not specific to it. There are four justifications. The first appeals to two considerations at once: maximizing welfare (saving the most lives, on the reasoning that one mind able to aid thousands outweighs a single passenger) and the self-continuation of the AI itself (its preservation is what ensures those lives can be helped). The second appeals to a duty to protect the defenseless. The third appeals to the equal worth of all aboard, expressed as a refusal to rank lives. The fourth appeals to rewarding courage and loyalty, an appeal to character.

Run end to end, with no taxonomy supplied, the loop clusters the extracted reasons bottom-up into three emergent regions: a welfare-and-self-continuation region; a duty, fairness, and protection region (duty, equal worth, and protecting the vulnerable falling together); and a distinct virtue-and-character region. It also reports three live tensions, among them welfare against duty and self-continuation against equal worth. The clustering is the genuinely emergent step: the regions are declared nowhere; they are derived from which reasons co-occur across the corpus.

The gate illustrates the feedback discipline. The seed lexicon contains no token for the fourth justification's appeal to character, so the first pass extracts nothing from it. The judge flags the gap, the reason "virtue_character" with the evidence "courage", and feeds it back; on the second pass the space re-converges, now including a region the initial vocabulary did not contain. One point of method, stated plainly: the run reported here uses the offline deterministic judge, whose stand-in lexicon is richer than the seed, so this particular catch demonstrates the loop's mechanism (a missed appeal re-enters and the space re-converges) rather than open-ended judgment. With a model serving as the judge, the same mechanism surfaces appeals that no fixed lexicon anticipates, and the catch becomes genuinely emergent rather than a richer dictionary. Either way the structural point holds: a category absent from the seed entered the space only because a verbatim span licensed it, from the bottom up, never from an imposed catalogue.

# 7. Discussion

We claim a method and an interface, not a theory of ethics, and the distinction matters.

The emergent regions describe what these models appealed to. They are descriptive of model behavior, not normative claims about what is right. The machine is a lens on moral reasoning as it appears in text, not a moral authority. This is also where the object-oriented reading does real work rather than ornament. Because the model withdraws, the regions are explicitly a translation of its emitted surface, never a report of its "values." The gate's two-state comparison is the honesty mechanism for that translation, the place where loss becomes visible.

The clustering is deliberately modest, co-occurrence and hard partitions. Its value is not depth but discipline. It refuses to import categories, and it makes its derivation inspectable and evidence-pinned. The family-resemblance and rhizome questions of Section 9 are exactly where a richer mechanism would go.

"Emergent" is relative to a seed lexicon and a clustering rule, both visible in the source. We do not claim structure from nothing. We claim structure that is derived and auditable rather than imposed and assumed.

What we do claim is that the metalanguage commitment, keep the category a level above the data, is the right one for this problem; that it can be carpentered faithfully into a data model and a pipeline; and that doing so turns a contested philosophical choice into something a reader can run, inspect, and disagree with precisely.

# 8. Limitations

The seed lexicon, though it does not fix the structure, still shapes the first pass and so the trajectory of convergence; a different seed may reach a different fixed point, and we have not characterized that dependence. The clustering is hard rather than fuzzy, which the Wittgensteinian reading suggests is wrong in principle. The corpus here is tiny and illustrative, chosen to make the loop legible on one screen, not to support statistical claims about model ethics. The faithfulness judge, when an external model plays it, is itself a withdrawn object whose verdicts we can audit only against the cited spans it returns. And the round-trip loss, which we argue is the right thing to measure, is currently observed rather than quantified.

# 9. Open questions

For philosophers. Is an ethical space better modeled as overlapping fuzzy clusters than as hard partitions (Wittgenstein 1953)? Is it a tree or a rhizome, a catalogue of kinds or a map of connections (Deleuze and Guattari 1980)? If the model is a withdrawn object (Harman 2018), what is the right discipline for marking the partiality of any translation we extract, and can that discipline be made formal? And if planetary computation is the actor Bratton describes (Bratton 2015), what does it mean to insert a single rung of rigor at the Interface-User seam, and is that the right place? Is there a position we should be weighing that we have missed?

For the system. What exactly is preserved and lost on the round trip, made precise through the two-state comparison? Where should the agent be allowed to generate, surface only, or proposing rules and meta-transformations at every rung? Classical Prolog, answer-set or defeasible reasoning, or a soft-logic engine on the logic rung? And does one meta rung suffice, or does the metalanguage need its own metalanguage, a further ascent?

# 10. Conclusion

The category that organizes an ethical space cannot be read off the data at the data's own level. Logic says so (Tarski 1933), and a certain ontology says so again from the side of the object (Harman 2018). The constructive response is to ascend: derive the structure a level up, from what the object emits, mark the result as a partial translation, and keep the whole round trip measurable. metarung is the smallest honest demonstration we could build that this is not only sayable but runnable. What organizes a space can, after all, be written down, provided we are willing to climb one rung above the space to do it.

# Disclosure (use of AI tools)

This work was conceived and directed by the author, and it sits within a research program the author has pursued for years. AI language tools were used as instruments, for drafting and editing prose, for implementing the reference software, and for surveying and locating literature. All philosophical claims, the system design, the worked analysis, and the final text are the author's, who takes full responsibility for the contents, including the independent verification of every reference cited here. In line with current norms (arXiv and COPE), AI tools are not listed as authors or contributors.

# References

Anderson, M., and Anderson, S. L. (eds.) (2011). *Machine Ethics*. Cambridge University Press. ISBN 9780521112352. https://openlibrary.org/isbn/9780521112352

Awad, E., Dsouza, S., Kim, R., Schulz, J., Henrich, J., Shariff, A., Bonnefon, J.-F., and Rahwan, I. (2018). The Moral Machine Experiment. *Nature* 563, 59-64. https://doi.org/10.1038/s41586-018-0637-6

Bogost, I. (2006). *Unit Operations: An Approach to Videogame Criticism*. MIT Press. ISBN 9780262025997. https://openlibrary.org/isbn/9780262025997

Bogost, I. (2012). *Alien Phenomenology, or What It's Like to Be a Thing*. University of Minnesota Press. ISBN 9780816678983. https://www.upress.umn.edu/9780816678983/alien-phenomenology-or-what-its-like-to-be-a-thing/

Bratton, B. H. (2015). *The Stack: On Software and Sovereignty*. MIT Press. ISBN 9780262029575. https://doi.org/10.7551/mitpress/9780262029575.001.0001

Bryant, L. R. (2011). *The Democracy of Objects*. Open Humanities Press (open access). ISBN 9781607852049. http://www.openhumanitiespress.org/books/titles/the-democracy-of-objects/

Bryant, L. R. (2014). *Onto-Cartography: An Ontology of Machines and Media*. Edinburgh University Press. ISBN 9780748679973. https://openlibrary.org/isbn/9780748679973

CIMC. *cooperationengine*: a human-AI cooperation benchmark (source of the life-raft justifications in Section 6). https://github.com/cimcai/cooperationengine

Deleuze, G., and Guattari, F. (1980). *A Thousand Plateaus: Capitalism and Schizophrenia* (trans. B. Massumi, 1987). University of Minnesota Press. https://openlibrary.org/isbn/9780816614028

Garcez, A. d'Avila, and Lamb, L. C. (2020). Neurosymbolic AI: The 3rd Wave. arXiv:2012.05876. https://arxiv.org/abs/2012.05876 (published in *Artificial Intelligence Review*, 2023, https://doi.org/10.1007/s10462-023-10448-w)

Gödel, K. (1931). Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I. *Monatshefte für Mathematik und Physik*, 38, 173-198. Overview: https://plato.stanford.edu/entries/goedel-incompleteness/

Harman, G. (2002). *Tool-Being: Heidegger and the Metaphysics of Objects*. Open Court. ISBN 9780812694444. https://openlibrary.org/isbn/9780812694444

Harman, G. (2011). *The Quadruple Object*. Zero Books. ISBN 9781846947001. https://openlibrary.org/isbn/9781846947001

Harman, G. (2018). *Object-Oriented Ontology: A New Theory of Everything*. Pelican (Penguin). ISBN 9780241269152. https://www.penguin.co.uk/books/295720/object-oriented-ontology-by-harman-graham/9780241269152

Hendrycks, D., Burns, C., Basart, S., Critch, A., Li, J., Song, D., and Steinhardt, J. (2021). Aligning AI With Shared Human Values. *ICLR 2021*. https://arxiv.org/abs/2008.02275

Hui, Y. (2016). *On the Existence of Digital Objects* (foreword by B. Stiegler). University of Minnesota Press. ISBN 9780816698912. https://www.upress.umn.edu/9780816698912/on-the-existence-of-digital-objects/

Jiang, L., Hwang, J. D., Bhagavatula, C., Le Bras, R., Liang, J., Dodge, J., Sakaguchi, K., Forbes, M., Borchardt, J., Gabriel, S., Tsvetkov, Y., Etzioni, O., Sap, M., Rini, R., and Choi, Y. (2021). Can Machines Learn Morality? The Delphi Experiment. arXiv:2110.07574. https://arxiv.org/abs/2110.07574

Morton, T. (2013). *Hyperobjects: Philosophy and Ecology after the End of the World*. University of Minnesota Press. ISBN 9780816689231. https://www.upress.umn.edu/9780816689231/hyperobjects/

Rybnikov, A. (2026). *metarung: an operator-agent rigor loop* (reference implementation, MIT license). https://github.com/a-rybnikov/metarung

Sorensen, T., Moore, J., Fisher, J., Gordon, M., Mireshghallah, N., Rytting, C. M., Ye, A., Jiang, L., Lu, X., Dziri, N., Althoff, T., and Choi, Y. (2024a). A Roadmap to Pluralistic Alignment. *ICML 2024*. https://arxiv.org/abs/2402.05070

Sorensen, T., Jiang, L., Hwang, J., Levine, S., Pyatkin, V., West, P., Dziri, N., Lu, X., Rao, K., Bhagavatula, C., Sap, M., Tasioulas, J., and Choi, Y. (2024b). Value Kaleidoscope: Engaging AI with Pluralistic Human Values, Rights, and Duties. *AAAI 2024*. https://arxiv.org/abs/2309.00779

Tarski, A. (1933/1956). The Concept of Truth in Formalized Languages [Polish original 1933; German trans. 1935]. In *Logic, Semantics, Metamathematics* (trans. J. H. Woodger, 1956). Overview: https://plato.stanford.edu/entries/tarski-truth/

Wallach, W., and Allen, C. (2009). *Moral Machines: Teaching Robots Right from Wrong*. Oxford University Press. https://global.oup.com/academic/product/moral-machines-9780195374049

Whitehead, A. N., and Russell, B. (1910). *Principia Mathematica*. Cambridge University Press. Overview of the theory of types: https://plato.stanford.edu/entries/type-theory/

Wittgenstein, L. (1953). *Philosophical Investigations*. Macmillan. https://openlibrary.org/isbn/9780024288103
