// The "DB" — captures the two organic states (before the functional/meta step, and
// after the return through Prolog) so the comparator can judge convergence. Persisted
// to states.json to mirror the original NOL machine's database.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
export type StateLog = { iteration: number; before: unknown; after: unknown }[];
const log: StateLog = [];
export function record(iteration: number, before: unknown, after: unknown) {
  log.push({ iteration, before, after });
  writeFileSync(fileURLToPath(new URL("../states.json", import.meta.url)), JSON.stringify(log, null, 1));
}
