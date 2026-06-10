#!/usr/bin/env node
/**
 * Start Synaptik UI with variant A env (shared .env + product workspace).
 *
 * Monorepo (keys + workspace = AICADS-PRO root):
 *   npm run synaptik:ui
 *
 * Product repo (icons in product, keys from AICADS .env):
 *   npm run synaptik:ui -- --workspace C:/path/to/product
 *   (product should contain synaptik.local.env or synaptik.config.json)
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = path.join(repoRoot, 'modules', 'synaptik-icon-builder', 'ui');

function parseWorkspaceArg() {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === '--workspace' || argv[i] === '-w') && argv[i + 1]) {
      return path.resolve(argv[++i]);
    }
    if (!argv[i].startsWith('-')) return path.resolve(argv[i]);
  }
  return null;
}

const workspaceArg = parseWorkspaceArg();

function loadBootstrapEnv(dir) {
  const local = path.join(dir, 'synaptik.local.env');
  if (fs.existsSync(local)) {
    config({ path: local, override: true });
    console.log(`[synaptik] Loaded ${local}`);
    return true;
  }
  return false;
}

if (workspaceArg) {
  process.env.SYNAPTIK_WORKSPACE_ROOT = workspaceArg;
  loadBootstrapEnv(workspaceArg);
} else {
  loadBootstrapEnv(repoRoot);
}

if (!process.env.SYNAPTIK_ENV_FILE?.trim()) {
  const shared = path.join(repoRoot, '.env');
  if (fs.existsSync(shared)) {
    process.env.SYNAPTIK_ENV_FILE = shared;
  }
}

if (!process.env.SYNAPTIK_WORKSPACE_ROOT?.trim()) {
  process.env.SYNAPTIK_WORKSPACE_ROOT = workspaceArg ?? repoRoot;
}

console.log('[synaptik] SYNAPTIK_WORKSPACE_ROOT =', process.env.SYNAPTIK_WORKSPACE_ROOT);
console.log('[synaptik] SYNAPTIK_ENV_FILE =', process.env.SYNAPTIK_ENV_FILE ?? '(repo/workspace .env chain)');

const child = spawn('npm', ['run', 'dev:reset'], {
  cwd: uiDir,
  env: { ...process.env },
  shell: true,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code ?? 1));
