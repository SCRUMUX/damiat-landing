#!/usr/bin/env node
/**
 * Regenerate `ai-manifest.json` from the public barrel + contracts on disk.
 *
 * - Preserves curated `role` / `engine` annotations from the existing manifest.
 * - Resolves `contract` paths from `contracts/components/`, handling both
 *   plain (`Button.contract.json`) and hyphenated (`Table-Cell.contract.json`)
 *   naming conventions.
 * - If a barrel-exported component has no `role`/`engine` annotation, the
 *   script aborts with a helpful message so a human can fill it in.
 *
 * Usage:
 *   node scripts/build-manifest.mjs           # write
 *   node scripts/build-manifest.mjs --dry     # print to stdout, no write
 */

import fs from 'node:fs';
import {
  buildExpectedManifest,
  readManifest,
  serializeManifest,
  MANIFEST_PATH,
} from './manifest-shared.mjs';

const dryRun = process.argv.includes('--dry');

const current = readManifest();
const { expected, missingAnnotations, orphanContracts } =
  buildExpectedManifest(current);

if (missingAnnotations.length > 0) {
  console.error(
    `\n[build-manifest] Cannot regenerate: the following barrel exports have ` +
      `no role/engine annotation in ai-manifest.json:\n  - ${missingAnnotations.join(
        '\n  - ',
      )}\n\nAdd a stub entry for each (role + engine) and re-run.\n`,
  );
  process.exit(2);
}

if (orphanContracts.length > 0) {
  console.warn(
    `[build-manifest] Warning: manifest declares components that are not ` +
      `exported from components/index.ts:\n  - ${orphanContracts.join(
        '\n  - ',
      )}\nThese will be removed from the regenerated manifest.\n`,
  );
}

const out = serializeManifest(expected);
if (dryRun) {
  process.stdout.write(out);
} else {
  fs.writeFileSync(MANIFEST_PATH, out, 'utf8');
  console.log(
    `[build-manifest] Wrote ${MANIFEST_PATH} (${Object.keys(
      expected.components,
    ).length} components).`,
  );
}
