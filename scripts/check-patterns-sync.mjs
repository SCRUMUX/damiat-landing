#!/usr/bin/env node
/**
 * Validate ai-patterns.json against on-disk block folders.
 * Usage: node scripts/check-patterns-sync.mjs
 */

import { readPatternsManifest, validatePatternsSync, PATTERNS_PATH } from './patterns-shared.mjs';

const manifest = readPatternsManifest();
const { errors, warnings } = validatePatternsSync(manifest);

for (const w of warnings) {
  console.warn(`[patterns:check] warn: ${w}`);
}

if (errors.length) {
  console.error(`[patterns:check] FAILED (${errors.length} errors):`);
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(`[patterns:check] OK — ${Object.keys(manifest.patterns || {}).length} patterns, ${Object.keys(manifest.pageTemplates || {}).length} page templates (${PATTERNS_PATH})`);
