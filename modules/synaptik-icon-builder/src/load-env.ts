import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { getRepoRoot } from './repo-root.js';
import { getWorkspaceRoot } from './workspace-root.js';

let loaded = false;

function tryRepoRoot(): string | null {
  try {
    return getRepoRoot();
  } catch {
    return null;
  }
}

function recordLoadedEnvFile(filePath: string): void {
  const resolved = path.resolve(filePath);
  const prev = process.env.SYNAPTIK_ENV_LOADED_FILES ?? '';
  const parts = prev.split(path.delimiter).filter(Boolean);
  if (!parts.includes(resolved)) {
    parts.push(resolved);
    process.env.SYNAPTIK_ENV_LOADED_FILES = parts.join(path.delimiter);
  }
}

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  config({ path: filePath, override: true });
  recordLoadedEnvFile(filePath);
}

/** Load synaptik.local.env from cwd upward (sets SYNAPTIK_WORKSPACE_ROOT / SYNAPTIK_ENV_FILE). */
function loadSynaptikLocalBootstrap(): void {
  let dir = process.cwd();
  for (let i = 0; i < 12; i++) {
    const local = path.join(dir, 'synaptik.local.env');
    if (fs.existsSync(local)) {
      loadEnvFile(local);
      return;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}

/**
 * Load API keys for Synaptik (server/CLI only).
 * Order (later overrides): AICADS repo .env → workspace .env → SYNAPTIK_ENV_FILE.
 * Bootstrap: synaptik.local.env (variant A for multi-repo local work).
 */
export function loadSynaptikEnv(): void {
  if (loaded) return;

  loadSynaptikLocalBootstrap();

  const workspace = getWorkspaceRoot();
  const repoRoot = tryRepoRoot();
  const files: string[] = [];

  if (repoRoot) {
    files.push(
      path.join(repoRoot, '.env'),
      path.join(repoRoot, '.env.local'),
      path.join(repoRoot, 'modules', 'synaptik-icon-builder', '.env'),
    );
  }

  files.push(path.join(workspace, '.env'), path.join(workspace, '.env.local'));

  const explicit = process.env.SYNAPTIK_ENV_FILE?.trim();
  if (explicit) {
    files.push(path.resolve(explicit));
  }

  const seen = new Set<string>();
  for (const p of files) {
    const key = path.resolve(p);
    if (seen.has(key)) continue;
    seen.add(key);
    loadEnvFile(key);
  }

  loaded = true;
}

export function resetSynaptikEnvCache(): void {
  loaded = false;
  delete process.env.SYNAPTIK_ENV_LOADED_FILES;
}
