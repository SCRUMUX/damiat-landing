import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let cachedRoot: string | null = null;

/** AICADS repo root (contains package.json name @ai-ds/core). */
export function getRepoRoot(): string {
  const override = process.env.AICADS_REPO_ROOT?.trim();
  if (override) return path.resolve(override);
  if (cachedRoot) return cachedRoot;

  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { name?: string };
        if (pkg.name === '@ai-ds/core') {
          cachedRoot = dir;
          return dir;
        }
      } catch {
        // continue
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error('Could not find AICADS repo root (@ai-ds/core package.json).');
}
