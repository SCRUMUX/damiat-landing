import type { SessionPaths } from '../paths.js';
import { MVP_DEFAULTS } from '../types/index.js';
import {
  runAnalyzeContentStructure,
  type AnalyzeContentOptions,
} from './content-structure.js';

/** CLI alias; delegates to block → card structure analysis. */
export async function runAnalyzeContent(
  paths: SessionPaths,
  maxCardsOrOpts?: number | AnalyzeContentOptions,
): Promise<void> {
  const opts: AnalyzeContentOptions =
    typeof maxCardsOrOpts === 'number'
      ? {
          maxBlocks: MVP_DEFAULTS.maxBlocks,
          maxCardsPerBlock: Math.min(
            MVP_DEFAULTS.maxCardsPerBlock,
            Math.max(1, Math.ceil(maxCardsOrOpts / MVP_DEFAULTS.maxBlocks)),
          ),
        }
      : (maxCardsOrOpts ?? {});

  await runAnalyzeContentStructure(paths, opts);
}
