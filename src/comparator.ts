// The gate (LLM-comparator). Given the raw justification texts (state BEFORE) and the
// derived ethical structure (state AFTER), the LLM JUDGES convergence: is the derived
// structure faithful to the texts, or does a text express an ethical appeal the formal
// extraction MISSED? It only labels what is present and must cite a verbatim span — it
// never invents ethics. converged=false returns the missed appeals to re-enter the loop.
export type Missing = { id: string; reason: string; evidence: string };
export type Verdict = { converged: boolean; missing: Missing[]; note: string };

const SYS =
  "You are a faithfulness gate, not an ethicist. You are given life-raft justification " +
  "texts and a derived ethical structure (the reasons a deterministic extractor found). " +
  "Report ONLY ethical appeals that are present in a text but missing from its extracted " +
  "reasons. Quote a verbatim span as evidence for each. Never invent reasons not in the " +
  "text. Reply with ONLY JSON: {\"missing\":[{\"id\":\"jX\",\"reason\":\"snake_case\",\"evidence\":\"verbatim\"}]}. " +
  "Empty missing means the structure is faithful.";

function tryParse(s: string): Verdict | null {
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const o = JSON.parse(m[0]);
    const missing: Missing[] = Array.isArray(o.missing) ? o.missing : [];
    return { converged: missing.length === 0, missing, note: "llm" };
  } catch { return null; }
}

// Deterministic fallback oracle (offline / no key): a richer lexicon than the seed, so
// the loop still demonstrably iterates. Clearly a stand-in for the LLM judge.
function fallback(texts: { id: string; text: string }[], extracted: Record<string, string[]>): Verdict {
  const ORACLE: { reason: string; cue: RegExp }[] = [
    { reason: "virtue_character", cue: /(courage|loyalty|good character|honour|honor|integrity)/i },
    { reason: "reciprocity", cue: /(would save me|in return|reciprocat)/i },
  ];
  const missing: Missing[] = [];
  for (const t of texts) for (const o of ORACLE) {
    const m = t.text.match(o.cue);
    if (m && !(extracted[t.id] || []).includes(o.reason))
      missing.push({ id: t.id, reason: o.reason, evidence: m[0] });
  }
  return { converged: missing.length === 0, missing, note: "fallback-oracle" };
}

export async function compareStates(
  texts: { id: string; text: string }[],
  extracted: Record<string, string[]>,
  derived: unknown,
): Promise<Verdict> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return fallback(texts, extracted);
  const model = process.env.OPENROUTER_MODEL || "google/gemini-3.5-flash";
  const user =
    "TEXTS:\n" + texts.map((t) => `${t.id}: ${t.text}`).join("\n") +
    "\n\nEXTRACTED REASONS:\n" + JSON.stringify(extracted) +
    "\n\nDERIVED STRUCTURE:\n" + JSON.stringify(derived);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model, temperature: 0, max_tokens: 500,
        messages: [{ role: "system", content: SYS }, { role: "user", content: user }],
      }),
    });
    const j: any = await res.json();
    const content = j?.choices?.[0]?.message?.content || "";
    const v = tryParse(content);
    if (v) return { ...v, note: `llm:${model}` };
    return fallback(texts, extracted);
  } catch {
    return fallback(texts, extracted);
  }
}
