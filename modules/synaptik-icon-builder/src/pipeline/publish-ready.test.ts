import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { writeJsonFile, readJsonFile } from '../fs-json.js';
import { getSessionPaths, getGeneratedIconDir } from '../paths.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  SelectionsFileSchema,
  StyleDNASchema,
} from '../types/index.js';
import { listPublishReadyCardIds } from './publish-ready.js';

test('listPublishReadyCardIds skips failedQa and skipped cards', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-ready-'));
  process.env.SYNAPTIK_ICONS_DIR = path.join(tmp, 'generated-icons');
  const sessionId = 'ready1234';
  const paths = getSessionPaths(sessionId);
  fs.mkdirSync(paths.sessionDir, { recursive: true });
  fs.mkdirSync(paths.rendersDir, { recursive: true });

  writeJsonFile(paths.styleDna, {
    projectSlug: 'demo',
    industry: 'tech',
    rendering: 'flat',
    siteVisualStyle: 'x',
    materials: [],
    palette: ['#000', '#111', '#222'],
    lighting: 'soft',
    background: 'white',
    brandCharacter: 'pro',
    styleLabel: 'demo',
    createdAt: new Date().toISOString(),
  });

  writeJsonFile(paths.contentCards, {
    cards: [
      { id: 'ok-card', title: 'OK', blockId: 'b', blockTitle: 'B' },
      { id: 'bad-qa', title: 'Bad', blockId: 'b', blockTitle: 'B', skipped: false },
      { id: 'skipped-card', title: 'Skip', blockId: 'b', blockTitle: 'B', skipped: true },
    ],
    maxCards: 3,
    generatedAt: new Date().toISOString(),
  });

  writeJsonFile(paths.selections, {
    selections: [
      { cardId: 'ok-card', conceptId: 'A' },
      { cardId: 'bad-qa', conceptId: 'A' },
    ],
    updatedAt: new Date().toISOString(),
  });

  for (const [id, failedQa] of [
    ['ok-card', false],
    ['bad-qa', true],
  ] as const) {
    const dir = path.join(paths.rendersDir, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'icon.png'), Buffer.from([0x89, 0x50]));
    writeJsonFile(
      path.join(dir, 'meta.json'),
      AssetMetaSchema.parse({
        name: 'T',
        category: 'T',
        style: 's',
        createdBy: 't',
        cardId: id,
        sessionId,
        ...(failedQa ? { failedQa: true } : {}),
      }),
    );
  }

  const ready = listPublishReadyCardIds(paths);
  assert.deepEqual(ready, ['ok-card']);

  delete process.env.SYNAPTIK_ICONS_DIR;
});
