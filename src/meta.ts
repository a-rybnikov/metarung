// Rung 3 bridge — call SBCL, get emergent clusters back. The meta rung lives in
// Lisp because the structure (clusters) is itself data; here we just shuttle.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function clusterReasons(groups: string[][]): string[][] {
  const sexpr = "(" + groups.map((g) => "(" + g.join(" ") + ")").join(" ") + ")";
  const script = fileURLToPath(new URL("./meta.lisp", import.meta.url));
  const r = spawnSync("sbcl", ["--script", script], { input: sexpr, encoding: "utf-8" });
  const out = (r.stdout || "").trim();
  const clusters: string[][] = [];
  const m = out.match(/\(([^()]+)\)/g);
  if (m) for (const grp of m) clusters.push(grp.replace(/[()]/g, "").trim().toLowerCase().split(/\s+/));
  return clusters;
}
