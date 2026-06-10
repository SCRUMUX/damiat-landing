#!/usr/bin/env node
/**
 * CI-friendly registry check (no API keys).
 * Delegates to: npm run synaptik -- check
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(
  'npm',
  ['run', 'synaptik', '--', 'check'],
  { cwd: root, stdio: 'inherit', shell: true },
);
process.exit(result.status ?? 1);
