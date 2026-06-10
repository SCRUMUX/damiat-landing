import fs from 'node:fs';
import path from 'node:path';
import { getRepoRoot } from './repo-root.js';

let cachedWorkspace: string | null = null;

const SYNAPTIK_UI_PACKAGE = '@synaptik/icon-builder-ui';

function readPackageName(dir: string): string | null {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { name?: string };
    return typeof pkg.name === 'string' ? pkg.name : null;
  } catch {
    return null;
  }
}

function hasSynaptikConfig(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'synaptik.config.json'));
}

/** Walk up from startDir; prefer synaptik.config.json, skip Synaptik UI package root. */
function resolveWorkspaceFromCwd(startDir: string): string | null {
  let dir = startDir;
  let fallbackPkgDir: string | null = null;

  for (let i = 0; i < 12; i++) {
    if (hasSynaptikConfig(dir)) {
      return dir;
    }

    const name = readPackageName(dir);
    if (name) {
      if (name !== SYNAPTIK_UI_PACKAGE && !fallbackPkgDir) {
        fallbackPkgDir = dir;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return fallbackPkgDir;
}

/** Product repo root (consumer app) or AICADS monorepo root. */
export function getWorkspaceRoot(): string {
  const override =
    process.env.SYNAPTIK_WORKSPACE_ROOT?.trim() ||
    process.env.AICADS_REPO_ROOT?.trim();
  if (override) return path.resolve(override);
  if (cachedWorkspace) return cachedWorkspace;

  const fromCwd = resolveWorkspaceFromCwd(process.cwd());
  if (fromCwd) {
    cachedWorkspace = fromCwd;
    return fromCwd;
  }

  try {
    cachedWorkspace = getRepoRoot();
    return cachedWorkspace;
  } catch {
    cachedWorkspace = process.cwd();
    return cachedWorkspace;
  }
}

export function resetWorkspaceRootCache(): void {
  cachedWorkspace = null;
}
