import { createHash } from 'node:crypto';
import { slugify } from '../paths.js';
import { ContentBlockSchema, type ContentBlock } from '../types/index.js';

/** Stable id when slugify strips Cyrillic to empty. */
export function contentIdFromTitle(title: string, prefix = 'id'): string {
  const trimmed = title.trim() || 'untitled';
  const hash = createHash('sha256').update(trimmed, 'utf8').digest('hex').slice(0, 10);
  return `${prefix}-${hash}`;
}

export function slugifyBlockOrCardId(rawId: string | undefined, title: string, prefix: string): string {
  const fromRaw = rawId?.trim() ? slugify(rawId) : '';
  if (fromRaw && fromRaw !== 'icon') return fromRaw;
  const fromTitle = slugify(title);
  if (fromTitle && fromTitle !== 'icon') return fromTitle;
  return contentIdFromTitle(title, prefix);
}

/**
 * Ensures unique block.id and card.id within a structure file.
 * Fixes Cyrillic collisions that all collapsed to "icon".
 */
export function ensureUniqueBlockAndCardIds(blocks: ContentBlock[]): ContentBlock[] {
  const usedBlockIds = new Set<string>();
  const usedCardIds = new Set<string>();

  return blocks.map((block, blockIndex) => {
    let blockId = slugifyBlockOrCardId(block.id, block.title, 'block');
    if (usedBlockIds.has(blockId)) {
      let n = 2;
      while (usedBlockIds.has(`${blockId}-${n}`)) n++;
      blockId = `${blockId}-${n}`;
    }
    usedBlockIds.add(blockId);

    const cards = block.cards.map((c, cardIndex) => {
      let cardId = slugifyBlockOrCardId(
        c.id && c.id.length > 0 ? c.id : undefined,
        c.title,
        'card',
      );
      if (usedCardIds.has(cardId)) {
        let n = 2;
        while (usedCardIds.has(`${cardId}-${n}`)) n++;
        cardId = `${cardId}-${n}`;
      }
      usedCardIds.add(cardId);
      return { ...c, id: cardId };
    });

    return ContentBlockSchema.parse({
      ...block,
      id: blockId,
      sortOrder: block.sortOrder ?? blockIndex,
      cards,
    });
  });
}
