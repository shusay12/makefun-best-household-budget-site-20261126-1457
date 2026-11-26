// main.ts — Ledger House entry program (Node 22, standard library only).
//
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-frontend.ts, so the dossier is byte for byte what the
// kit's library writes from the same files.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
// The program runs twice and both runs must write the same bytes, so
// nothing here depends on the clock, random values or directory order:
// file lists are sorted before they are copied.

import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = new URL(".", import.meta.url).pathname;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function sortedEntries(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort();
}

function copyTree(srcDir: string, destDir: string): void {
  mkdirSync(destDir, { recursive: true });
  for (const name of sortedEntries(srcDir)) {
    cpSync(join(srcDir, name), join(destDir, name), { recursive: true });
  }
}

function handIn(): void {
  // Start from an empty output directory so a stale file from an
  // earlier run can never leak into this entry.
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  copyTree(join(REPO_ROOT, "app"), join(OUT_DIR, "app"));
  copyTree(join(REPO_ROOT, "screenshots"), join(OUT_DIR, "screenshots"));

  const dossier = buildDossier(OUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(OUT_DIR, "dossier.json"), dossier);
}

handIn();
