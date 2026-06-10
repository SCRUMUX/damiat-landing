#!/usr/bin/env node
/**
 * Regenerate ai-patterns.json version stamp (optional dry-run).
 * Usage: node scripts/build-patterns.mjs [--dry]
 */

import { readPatternsManifest, PATTERNS_PATH } from './patterns-shared.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const dry = process.argv.includes('--dry');
const manifest = readPatternsManifest();
manifest.version = pkg.version;

if (dry) {
  console.log(JSON.stringify(manifest, null, 2));
  process.exit(0);
}

writeFileSync(PATTERNS_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`build-patterns: wrote ${PATTERNS_PATH} (version ${manifest.version})`);
