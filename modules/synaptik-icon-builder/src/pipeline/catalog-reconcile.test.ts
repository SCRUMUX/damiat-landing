import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import { getSessionPaths } from '../paths.js';
import { AssetMetaSchema, ContentCardsFileSchema } from '../types/index.js';
import { reconcileSessionRenders } from './catalog-reconcile.js';

test('reconcileSessionRenders matches render to card by sourceCard title', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-reconcile-'));
  const sessionId = 'abc12345';
  const paths = getSessionPaths(sessionId);
  fs.mkdirSync(paths.sessionDir, { recursive: true });
  fs.mkdirSync(paths.rendersDir, { recursive: true });

  writeJsonFile(paths.contentCards, {
    cards: [
      {
        id: 'new-card-id',
        title: 'Динамика по месяцам',
        blockId: 'b1',
        blockTitle: 'Block',
      },
    ],
    maxCards: 1,
    generatedAt: new Date().toISOString(),
  });

  const renderDir = path.join(paths.rendersDir, 'old-slug');
  fs.mkdirSync(renderDir, { recursive: true });
  writeJsonFile(
    path.join(renderDir, 'meta.json'),
    AssetMetaSchema.parse({
      name: 'Old',
      category: 'Test',
      style: 'test',
      createdBy: 'test',
      cardId: 'dinamika-po-mesyatsam',
      sourceCard: 'Динамика по месяцам',
      sessionId,
    }),
  );

  const result = reconcileSessionRenders(paths);
  assert.equal(result.renderCardIdsUpdated.length, 1);
  const meta = readJsonFile(path.join(renderDir, 'meta.json'), AssetMetaSchema);
  assert.equal(meta.cardId, 'new-card-id');
});
