import { slugify, type SessionPaths } from '../paths.js';
import { loadContentBlocks, writeContentFromBlocks } from './content-structure.js';

export function setCardSkipped(
  paths: SessionPaths,
  cardId: string,
  skipped: boolean,
): void {
  const blocks = loadContentBlocks(paths);
  let found = false;
  for (const block of blocks) {
    for (const card of block.cards) {
      const id =
        card.id && card.id.length > 0 ? card.id : slugify(card.title) || card.title;
      if (id === cardId) {
        card.skipped = skipped;
        found = true;
      }
    }
  }
  if (!found) throw new Error(`Unknown card: ${cardId}`);
  writeContentFromBlocks(paths, blocks);
}
