import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ensureUniqueBlockAndCardIds, slugifyBlockOrCardId } from './ensure-unique-content.js';
import type { ContentBlock } from '../types/index.js';

describe('ensureUniqueBlockAndCardIds', () => {
  it('gives distinct block ids when titles are Cyrillic-only', () => {
    const blocks: ContentBlock[] = [
      {
        id: 'icon',
        title: 'Мероприятия',
        cards: [{ id: 'icon', title: 'Карточка A' }],
      },
      {
        id: 'icon',
        title: 'Отсутствие контроля',
        cards: [{ id: 'icon', title: 'Карточка B' }],
      },
    ];
    const out = ensureUniqueBlockAndCardIds(blocks);
    assert.notEqual(out[0].id, out[1].id);
    assert.notEqual(out[0].cards[0].id, out[1].cards[0].id);
  });

  it('dedupes duplicate slugs with numeric suffix', () => {
    const blocks: ContentBlock[] = [
      { id: 'features', title: 'Features', cards: [{ title: 'One' }] },
      { id: 'features', title: 'Features 2', cards: [{ title: 'Two' }] },
    ];
    const out = ensureUniqueBlockAndCardIds(blocks);
    assert.equal(out[0].id, 'features');
    assert.equal(out[1].id, 'features-2');
  });
});

describe('slugifyBlockOrCardId', () => {
  it('uses hash prefix for empty latin slug', () => {
    const id = slugifyBlockOrCardId(undefined, 'Урожай', 'card');
    assert.ok(id.startsWith('card-'));
    assert.notEqual(id, 'icon');
  });
});
