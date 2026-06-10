import fs from 'node:fs';
import path from 'node:path';

/**
 * Local dev: prefer live DAMIAT/DAMIAT sibling.
 * Vercel / CI: fall back to bundled damiat-landing/core copy.
 */
export function resolveCoreRoot(siteDir: string): string {
  const bundledCore = path.resolve(siteDir, '../core');

  if (process.env.VERCEL || process.env.CI) {
    return bundledCore;
  }

  const siblingSource = path.resolve(siteDir, '../../DAMIAT');

  if (fs.existsSync(path.join(siblingSource, 'config/tailwind/tailwind.config.cjs'))) {
    return siblingSource;
  }

  return bundledCore;
}
