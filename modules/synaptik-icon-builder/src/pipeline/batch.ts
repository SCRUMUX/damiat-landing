import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import { AssetMetaSchema, SelectionsFileSchema } from '../types/index.js';
import { runRender } from './render.js';
import { runPublish, regenerateStorybookStories } from './publish.js';

export interface BatchResult {
  rendered: string[];
  skipped: string[];
  published: string[];
  publishSkipped: string[];
  errors: Array<{ cardId: string; step: string; message: string }>;
}

export async function runRenderAll(
  paths: SessionPaths,
  opts: { overwrite?: boolean } = {},
): Promise<BatchResult> {
  const result: BatchResult = {
    rendered: [],
    skipped: [],
    published: [],
    publishSkipped: [],
    errors: [],
  };

  const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
  if (selections.length === 0) {
    console.warn('No selections in selections.json — run select-concept first.');
    return result;
  }

  for (const sel of selections) {
    try {
      await runRender(paths, sel.cardId, { overwrite: opts.overwrite ?? true });
      result.rendered.push(sel.cardId);
    } catch (e) {
      result.errors.push({
        cardId: sel.cardId,
        step: 'render',
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return result;
}

export async function runPublishAll(
  paths: SessionPaths,
): Promise<BatchResult> {
  const result: BatchResult = {
    rendered: [],
    skipped: [],
    published: [],
    publishSkipped: [],
    errors: [],
  };

  if (!fs.existsSync(paths.rendersDir)) {
    console.warn('No renders directory.');
    return result;
  }

  for (const name of fs.readdirSync(paths.rendersDir)) {
    const metaPath = path.join(paths.rendersDir, name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    const cardId = meta.cardId;
    if (!cardId) {
      result.publishSkipped.push(name);
      continue;
    }
    try {
      await runPublish(paths, cardId, { deferStorybookRegen: true });
      result.published.push(cardId);
    } catch (e) {
      result.errors.push({
        cardId,
        step: 'publish',
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  if (result.published.length > 0) {
    regenerateStorybookStories();
  }

  return result;
}
