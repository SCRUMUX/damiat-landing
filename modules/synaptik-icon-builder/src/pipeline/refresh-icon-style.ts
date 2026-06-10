import { fileExists } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import { runSemanticInterpret } from '../semantic/interpret.js';
import { runConcepts } from './concepts.js';
import type { IconSetStyleId } from '../icon-set-styles/index.js';
import { runIconStyleBible } from './icon-style-bible.js';

export async function runRefreshIconStyle(
  paths: SessionPaths,
  opts: { refreshConcepts?: boolean; iconSetStyleId?: IconSetStyleId } = {},
): Promise<{ styleBlock: string; iconSetStyleId: IconSetStyleId }> {
  if (!fileExists(paths.styleDna)) {
    throw new Error('Style DNA missing. Run full analysis first.');
  }

  const bible = await runIconStyleBible(paths, {
    force: true,
    iconSetStyleId: opts.iconSetStyleId,
  });

  if (opts.refreshConcepts) {
    await runSemanticInterpret(paths, { force: true });
    await runConcepts(paths, {});
  }

  return { styleBlock: bible.styleBlock, iconSetStyleId: bible.iconSetStyleId };
}
