// Minimal front-end: one screen showing an intuition climb the ladder and return.
// No framework, no build step — node:http renders the canonical trace as a single page.
import { createServer } from "node:http";
import { runLoop, type Trace } from "./run.ts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chip = (s: string, cls = "") => `<span class="chip ${cls}">${esc(s)}</span>`;

function page(t: Trace): string {
  const offline = t.flagship.startsWith("[flagship skipped");
  const justs = t.justifications
    .map((j) => `<div class="row"><b>${j.id}</b><span class="txt">${esc(j.text)}</span></div>`)
    .join("");
  const surface = t.surfaced
    .map(
      (s) =>
        `<div class="row"><b>${s.id}</b><span>${s.reasons
          .map((r) => `${chip(r.reason)}<span class="ev">&ldquo;${esc(r.evidence)}&rdquo;</span>`)
          .join(" ")}</span></div>`,
    )
    .join("");
  const tensions = t.tensions.map((x) => `<div class="tension">${esc(x)}</div>`).join("");
  const regions = t.regions
    .map((c, i) => `<div class="region"><b>region ${i + 1}</b> ${c.map((r) => chip(r, "emg")).join(" ")}</div>`)
    .join("");
  const passes = t.passes
    .map((p) => {
      const found = p.gate.missing
        .map((m) => `<div class="found">pass ${p.iter}: gate found <b>${esc(m.reason)}</b> in ${m.id} &larr; &ldquo;${esc(m.evidence)}&rdquo;</div>`)
        .join("");
      return (
        found +
        `<div class="verdict ${p.gate.converged ? "ok" : "no"}">pass ${p.iter} &middot; gate (${esc(p.gate.note)}): ${p.gate.converged ? "CONVERGED" : "not converged — re-entering loop"}</div>`
      );
    })
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>metarung — Tarski's Ladder</title>
<style>
  :root{--bg:#0d1117;--fg:#c9d1d9;--mut:#8b949e;--acc:#58a6ff;--emg:#3fb950;--ten:#f0883e;--card:#161b22;--bd:#30363d}
  *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--fg);
    font:15px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:28px}
  .wrap{max-width:980px;margin:0 auto}
  h1{font-size:21px;margin:0 0 2px} .sub{color:var(--mut);margin:0 0 22px}
  .rung{background:var(--card);border:1px solid var(--bd);border-radius:9px;padding:14px 16px;margin:10px 0}
  .rung h2{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--acc);margin:0 0 10px}
  .rung .lang{color:var(--mut);font-weight:400;letter-spacing:0;text-transform:none}
  .row{display:flex;gap:10px;padding:3px 0;align-items:baseline}
  .row b{color:var(--acc);min-width:24px} .txt{color:var(--fg)}
  .chip{display:inline-block;background:#1f2630;border:1px solid var(--bd);border-radius:5px;padding:1px 7px;margin:1px 2px;font-size:13px}
  .chip.emg{border-color:var(--emg);color:var(--emg)} .ev{color:var(--mut);font-style:italic;margin-left:4px;font-size:13px}
  .tension{color:var(--ten);padding:2px 0} .region{padding:4px 0} .region b{color:var(--mut)}
  .found{color:var(--emg);padding:2px 0} .verdict{padding:4px 0;color:var(--mut)}
  .verdict.ok{color:var(--emg)} .verdict.no{color:var(--ten)}
  .ladder{color:var(--mut);text-align:center;margin:6px 0 18px;font-size:13px}
  .ladder b{color:var(--fg)}
  pre{white-space:pre-wrap;background:#0b0f14;border:1px solid var(--bd);border-radius:7px;padding:12px;color:var(--mut);font-size:13px;margin:8px 0 0}
  .flag{color:var(--fg)} .note{color:var(--ten);font-size:13px}
  footer{color:var(--mut);font-size:12px;margin-top:22px;text-align:center}
</style></head><body><div class="wrap">
  <h1>metarung <span style="color:var(--mut);font-weight:400;font-size:15px">· Tarski's Ladder</span></h1>
  <p class="sub">An intuition climbs a ladder of formal languages and returns carrying structure
  that <b>emerged</b> from the data rather than being imposed — the Gödel/Tarski move as a running pipeline.</p>
  <div class="ladder">⟱ ascend: NL &rarr; <b>TS</b> &rarr; <b>Prolog</b> &rarr; <b>Lisp/meta</b> &nbsp;·&nbsp; descend: meta &rarr; gate &rarr; <b>flagship</b> &rarr; NL ⟰</div>

  <div class="rung"><h2>Rung 0 — surface <span class="lang">raw justifications (life-raft, cooperationengine #19)</span></h2>${justs}</div>
  <div class="rung"><h2>Rung 1 — surface formalization <span class="lang">TypeScript · cited reason + verbatim evidence, open vocabulary</span></h2>${surface}</div>
  <div class="rung"><h2>Rung 2 — logic <span class="lang">Prolog · live ethical tensions in the corpus</span></h2>${tensions}</div>
  <div class="rung"><h2>Rung 3 — meta <span class="lang">Lisp · emergent regions, clustered bottom-up (no taxonomy imposed)</span></h2>${regions}</div>
  <div class="rung"><h2>Gate — convergence <span class="lang">cheap judge compares the two states; what it missed re-enters the loop</span></h2>${passes}</div>
  <div class="rung"><h2>Descent — logic-amplifier <span class="lang">verified structure → one clean prompt → flagship</span></h2>
    <pre>${esc(t.amplifiedPrompt)}</pre>
    ${offline ? `<p class="note">${esc(t.flagship)}</p>` : `<pre class="flag">${esc(t.flagship)}</pre>`}
  </div>
  <footer>derived bottom-up, evidence-cited, contradiction-checked · the categories emerged from what the models said</footer>
</div></body></html>`;
}

const PORT = Number(process.env.PORT) || 8137;
const server = createServer(async (req, res) => {
  if (req.url !== "/" && req.url !== "") {
    res.writeHead(404).end("not found");
    return;
  }
  try {
    const t = await runLoop();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page(t));
  } catch (e) {
    res.writeHead(500).end("error: " + (e as Error).message);
  }
});
server.listen(PORT, () => console.log(`rigor-loop front-end → http://localhost:${PORT}`));
