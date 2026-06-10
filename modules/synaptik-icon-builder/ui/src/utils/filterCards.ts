import type { Card, ContentBlock } from '../types.js';

export function cardMatchesSearch(card: Card, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    card.title,
    card.description,
    card.blockTitle,
    card.blockId,
    card.sourcePageUrl,
    card.sourcePageTitle,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export function blockMatchesSearch(
  block: ContentBlock,
  cards: Card[],
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blockHay = [block.title, block.description, block.sourcePageUrl, block.sourcePageTitle]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (blockHay.includes(q)) return true;
  return cards.some((c) => cardMatchesSearch(c, q));
}

export function filterCardsBySearch(cards: Card[], query: string): Card[] {
  if (!query.trim()) return cards;
  return cards.filter((c) => cardMatchesSearch(c, query));
}
