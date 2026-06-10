import { slugify } from '../paths.js';
import {
  ContentBlockSchema,
  type ContentBlock,
} from '../types/index.js';
import { slugifyBlockOrCardId } from './ensure-unique-content.js';

function prefixId(pageSlug: string, id: string, title: string): string {
  const base = slugifyBlockOrCardId(id, title, 'item');
  if (base.startsWith(`${pageSlug}-`)) return base;
  return `${pageSlug}-${base}`;
}

/** Prefix block/card ids and attach page metadata (for extend-page merge). */
export function namespaceBlocksForPage(
  blocks: ContentBlock[],
  pageSlug: string,
  sourcePageUrl: string,
  sourcePageTitle?: string,
  sortStart = 0,
): ContentBlock[] {
  return blocks.map((b, i) =>
    ContentBlockSchema.parse({
      ...b,
      id: prefixId(pageSlug, b.id, b.title),
      sourcePageUrl,
      sourcePageTitle,
      sortOrder: sortStart + i,
      cards: b.cards.map((c) => ({
        ...c,
        id: prefixId(pageSlug, c.id && c.id.length > 0 ? c.id : '', c.title),
      })),
    }),
  );
}

export function mergeContentBlocks(
  existing: ContentBlock[],
  incoming: ContentBlock[],
): ContentBlock[] {
  const usedBlockIds = new Set(existing.map((b) => b.id));
  const usedCardIds = new Set(
    existing.flatMap((b) =>
      b.cards.map((c) =>
        slugifyBlockOrCardId(c.id && c.id.length > 0 ? c.id : undefined, c.title, 'card'),
      ),
    ),
  );

  const merged = [...existing];
  let sort = existing.length;

  for (const block of incoming) {
    let blockId = slugifyBlockOrCardId(block.id, block.title, 'block');
    if (usedBlockIds.has(blockId)) {
      let n = 2;
      while (usedBlockIds.has(`${blockId}-${n}`)) n++;
      blockId = `${blockId}-${n}`;
    }
    usedBlockIds.add(blockId);

    const cards = block.cards.map((c) => {
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

    merged.push(
      ContentBlockSchema.parse({
        ...block,
        id: blockId,
        sortOrder: block.sortOrder ?? sort++,
        cards,
      }),
    );
  }

  return merged;
}
