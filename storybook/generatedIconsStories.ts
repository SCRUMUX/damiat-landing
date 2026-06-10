import path from 'node:path';

export interface GeneratedIconsStoryOptions {
  /** Storybook project root (parent of `.storybook`). */
  projectRoot: string;
  /** Absolute path to `.storybook` (story globs are relative to this). */
  storybookDir?: string;
  /**
   * Catalog root: absolute path, or relative to `projectRoot`.
   * Default monorepo: `generated-icons` at repo root.
   */
  generatedIconsDir?: string;
}

/** Resolve catalog directory on disk. */
export function resolveGeneratedIconsDir(opts: GeneratedIconsStoryOptions): string {
  const raw = opts.generatedIconsDir?.trim();
  if (!raw) {
    return path.resolve(opts.projectRoot, '..', '..', 'generated-icons');
  }
  return path.isAbsolute(raw) ? raw : path.resolve(opts.projectRoot, raw);
}

/**
 * Story glob(s) for Synaptik raster catalog (relative to Storybook `projectRoot`).
 * Pass to `createMainConfig({ extraStories: generatedIconsStoryGlobs(...) })`.
 */
export function generatedIconsStoryGlobs(opts: GeneratedIconsStoryOptions): string[] {
  const abs = resolveGeneratedIconsDir(opts);
  const storybookDir = opts.storybookDir ?? path.join(opts.projectRoot, '.storybook');
  const rel = path.relative(storybookDir, abs).replace(/\\/g, '/');
  const prefix = rel.startsWith('.') ? rel : `./${rel}`;
  return [`${prefix}/**/*.stories.@(ts|tsx)`];
}
