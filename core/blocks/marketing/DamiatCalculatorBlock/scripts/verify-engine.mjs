/**
 * Launcher for verify-engine.ts (Node cannot import .ts directly).
 * Run from DamiatCalculatorBlock: node scripts/verify-engine.mjs
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const tsEntry = path.join(dir, 'verify-engine.ts');

const run = spawnSync('npx', ['--yes', 'tsx', tsEntry], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(dir, '..'),
});

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}
