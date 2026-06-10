import fs from 'node:fs';
import path from 'node:path';
import { fileExists, readJsonFile } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  SelectionsFileSchema,
} from '../types/index.js';
import { getIconSetStyle } from '../icon-set-styles/index.js';
import { readIconStyleBible, resolveSessionIconSetStyleId } from './icon-style-bible.js';

export function printSessionStatus(paths: SessionPaths): void {
  const rows: string[][] = [['Step', 'Status']];

  const steps: Array<[string, boolean]> = [
    ['manifest', fileExists(paths.manifest)],
    ['capture-report', fileExists(paths.captureReport)],
    ['style-dna', fileExists(paths.styleDna)],
    ['content-structure', fileExists(paths.contentStructure)],
    ['content-cards', fileExists(paths.contentCards)],
    ['selections', fileExists(paths.selections)],
  ];

  for (const [name, ok] of steps) {
    rows.push([name, ok ? 'ok' : 'pending']);
  }

  console.log('\nSession:', paths.sessionId);
  const styleId = readIconStyleBible(paths)?.iconSetStyleId ?? resolveSessionIconSetStyleId(paths);
  console.log('Icon set style:', `${styleId} (${getIconSetStyle(styleId).labelEn})`);
  console.table(rows.slice(1).map(([Step, Status]) => ({ Step, Status })));

  if (fileExists(paths.contentCards)) {
    const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
    const { selections } = fileExists(paths.selections)
      ? readJsonFile(paths.selections, SelectionsFileSchema)
      : { selections: [] };

    console.log('\nCards:');
    for (const card of cards) {
      const sel = selections.find((s) => s.cardId === card.id);
      const conceptFile = path.join(paths.conceptsDir, `${slugify(card.id)}.json`);
      const hasConcepts = fs.existsSync(conceptFile);
      let rendered = false;
      let published = false;

      if (fs.existsSync(paths.rendersDir)) {
        for (const d of fs.readdirSync(paths.rendersDir)) {
          const metaPath = path.join(paths.rendersDir, d, 'meta.json');
          if (!fs.existsSync(metaPath)) continue;
          const meta = readJsonFile(metaPath, AssetMetaSchema);
          if (meta.cardId === card.id) rendered = true;
        }
      }

      const block = card.blockTitle ? ` [${card.blockTitle}]` : '';
      console.log(
        `  - ${card.id}${block}: concepts=${hasConcepts ? 'yes' : 'no'} selected=${sel?.conceptId ?? '-'} rendered=${rendered ? 'yes' : 'no'}`,
      );
    }
  }
}
