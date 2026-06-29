// On convergence, the cheap gate hands a formally-amplified NL prompt to the FLAGSHIP.
// The logic ladder + cheap judge did the rigor; the flagship is paid once, on a clean,
// contradiction-checked, structurally-grounded prompt. A logic-amplifier.
export async function askFlagship(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_FLAGSHIP || "deepseek/deepseek-v4-pro";
  if (!key) return "[flagship skipped: no OPENROUTER_API_KEY; it would receive the amplified prompt above]";
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.3, max_tokens: 350,
        messages: [{ role: "user", content: prompt }] }),
    });
    const j: any = await res.json();
    const out = (j?.choices?.[0]?.message?.content || "[empty]").trim();
    return `${out}\n  (flagship: ${model})`;
  } catch { return "[flagship error]"; }
}
