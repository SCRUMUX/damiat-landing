import { readJsonFile, writeJsonFile, fileExists } from '../fs-json.js';
import type { IconSetStyleId } from '../icon-set-styles/index.js';
import { parseIconSetStyleId } from '../icon-set-styles/index.js';
import type { SessionPaths } from '../paths.js';
import { SessionManifestSchema } from '../types/index.js';
import { runConcepts } from './concepts.js';
import { runIconStyleBible } from './icon-style-bible.js';

export async function runChangeIconSetStyle(
  paths: SessionPaths,
  iconSetStyleId: IconSetStyleId,
  opts: { refreshConcepts?: boolean } = {},
): Promise<{ styleBlock: string; iconSetStyleId: IconSetStyleId }> {
  if (!parseIconSetStyleId(iconSetStyleId)) {
    throw new Error(`Invalid iconSetStyleId: ${iconSetStyleId}`);
  }

  if (fileExists(paths.manifest)) {
    const manifest = readJsonFile(paths.manifest, SessionManifestSchema);
    manifest.iconSetStyleId = iconSetStyleId;
    writeJsonFile(paths.manifest, manifest);
  }

  const bible = await runIconStyleBible(paths, { force: true, iconSetStyleId });

  if (opts.refreshConcepts) {
    const { runSemanticInterpret } = await import('../semantic/interpret.js');
    await runSemanticInterpret(paths, { force: true });
    await runConcepts(paths, {});
  }

  return { styleBlock: bible.styleBlock, iconSetStyleId: bible.iconSetStyleId };
}
