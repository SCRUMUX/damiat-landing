#!/usr/bin/env node
/**
 * Verify that `ai-manifest.json` is in sync with the public barrel and the
 * contracts on disk. Non-zero exit blocks CI.
 *
 * Checks:
 *   1. Every barrel export has a manifest entry.
 *   2. Every manifest entry maps to a real barrel export.
 *   3. Every non-null contract path points to an existing file.
 *   4. The on-disk manifest equals what build-manifest would produce.
 */

import {
  buildExpectedManifest,
  readBarrelExports,
  readContractFiles,
  readManifest,
  resolveContract,
  serializeManifest,
} from './manifest-shared.mjs';

const manifest = readManifest();
const components = manifest.components ?? {};
const barrel = readBarrelExports();
const contractFiles = readContractFiles();

const errors = [];

for (const name of barrel) {
  if (!(name in components)) {
    errors.push(
      `Missing manifest entry for barrel export "${name}". ` +
        `Add a {role, engine} block to ai-manifest.json.`,
    );
  }
}

for (const [name, meta] of Object.entries(components)) {
  if (!barrel.has(name)) {
    errors.push(
      `Manifest declares "${name}" but it is not exported from ` +
        `components/index.ts. Remove the entry or restore the export.`,
    );
  }
  if (meta.contract && !contractFiles.has(meta.contract)) {
    errors.push(
      `Manifest references contract "${meta.contract}" for "${name}", ` +
        `but the file does not exist in contracts/components/.`,
    );
  }
  const expectedContract = resolveContract(name, contractFiles);
  if (expectedContract !== null && meta.contract !== expectedContract) {
    errors.push(
      `Contract drift for "${name}": manifest says ` +
        `"${meta.contract ?? 'null'}", but contracts/components/ has ` +
        `"${expectedContract}".`,
    );
  }
}

const { expected } = buildExpectedManifest(manifest);
if (serializeManifest(expected) !== serializeManifest(manifest)) {
  errors.push(
    'ai-manifest.json is stale. Run `node scripts/build-manifest.mjs` ' +
      'to regenerate.',
  );
}

if (errors.length > 0) {
  console.error('[check-manifest-sync] FAIL:\n');
  for (const e of errors) console.error('  - ' + e);
  console.error(
    `\n${errors.length} error(s). Fix and re-run.`,
  );
  process.exit(1);
}

console.log(
  `[check-manifest-sync] OK (${Object.keys(components).length} components, ` +
    `${contractFiles.size} contracts).`,
);
