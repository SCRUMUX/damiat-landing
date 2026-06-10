import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  SelectionsFileSchema,
  type AssetMeta,
} from '../types/index.js';
import { runPublish, regenerateStorybookStories } from './publish.js';
import type { BatchResult } from './batch.js';

function findRenderMetaForCard(
  paths: SessionPaths,
  cardId: string,
): { meta: AssetMeta; dirName: string } | null {
  if (!fs.existsSync(paths.rendersDir)) return null;
  for (const name of fs.readdirSync(paths.rendersDir)) {
    const metaPath = path.join(paths.rendersDir, name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (meta.cardId !== cardId) continue;
    const png = path.join(paths.rendersDir, name, 'icon.png');
    if (!fs.existsSync(png)) continue;
    return { meta, dirName: name };
  }
  return null;
}

/** Card ids with a QA-passing render, not skipped, and a concept selection. */
export function listPublishReadyCardIds(paths: SessionPaths): string[] {
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  let selectionIds = new Set<string>();
  if (fs.existsSync(paths.selections)) {
    const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
    selectionIds = new Set(selections.map((s) => s.cardId));
  }

  const ready: string[] = [];
  for (const card of cards) {
    if (card.skipped) continue;
    if (selectionIds.size > 0 && !selectionIds.has(card.id)) continue;
    const found = findRenderMetaForCard(paths, card.id);
    if (!found) continue;
    if (found.meta.failedQa) continue;
    ready.push(card.id);
  }
  return ready;
}

export async function runPublishReady(paths: SessionPaths): Promise<BatchResult> {
  const result: BatchResult = {
    rendered: [],
    skipped: [],
    published: [],
    publishSkipped: [],
    errors: [],
  };

  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const readySet = new Set(listPublishReadyCardIds(paths));

  for (const card of cards) {
    if (card.skipped) {
      result.skipped.push(card.id);
      continue;
    }
    if (!readySet.has(card.id)) {
      const found = findRenderMetaForCard(paths, card.id);
      if (!found) result.publishSkipped.push(card.id);
      else if (found.meta.failedQa) result.publishSkipped.push(card.id);
      else result.publishSkipped.push(card.id);
      continue;
    }
    try {
      await runPublish(paths, card.id, { deferStorybookRegen: true });
      result.published.push(card.id);
    } catch (e) {
      result.errors.push({
        cardId: card.id,
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
