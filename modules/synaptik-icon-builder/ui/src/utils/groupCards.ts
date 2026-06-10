import { t } from '../i18n/ru.js';
import { blockMatchesSearch, filterCardsBySearch } from './filterCards.js';
import type { Card, CardUiState, ContentBlock } from '../types.js';

function normalizeCardId(id: string | undefined, title: string): string {
  const raw = id?.trim() || title;
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+)|(-+$)/g, '')
    .slice(0, 64);
}

function resolveCardForDraft(
  filtered: Card[],
  blockId: string,
  draft: { id?: string; title: string },
): Card | undefined {
  const norm = normalizeCardId(draft.id, draft.title);
  for (const c of filtered) {
    if (c.blockId !== blockId) continue;
    if (normalizeCardId(c.id, c.title) === norm) return c;
    if (c.title === draft.title) return c;
  }
  return undefined;
}

export function blockUiKey(block: ContentBlock): string {
  const order = block.sortOrder ?? 0;
  return `${order}-${block.id}`;
}

export interface CardBlockGroup {
  blockKey: string;
  blockTitle: string;
  blockDescription?: string;
  sourcePageUrl?: string;
  sourcePageTitle?: string;
  cards: Card[];
}

export function groupCardsByBlock(
  cardList: Card[],
  blocks?: ContentBlock[],
  searchQuery?: string,
): CardBlockGroup[] {
  const filtered = filterCardsBySearch(cardList, searchQuery ?? '');

  if (blocks?.length) {
    const groups: CardBlockGroup[] = [];

    const sorted = [...blocks].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    for (const block of sorted) {
      const cards: Card[] = [];
      for (const draft of block.cards) {
        const card = resolveCardForDraft(filtered, block.id, draft);
        if (card && !cards.some((c) => c.id === card.id)) cards.push(card);
      }
      if (cards.length === 0) continue;
      if (searchQuery?.trim() && !blockMatchesSearch(block, cards, searchQuery)) {
        const anyCard = cards.some((c) => filterCardsBySearch([c], searchQuery).length > 0);
        if (!anyCard) continue;
      }
      groups.push({
        blockKey: blockUiKey(block),
        blockTitle: block.title,
        blockDescription: block.description,
        sourcePageUrl: block.sourcePageUrl,
        sourcePageTitle: block.sourcePageTitle,
        cards: filterCardsBySearch(cards, searchQuery ?? ''),
      });
    }

    const groupedIds = new Set(groups.flatMap((g) => g.cards.map((c) => c.id)));
    const orphan = filtered.filter((c) => !groupedIds.has(c.id));
    if (orphan.length > 0) {
      groups.push({
        blockKey: 'general',
        blockTitle: t.defaultBlockTitle,
        cards: orphan,
      });
    }

    return groups.filter((g) => g.cards.length > 0);
  }

  const map = new Map<string, CardBlockGroup>();
  for (const card of filtered) {
    const key = card.blockId ?? card.blockTitle ?? 'general';
    const title = card.blockTitle ?? t.defaultBlockTitle;
    if (!map.has(key)) {
      map.set(key, {
        blockKey: key,
        blockTitle: title,
        sourcePageUrl: card.sourcePageUrl,
        sourcePageTitle: card.sourcePageTitle,
        cards: [],
      });
    }
    map.get(key)!.cards.push(card);
  }
  return [...map.values()];
}

export function blockStats(
  cards: Card[],
  cardUi: Record<string, CardUiState>,
): { total: number; preview: number; published: number; outdated: number } {
  let preview = 0;
  let published = 0;
  let outdated = 0;
  for (const card of cards) {
    const st = cardUi[card.id];
    if (st?.needsRepublish) outdated++;
    else if (st?.phase === 'published') published++;
    else if (st?.previewSrc || st?.phase === 'rendered') preview++;
  }
  return { total: cards.length, preview, published, outdated };
}
