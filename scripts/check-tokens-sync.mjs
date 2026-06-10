#!/usr/bin/env node
/**
 * Verify tokens.css matches ai-ds-spec.json (via build-tokens output).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_PATH = path.join(ROOT, 'config/css-variables/tokens.css');

const before = fs.readFileSync(TOKENS_PATH, 'utf8');

execSync('node scripts/build-tokens.mjs', { cwd: ROOT, stdio: 'pipe' });

const after = fs.readFileSync(TOKENS_PATH, 'utf8');

function normalize(css) {
  return css.replace(/\r\n/g, '\n').trim();
}

if (normalize(before) !== normalize(after)) {
  fs.writeFileSync(TOKENS_PATH, before, 'utf8');
  console.error('[tokens:check] FAIL: tokens.css is out of sync with ai-ds-spec.json.');
  console.error('  Run: npm run tokens:build');
  process.exit(1);
}

console.log('[tokens:check] OK — tokens.css matches ai-ds-spec.json.');
