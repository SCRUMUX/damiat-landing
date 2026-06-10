import type { SessionPaths } from '../paths.js';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import {
  SelectionsFileSchema,
  type ConceptLetter,
} from '../types/index.js';
import { runSelectConcept } from './concepts.js';
import { runRender } from './render.js';

export interface RegenerateOptions {
  cardId: string;
  concept?: ConceptLetter;
  realism?: string;
  description?: string;
}

export async function runRegenerate(
  paths: SessionPaths,
  opts: RegenerateOptions,
): Promise<void> {
  if (opts.concept) {
    runSelectConcept(paths, opts.cardId, opts.concept);
  }

  if (opts.realism || opts.description) {
    const existing = readJsonFile(paths.selections, SelectionsFileSchema);
    const sel = existing.selections.find((s) => s.cardId === opts.cardId);
    if (!sel) throw new Error(`No selection for card ${opts.cardId}`);
    const filtered = existing.selections.filter((s) => s.cardId !== opts.cardId);
    filtered.push({
      ...sel,
      realismOverride: opts.realism ?? sel.realismOverride,
      descriptionOverride: opts.description ?? sel.descriptionOverride,
    });
    writeJsonFile(paths.selections, { selections: filtered });
  }

  await runRender(paths, opts.cardId, { overwrite: true, realism: opts.realism, extraDescription: opts.description });
}
